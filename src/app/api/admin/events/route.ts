import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateEventSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  trackId: z.enum(['creative', 'games', 'xr', 'youth', 'business']),
  dayId: z.enum(['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']),
  dayLabel: z.string().min(1),
  weekday: z.string().min(1),
  dateLabel: z.string().min(1),
  timeLabel: z.string().min(1),
  targetGroup: z.string().min(1),
  host: z.string().min(1),
  isFree: z.boolean(),
  requiresRegistration: z.boolean(),
  venueId: z.string(),
  venueLabel: z.string().min(1),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
})

const UpdateEventSchema = CreateEventSchema.partial()

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  return session
}

async function createAuditLog(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  meta?: any,
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action: action as any,
        entityType,
        entityId,
        meta: meta ? JSON.parse(JSON.stringify(meta)) : null,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await checkAdmin()
    const actorId = (session.user as any).id

    const body = await req.json()
    const parsed = CreateEventSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 })
    }

    const data = parsed.data

    // Check if slug exists
    const existing = await prisma.event.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    // Check if venue exists
    const venue = await prisma.venue.findUnique({ where: { id: data.venueId } })
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    const event = await prisma.event.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        trackId: data.trackId,
        dayId: data.dayId,
        dayLabel: data.dayLabel,
        weekday: data.weekday,
        dateLabel: data.dateLabel,
        timeLabel: data.timeLabel,
        targetGroup: data.targetGroup,
        host: data.host,
        isFree: data.isFree,
        requiresRegistration: data.requiresRegistration,
        venueId: data.venueId,
        venueLabel: data.venueLabel,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
      },
      include: { venue: true },
    })

    await createAuditLog(actorId, 'EVENT_CREATE', 'Event', event.id, {
      slug: event.slug,
      title: event.title,
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Events API POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await checkAdmin()
    const actorId = (session.user as any).id

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const parsed = UpdateEventSchema.safeParse(updateData)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 })
    }

    const data: any = {}
    if (parsed.data.slug !== undefined) data.slug = parsed.data.slug
    if (parsed.data.title !== undefined) data.title = parsed.data.title
    if (parsed.data.description !== undefined) data.description = parsed.data.description
    if (parsed.data.trackId !== undefined) data.trackId = parsed.data.trackId
    if (parsed.data.dayId !== undefined) data.dayId = parsed.data.dayId
    if (parsed.data.dayLabel !== undefined) data.dayLabel = parsed.data.dayLabel
    if (parsed.data.weekday !== undefined) data.weekday = parsed.data.weekday
    if (parsed.data.dateLabel !== undefined) data.dateLabel = parsed.data.dateLabel
    if (parsed.data.timeLabel !== undefined) data.timeLabel = parsed.data.timeLabel
    if (parsed.data.targetGroup !== undefined) data.targetGroup = parsed.data.targetGroup
    if (parsed.data.host !== undefined) data.host = parsed.data.host
    if (parsed.data.isFree !== undefined) data.isFree = parsed.data.isFree
    if (parsed.data.requiresRegistration !== undefined) data.requiresRegistration = parsed.data.requiresRegistration
    if (parsed.data.venueId !== undefined) data.venueId = parsed.data.venueId
    if (parsed.data.venueLabel !== undefined) data.venueLabel = parsed.data.venueLabel
    if (parsed.data.startsAt !== undefined) data.startsAt = parsed.data.startsAt ? new Date(parsed.data.startsAt) : null
    if (parsed.data.endsAt !== undefined) data.endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null

    // Check if slug exists (if updating)
    if (data.slug) {
      const existing = await prisma.event.findUnique({ where: { slug: data.slug } })
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
      }
    }

    // Check if venue exists (if updating)
    if (data.venueId) {
      const venue = await prisma.venue.findUnique({ where: { id: data.venueId } })
      if (!venue) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
      }
    }

    const oldEvent = await prisma.event.findUnique({ where: { id } })
    if (!oldEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const event = await prisma.event.update({
      where: { id },
      data,
      include: { venue: true },
    })

    await createAuditLog(actorId, 'EVENT_UPDATE', 'Event', event.id, {
      slug: event.slug,
      title: event.title,
    })

    return NextResponse.json({ event })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Events API PUT error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await checkAdmin()
    const actorId = (session.user as any).id

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({ where: { id } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    await prisma.event.delete({ where: { id } })

    await createAuditLog(actorId, 'EVENT_DELETE', 'Event', id, {
      slug: event.slug,
      title: event.title,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Events API DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

