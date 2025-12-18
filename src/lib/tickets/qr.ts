import { signTicket, type TicketPayload } from "./sign";
import QRCode from "qrcode";

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}

export function createTicketToken(payload: TicketPayload) {
  return signTicket(payload);
}

export function ticketLink(token: string) {
  const base = appUrl();
  if (base) {
    return `${base.replace(/\/$/, "")}/qr/${token}`;
  }
  return `HT:${token}`;
}

export function ticketQrImageUrl(token: string, size = 260) {
  const base = appUrl();
  const path = `/api/qr?token=${encodeURIComponent(token)}&size=${encodeURIComponent(
    String(size)
  )}`;
  return base ? `${base.replace(/\/$/, "")}${path}` : path;
}

export async function ticketQrDataUrl(token: string, size = 260) {
  const content = ticketLink(token);
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: size,
  });
}
