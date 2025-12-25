import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user as any)?.role

    if (!session || role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users statistics
    const [totalUsers, usersByRole, verifiedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      prisma.user.count({
        where: { emailVerifiedAt: { not: null } },
      }),
    ])

    // Events statistics
    const [totalEvents, eventsByTrack, eventsByDay] = await Promise.all([
      prisma.event.count(),
      prisma.event.groupBy({
        by: ['trackId'],
        _count: true,
      }),
      prisma.event.groupBy({
        by: ['dayId'],
        _count: true,
      }),
    ])

    // Venues statistics
    const [totalVenues, venuesByCity] = await Promise.all([
      prisma.venue.count(),
      prisma.venue.groupBy({
        by: ['city'],
        _count: true,
      }),
    ])

    // Reservations statistics
    const [totalReservations, reservationsByStatus, reservationsWithCheckIn] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.reservation.count({
        where: {
          checkIns: {
            some: {},
          },
        },
      }),
    ])

    // Check-ins statistics
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const [totalCheckIns, checkInsLastWeek] = await Promise.all([
      prisma.reservationCheckIn.count(),
      prisma.reservationCheckIn.count({
        where: {
          scannedAt: {
            gte: oneWeekAgo,
          },
        },
      }),
    ])

    // Audit logs - recent activity
    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        byRole: usersByRole.reduce(
          (acc, item) => {
            acc[item.role] = item._count
            return acc
          },
          {} as Record<string, number>,
        ),
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers,
      },
      events: {
        total: totalEvents,
        byTrack: eventsByTrack.reduce(
          (acc, item) => {
            acc[item.trackId] = item._count
            return acc
          },
          {} as Record<string, number>,
        ),
        byDay: eventsByDay.reduce(
          (acc, item) => {
            acc[item.dayId] = item._count
            return acc
          },
          {} as Record<string, number>,
        ),
      },
      venues: {
        total: totalVenues,
        byCity: venuesByCity.reduce(
          (acc, item) => {
            acc[item.city] = item._count
            return acc
          },
          {} as Record<string, number>,
        ),
      },
      reservations: {
        total: totalReservations,
        byStatus: reservationsByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count
            return acc
          },
          {} as Record<string, number>,
        ),
        withCheckIn: reservationsWithCheckIn,
        withoutCheckIn: totalReservations - reservationsWithCheckIn,
      },
      checkIns: {
        total: totalCheckIns,
        lastWeek: checkInsLastWeek,
      },
      auditLogs: {
        recent: recentAuditLogs,
      },
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

