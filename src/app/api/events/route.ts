import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: { venue: true },
      orderBy: [{ dayId: "asc" }, { startsAt: "asc" }, { timeLabel: "asc" }],
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("list events error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
