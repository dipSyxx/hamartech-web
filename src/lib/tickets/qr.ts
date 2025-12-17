import { signTicket, type TicketPayload } from "./sign";

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

export function ticketDataUrl(token: string) {
  const content = ticketLink(token);
  // Text data URL; can be replaced with real QR PNG generation later.
  const encoded = Buffer.from(content).toString("base64");
  return `data:text/plain;base64,${encoded}`;
}
