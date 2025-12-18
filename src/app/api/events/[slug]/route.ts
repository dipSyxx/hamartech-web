import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { slug },
      include: { venue: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("get event by slug error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
