import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function GET(req: Request) {
  try {
    await checkAdmin()

    const { searchParams } = new URL(req.url)
    const reservationId = searchParams.get('reservationId')
    const userId = searchParams.get('userId')
    const eventId = searchParams.get('eventId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where: any = {}
    if (reservationId) {
      where.reservationId = reservationId
    }
    if (userId) {
      where.reservation = { userId }
    }
    if (eventId) {
      where.reservation = { eventId }
    }
    if (from || to) {
      where.scannedAt = {}
      if (from) {
        where.scannedAt.gte = new Date(from)
      }
      if (to) {
        where.scannedAt.lte = new Date(to)
      }
    }

    const checkIns = await prisma.reservationCheckIn.findMany({
      where,
      include: {
        reservation: {
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
                slug: true,
              },
            },
          },
        },
        scannedBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { scannedAt: 'desc' },
    })

    return NextResponse.json({ checkIns })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Check-ins API GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await checkAdmin()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Check-in ID is required' }, { status: 400 })
    }

    const checkIn = await prisma.reservationCheckIn.findUnique({ where: { id } })
    if (!checkIn) {
      return NextResponse.json({ error: 'Check-in not found' }, { status: 404 })
    }

    await prisma.reservationCheckIn.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Check-ins API DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

