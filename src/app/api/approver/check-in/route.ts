import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { verifyTicket } from "@/lib/tickets/sign";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const role = (session?.user as any)?.role;

    if (!userId || (role !== "ADMIN" && role !== "APPROVER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const token = body?.token as string | undefined;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const payload = verifyTicket(token);
    const reservation = await prisma.reservation.findUnique({
      where: { id: payload.reservationId },
    });

    if (!reservation || reservation.ticketCode !== payload.ticketCode) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    if (reservation.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Reservation is not confirmed" },
        { status: 400 }
      );
    }

    const existingCheckIn = await prisma.reservationCheckIn.findFirst({
      where: { reservationId: reservation.id },
    });
    if (existingCheckIn) {
      return NextResponse.json(
        { error: "Already checked in" },
        { status: 409 }
      );
    }

    const checkIn = await prisma.reservationCheckIn.create({
      data: {
        reservationId: reservation.id,
        scannedById: userId,
      },
    });

    return NextResponse.json({ ok: true, checkIn });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
