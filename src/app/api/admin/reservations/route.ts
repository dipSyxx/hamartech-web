import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateReservationSchema = z.object({
  status: z.enum(['CONFIRMED', 'WAITLIST', 'CANCELLED']).optional(),
  quantity: z.number().int().min(1).optional(),
  cancelReason: z.string().optional().nullable(),
})

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

export async function GET(req: Request) {
  try {
    await checkAdmin()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('userId')
    const search = searchParams.get('search')

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (eventId) {
      where.eventId = eventId
    }
    if (userId) {
      where.userId = userId
    }
    if (search) {
      where.OR = [
        { ticketCode: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { event: { title: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        event: {
          select: {
            id: true,
            slug: true,
            title: true,
            dayLabel: true,
            timeLabel: true,
          },
        },
        checkIns: {
          orderBy: { scannedAt: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            checkIns: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Reservations API GET error:', error)
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
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
    }

    const parsed = UpdateReservationSchema.safeParse(updateData)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 })
    }

    const data: any = {}
    if (parsed.data.status !== undefined) {
      data.status = parsed.data.status
      if (parsed.data.status === 'CANCELLED') {
        data.cancelledById = actorId
        data.cancelledAt = new Date()
        if (parsed.data.cancelReason !== undefined) {
          data.cancelReason = parsed.data.cancelReason
        }
      } else if (parsed.data.status === 'CONFIRMED') {
        data.approvedById = actorId
        data.approvedAt = new Date()
      }
    }
    if (parsed.data.quantity !== undefined) {
      data.quantity = parsed.data.quantity
    }

    const oldReservation = await prisma.reservation.findUnique({ where: { id } })
    if (!oldReservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    const action =
      data.status === 'CONFIRMED'
        ? 'RESERVATION_APPROVE'
        : data.status === 'CANCELLED'
          ? 'RESERVATION_CANCEL'
          : 'RESERVATION_REJECT'

    await createAuditLog(actorId, action, 'Reservation', reservation.id, {
      status: reservation.status,
      eventTitle: reservation.event.title,
      userEmail: reservation.user.email,
    })

    return NextResponse.json({ reservation })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Reservations API PUT error:', error)
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
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    await prisma.reservation.delete({ where: { id } })

    await createAuditLog(actorId, 'RESERVATION_CANCEL', 'Reservation', id, {
      action: 'DELETE',
      eventTitle: reservation.event.title,
      userEmail: reservation.user.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Reservations API DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

