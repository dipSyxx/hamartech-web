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

function fromBase64url(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64");
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
  const body = fromBase64url(bodyPart).toString("utf8");
  const expected = crypto.createHmac(ALGO, secret).update(body).digest();
  const received = fromBase64url(sigPart);

  if (received.length !== expected.length) {
    throw new Error("Invalid signature");
  }

  if (!crypto.timingSafeEqual(expected, received)) {
    throw new Error("Invalid signature");
  }

  const payload = JSON.parse(body) as TicketPayload;
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error("Token expired");
  }
  return payload;
}
