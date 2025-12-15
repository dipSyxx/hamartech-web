import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const RegisterSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z
    .string()
    .trim()
    .min(4)
    .max(30),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = RegisterSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    const phoneExists = await prisma.user.findUnique({ where: { phone } });
    if (phoneExists) {
      return NextResponse.json(
        { ok: false, message: "Phone already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        phone,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
        { ok: false, message: "Invalid request" },
        { status: 400 }
      );
  }
}
