import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().trim().min(4).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['USER', 'ADMIN', 'APPROVER']).optional(),
  emailVerified: z.boolean().optional(),
})

const UpdateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().trim().min(4).max(30).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(['USER', 'ADMIN', 'APPROVER']).optional(),
  emailVerified: z.boolean().optional(),
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
    const role = searchParams.get('role')
    const verified = searchParams.get('verified')
    const search = searchParams.get('search')

    const where: any = {}
    if (role) {
      where.role = role
    }
    if (verified !== null) {
      if (verified === 'true') {
        where.emailVerifiedAt = { not: null }
      } else {
        where.emailVerifiedAt = null
      }
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reservations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Users API GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await checkAdmin()
    const actorId = (session.user as any).id

    const body = await req.json()
    const parsed = CreateUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const { name, phone, email, password, role = 'USER', emailVerified = false } = parsed.data

    // Check for existing user
    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    const existingPhone = await prisma.user.findUnique({ where: { phone } })
    if (existingPhone) {
      return NextResponse.json({ error: 'Phone already exists' }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash,
        role,
        emailVerifiedAt: emailVerified ? new Date() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    await createAuditLog(actorId, 'USER_ROLE_CHANGE', 'User', user.id, {
      action: 'CREATE',
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Users API POST error:', error)
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
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const parsed = UpdateUserSchema.safeParse(updateData)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const data: any = {}
    if (parsed.data.name !== undefined) data.name = parsed.data.name
    if (parsed.data.phone !== undefined) data.phone = parsed.data.phone
    if (parsed.data.email !== undefined) data.email = parsed.data.email
    if (parsed.data.password !== undefined) {
      data.passwordHash = await hash(parsed.data.password, 12)
    }
    if (parsed.data.role !== undefined) data.role = parsed.data.role
    if (parsed.data.emailVerified !== undefined) {
      data.emailVerifiedAt = parsed.data.emailVerified ? new Date() : null
    }

    // Check for conflicts if updating email or phone
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } })
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
      }
    }
    if (data.phone) {
      const existing = await prisma.user.findUnique({ where: { phone: data.phone } })
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: 'Phone already exists' }, { status: 409 })
      }
    }

    const oldUser = await prisma.user.findUnique({ where: { id } })
    if (!oldUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Log role changes
    if (data.role && data.role !== oldUser.role) {
      await createAuditLog(actorId, 'USER_ROLE_CHANGE', 'User', user.id, {
        action: 'UPDATE',
        oldRole: oldUser.role,
        newRole: data.role,
        email: user.email,
      })
    }

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Users API PUT error:', error)
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
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deleting yourself
    if (user.id === actorId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id } })

    await createAuditLog(actorId, 'USER_ROLE_CHANGE', 'User', id, {
      action: 'DELETE',
      email: user.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Users API DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

