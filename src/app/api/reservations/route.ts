import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import crypto from "crypto";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTicketToken } from "@/lib/tickets/qr";
import type { ReservationStatus } from "@/prisma/generated/prisma/client";

const CreateReservationSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

function generateTicketCode() {
  return crypto.randomBytes(10).toString("hex");
}

function computeStatus(requiresRegistration: boolean): ReservationStatus {
  return requiresRegistration ? "WAITLIST" : "CONFIRMED";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateReservationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { slug, quantity } = parsed.data;
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // If registration not required, allow auto-confirm or handle separately
    const baseStatus = computeStatus(event.requiresRegistration);

    const existing = await prisma.reservation.findUnique({
      where: { userId_eventId: { userId, eventId: event.id } },
    });

    const ticketCode = existing?.ticketCode ?? generateTicketCode();
    const status = existing ? existing.status : baseStatus;

    const reservation = await prisma.reservation.upsert({
      where: { userId_eventId: { userId, eventId: event.id } },
      update: {
        quantity,
        ticketCode,
        status,
      },
      create: {
        userId,
        eventId: event.id,
        quantity,
        ticketCode,
        status,
      },
    });

    const token = createTicketToken({
      reservationId: reservation.id,
      ticketCode,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ ok: true, reservation, ticketToken: token });
  } catch (error) {
    console.error("create reservation error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
