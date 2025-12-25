import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateVenueSchema = z.object({
  name: z.string().min(1).max(200),
  label: z.string().min(1).max(200),
  address: z.string().max(500).optional().nullable(),
  city: z.string().min(1).max(100),
  country: z.string().max(100).optional().nullable(),
  mapQuery: z.string().min(1),
  googleMapsUrl: z.string().url(),
  openStreetMapUrl: z.string().url(),
})

const UpdateVenueSchema = CreateVenueSchema.partial()

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

export async function GET() {
  try {
    await checkAdmin()

    const venues = await prisma.venue.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    })

    return NextResponse.json({ venues })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Venues API GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await checkAdmin()
    const actorId = (session.user as any).id

    const body = await req.json()
    const parsed = CreateVenueSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.errors }, { status: 400 })
    }

    const venue = await prisma.venue.create({
      data: {
        name: parsed.data.name,
        label: parsed.data.label,
        address: parsed.data.address || null,
        city: parsed.data.city,
        country: parsed.data.country || 'Norway',
        mapQuery: parsed.data.mapQuery,
        googleMapsUrl: parsed.data.googleMapsUrl,
        openStreetMapUrl: parsed.data.openStreetMapUrl,
      },
    })

    await createAuditLog(actorId, 'VENUE_CREATE', 'Venue', venue.id, {
      name: venue.name,
      label: venue.label,
    })

    return NextResponse.json({ venue }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Venues API POST error:', error)
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
      return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 })
    }

    const parsed = UpdateVenueSchema.safeParse(updateData)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.errors }, { status: 400 })
    }

    const data: any = {}
    if (parsed.data.name !== undefined) data.name = parsed.data.name
    if (parsed.data.label !== undefined) data.label = parsed.data.label
    if (parsed.data.address !== undefined) data.address = parsed.data.address
    if (parsed.data.city !== undefined) data.city = parsed.data.city
    if (parsed.data.country !== undefined) data.country = parsed.data.country
    if (parsed.data.mapQuery !== undefined) data.mapQuery = parsed.data.mapQuery
    if (parsed.data.googleMapsUrl !== undefined) data.googleMapsUrl = parsed.data.googleMapsUrl
    if (parsed.data.openStreetMapUrl !== undefined) data.openStreetMapUrl = parsed.data.openStreetMapUrl

    const oldVenue = await prisma.venue.findUnique({ where: { id } })
    if (!oldVenue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    const venue = await prisma.venue.update({
      where: { id },
      data,
    })

    await createAuditLog(actorId, 'VENUE_UPDATE', 'Venue', venue.id, {
      name: venue.name,
      label: venue.label,
    })

    return NextResponse.json({ venue })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Venues API PUT error:', error)
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
      return NextResponse.json({ error: 'Venue ID is required' }, { status: 400 })
    }

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    if (venue._count.events > 0) {
      return NextResponse.json(
        { error: `Cannot delete venue with ${venue._count.events} associated events` },
        { status: 400 },
      )
    }

    await prisma.venue.delete({ where: { id } })

    await createAuditLog(actorId, 'VENUE_DELETE', 'Venue', id, {
      name: venue.name,
      label: venue.label,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Venues API DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

