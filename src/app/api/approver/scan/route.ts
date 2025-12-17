import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyTicket } from "@/lib/tickets/sign";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "APPROVER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const payload = verifyTicket(token);
    const reservation = await prisma.reservation.findUnique({
      where: { id: payload.reservationId },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true } },
        event: { include: { venue: true } },
        checkIns: true,
      },
    });

    if (!reservation || reservation.ticketCode !== payload.ticketCode) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      reservation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Invalid token" },
      { status: 400 }
    );
  }
}
