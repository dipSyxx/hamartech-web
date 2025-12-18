import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";

import { verifyTicket } from "@/lib/tickets/sign";
import { ticketLink } from "@/lib/tickets/qr";

function clampSize(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(120, Math.min(1024, Math.floor(value)));
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Validate signature/expiry early to avoid generating QR for invalid tokens.
    verifyTicket(token);

    const size = clampSize(
      Number(req.nextUrl.searchParams.get("size") ?? "260"),
      260
    );

    const content = ticketLink(token);
    const png = await QRCode.toBuffer(content, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 1,
      width: size,
    });

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Invalid token" },
      { status: 400 }
    );
  }
}
