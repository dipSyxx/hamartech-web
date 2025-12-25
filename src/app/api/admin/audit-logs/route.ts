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
    const action = searchParams.get('action')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (action) {
      where.action = action
    }
    if (entityType) {
      where.entityType = entityType
    }
    if (entityId) {
      where.entityId = entityId
    }
    if (from || to) {
      where.createdAt = {}
      if (from) {
        where.createdAt.gte = new Date(from)
      }
      if (to) {
        where.createdAt.lte = new Date(to)
      }
    }

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({ auditLogs, total, limit, offset })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Audit logs API GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

