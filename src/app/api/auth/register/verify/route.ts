import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const VerifySchema = z.object({
  email: z.string().email(),
  code: z.string().trim().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { ok: false, message: "Email is already verified" },
        { status: 409 }
      );
    }

    const token = await prisma.emailVerificationCode.findFirst({
      where: { userId: user.id, usedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          message: "No verification code found. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (token.expiresAt < new Date()) {
      await prisma.emailVerificationCode.deleteMany({
        where: { userId: user.id },
      });

      return NextResponse.json(
        { ok: false, message: "Verification code has expired." },
        { status: 400 }
      );
    }

    const isValid = await compare(code, token.codeHash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    const verifiedAt = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.emailVerificationCode.update({
        where: { id: token.id },
        data: { usedAt: verifiedAt },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: verifiedAt },
      });

      await tx.emailVerificationCode.deleteMany({
        where: { userId: user.id, usedAt: null },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("register verify error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
