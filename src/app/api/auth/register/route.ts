import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const MAILEROO_API_URL = "https://smtp.maileroo.com/api/v2/emails/template";

const RegisterStartSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().trim().min(4).max(30),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

function generateCode(): string {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterStartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    const { name, phone, email, password } = parsed.data;

    const apiKey = process.env.MAILEROO_API_KEY;
    const fromAddress = process.env.MAILEROO_FROM_ADDRESS;
    const fromName = process.env.MAILEROO_FROM_NAME ?? "HamarTech";
    const brandName = process.env.MAILEROO_BRAND_NAME ?? fromName;
    const supportEmail =
      process.env.MAILEROO_SUPPORT_EMAIL ??
      process.env.SUPPORT_EMAIL ??
      fromAddress;
    const templateId = Number(process.env.MAILEROO_TEMPLATE_VERIFY_ID ?? "0");
    const ttlMinutes = Number(process.env.VERIFY_CODE_TTL_MINUTES ?? "10");

    if (!apiKey || !fromAddress || !templateId) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Mail sending is not configured. Please set MAILEROO_* environment variables.",
        },
        { status: 500 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser?.emailVerifiedAt) {
      return NextResponse.json(
        { ok: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    const phoneOwner = await prisma.user.findUnique({ where: { phone } });
    if (phoneOwner && phoneOwner.email !== email) {
      return NextResponse.json(
        { ok: false, message: "Phone number is already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user =
      existingUser ??
      (await prisma.user.create({
        data: {
          email,
          name,
          phone,
          passwordHash,
        },
      }));

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { name, phone, passwordHash },
      });
    }

    const code = generateCode();
    const codeHash = await hash(code, 12);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await prisma.emailVerificationCode.deleteMany({
      where: { userId: user.id },
    });

    await prisma.emailVerificationCode.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
      },
    });

    const payload = {
      from: {
        address: fromAddress,
        display_name: fromName,
      },
      to: [
        {
          address: email,
          display_name: name,
        },
      ],
      subject: "Din verifiseringskode",
      template_id: templateId,
      template_data: {
        code,
        expiryMinutes: ttlMinutes,
        name: name || "deg",
        brandName,
        supportEmail,
        year: new Date().getFullYear(),
      },
      tracking: true,
      tags: { type: "email-verification" },
    };

    const mailRes = await fetch(MAILEROO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const mailJson = await mailRes.json().catch(() => ({}));

    if (!mailRes.ok || mailJson?.success === false) {
      await prisma.emailVerificationCode.deleteMany({
        where: { userId: user.id },
      });

      return NextResponse.json(
        {
          ok: false,
          message:
            mailJson?.message ??
            "Failed to send verification email. Please try again.",
        },
        { status: mailRes.status || 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("register start error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
