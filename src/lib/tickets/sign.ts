import crypto from "crypto";

const ALGO = "sha256";

export type TicketPayload = {
  reservationId: string;
  ticketCode: string;
  exp: number; // unix seconds
};

function getSecret() {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) {
    throw new Error("TICKET_SIGNING_SECRET is not configured");
  }
  return secret;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signTicket(payload: TicketPayload) {
  const secret = getSecret();
  const body = JSON.stringify(payload);
  const hmac = crypto.createHmac(ALGO, secret);
  hmac.update(body);
  const signature = hmac.digest();
  return `${base64url(body)}.${base64url(signature)}`;
}

export function verifyTicket(token: string): TicketPayload {
  const secret = getSecret();
  const [bodyPart, sigPart] = token.split(".");
  if (!bodyPart || !sigPart) {
    throw new Error("Invalid token");
  }
  const body = Buffer.from(bodyPart, "base64").toString("utf8");
  const expected = crypto.createHmac(ALGO, secret).update(body).digest();
  const received = Buffer.from(sigPart.replace(/-/g, "+").replace(/_/g, "/"), "base64");

  if (!crypto.timingSafeEqual(expected, received)) {
    throw new Error("Invalid signature");
  }

  const payload = JSON.parse(body) as TicketPayload;
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("Token expired");
  }
  return payload;
}
