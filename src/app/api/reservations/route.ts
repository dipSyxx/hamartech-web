import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import crypto from 'crypto'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createTicketToken, ticketLink, ticketQrDataUrl, ticketQrImageUrl } from '@/lib/tickets/qr'
import type { ReservationStatus } from '@/prisma/generated/prisma/client'

const CreateReservationSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
})

const MAILEROO_API_URL = 'https://smtp.maileroo.com/api/v2/emails/template'

function generateTicketCode() {
  return crypto.randomBytes(10).toString('hex')
}

function computeStatus(requiresRegistration: boolean): ReservationStatus {
  return requiresRegistration ? 'CONFIRMED' : 'CONFIRMED'
}

function computeTicketExpirySeconds(eventEndsAt: Date | null, reservationCreatedAt: Date) {
  const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30
  const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365

  if (eventEndsAt) {
    return Math.floor((eventEndsAt.getTime() + THIRTY_DAYS_MS) / 1000)
  }

  return Math.floor((reservationCreatedAt.getTime() + ONE_YEAR_MS) / 1000)
}

function formatDateToHumanReadable(date: Date): string {
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function sendReservationTicketEmail(input: {
  toEmail: string
  toName?: string | null
  ticketCode: string
  ticketUrl: string
  qrDataUrl: string
  reservation: {
    id: string
    status: string
    quantity: number
    createdAt: Date
    updatedAt: Date
  }
  event: {
    title: string
    description: string
    dayLabel: string
    weekday: string
    dateLabel: string
    timeLabel: string
    trackId: string
    targetGroup: string
    host: string
    isFree: boolean
    requiresRegistration: boolean
    startsAt: Date | null
    endsAt: Date | null
    venue: {
      name: string
      label: string
      address: string | null
      city: string
      country: string | null
      mapQuery: string
      googleMapsUrl: string
      openStreetMapUrl: string
    }
  }
}) {
  const apiKey = process.env.MAILEROO_API_KEY
  const fromAddress = process.env.MAILEROO_FROM_ADDRESS
  const fromName = process.env.MAILEROO_FROM_NAME ?? 'HamarTech'
  const brandName = process.env.MAILEROO_BRAND_NAME ?? fromName
  const supportEmail = process.env.MAILEROO_SUPPORT_EMAIL ?? process.env.SUPPORT_EMAIL ?? fromAddress
  const templateId = Number(process.env.MAILEROO_TEMPLATE_QR_ID ?? '0')

  if (!apiKey || !fromAddress || !templateId) {
    return { ok: false as const, error: 'Mail sending is not configured' }
  }

  const payload = {
    from: {
      address: fromAddress,
      display_name: fromName,
    },
    to: [
      {
        address: input.toEmail,
        display_name: input.toName ?? undefined,
      },
    ],
    subject: `${brandName} – Billett & reservasjon`,
    template_id: templateId,
    template_data: {
      brandName,
      supportEmail,
      year: new Date().getFullYear(),

      name: input.toName ?? '',

      reservationId: input.reservation.id,
      reservationStatus: input.reservation.status,
      quantity: input.reservation.quantity,
      reservationCreatedAt: formatDateToHumanReadable(input.reservation.createdAt),
      reservationUpdatedAt: formatDateToHumanReadable(input.reservation.updatedAt),

      ticketCode: input.ticketCode,
      ticketUrl: input.ticketUrl,
      qrDataUrl: input.qrDataUrl,

      eventTitle: input.event.title,
      eventDescription: input.event.description,
      dayLabel: input.event.dayLabel,
      weekday: input.event.weekday,
      dateLabel: input.event.dateLabel,
      timeLabel: input.event.timeLabel,
      trackId: input.event.trackId,
      targetGroup: input.event.targetGroup,
      host: input.event.host,
      startsAt: input.event.startsAt ? formatDateToHumanReadable(input.event.startsAt) : null,
      endsAt: input.event.endsAt ? formatDateToHumanReadable(input.event.endsAt) : null,

      venueName: input.event.venue.name,
      venueLabel: input.event.venue.label,
      venueAddress: input.event.venue.address,
      venueCity: input.event.venue.city,
      venueCountry: input.event.venue.country ?? 'Norway',
      venueMapQuery: input.event.venue.mapQuery,
      googleMapsUrl: input.event.venue.googleMapsUrl,
      openStreetMapUrl: input.event.venue.openStreetMapUrl,
    },
    tracking: true,
    tags: { type: 'reservation-ticket' },
  }

  const mailRes = await fetch(MAILEROO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  const mailJson = await mailRes.json().catch(() => ({}))

  if (!mailRes.ok || mailJson?.success === false) {
    const msg = mailJson?.message ?? 'Failed to send ticket email'
    return { ok: false as const, error: msg }
  }

  return { ok: true as const }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CreateReservationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const { slug, quantity } = parsed.data
    const event = await prisma.event.findUnique({
      where: { slug },
      include: { venue: true },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // If registration not required, allow auto-confirm or handle separately
    const baseStatus = computeStatus(event.requiresRegistration)

    const existing = await prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId: event.id } },
    })

    const ticketCode = existing?.ticketCode ?? generateTicketCode()
    const status = existing ? existing.status : baseStatus

    const reservation = await prisma.reservation.upsert({
      where: { userId_eventId: { userId, eventId: event.id } },
      update: {
        quantity,
        ticketCode,
        status,
      },
      create: {
        userId,
        eventId: event.id,
        quantity,
        ticketCode,
        status,
      },
    })

    const token = createTicketToken({
      reservationId: reservation.id,
      ticketCode,
      exp: computeTicketExpirySeconds(event.endsAt, reservation.createdAt),
    })

    const ticketUrl = ticketLink(token)
    const qrDataUrl = await ticketQrDataUrl(token)
    const qrImageUrl = ticketQrImageUrl(token)

    let emailSent = false
    if (!existing) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      })

      if (!user?.email) {
        return NextResponse.json({
          ok: true,
          reservation,
          ticketToken: token,
          ticketUrl,
          qrDataUrl,
          qrImageUrl,
          emailSent: false,
        })
      }

      const result = await sendReservationTicketEmail({
        toEmail: user.email,
        toName: user.name,
        ticketCode,
        ticketUrl,
        qrDataUrl: qrImageUrl, // Use URL instead of data URL for email compatibility
        reservation: {
          id: reservation.id,
          status: reservation.status,
          quantity: reservation.quantity,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
        },
        event: {
          title: event.title,
          description: event.description,
          dayLabel: event.dayLabel,
          weekday: event.weekday,
          dateLabel: event.dateLabel,
          timeLabel: event.timeLabel,
          trackId: event.trackId,
          targetGroup: event.targetGroup,
          host: event.host,
          isFree: event.isFree,
          requiresRegistration: event.requiresRegistration,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          venue: {
            name: event.venue.name,
            label: event.venue.label,
            address: event.venue.address,
            city: event.venue.city,
            country: event.venue.country,
            mapQuery: event.venue.mapQuery,
            googleMapsUrl: event.venue.googleMapsUrl,
            openStreetMapUrl: event.venue.openStreetMapUrl,
          },
        },
      })

      emailSent = result.ok
      if (!result.ok) {
        console.warn('ticket email not sent:', result.error)
      }
    }

    return NextResponse.json({
      ok: true,
      reservation,
      ticketToken: token,
      ticketUrl,
      qrDataUrl,
      qrImageUrl,
      emailSent,
    })
  } catch (error) {
    console.error('create reservation error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: { event: { include: { venue: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const dto = await Promise.all(
      reservations.map(async (reservation) => {
        const ticketCode = reservation.ticketCode
        const ticketToken = ticketCode
          ? createTicketToken({
              reservationId: reservation.id,
              ticketCode,
              exp: computeTicketExpirySeconds(reservation.event.endsAt, reservation.createdAt),
            })
          : null

        const ticketUrl = ticketToken ? ticketLink(ticketToken) : null
        const qrDataUrl = ticketToken ? ticketQrImageUrl(ticketToken) : null

        return {
          id: reservation.id,
          status: reservation.status,
          quantity: reservation.quantity,
          ticketCode: reservation.ticketCode,
          ticketToken,
          ticketUrl,
          qrDataUrl,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
          event: reservation.event,
        }
      }),
    )

    return NextResponse.json({ ok: true, reservations: dto })
  } catch (error) {
    console.error('list reservations error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
