import { EVENTS } from "@/lib/data/events";

export type EventId = (typeof EVENTS)[number]["id"];

export type ReservationStatus = "confirmed" | "waitlist" | "cancelled";
export type ReservationKind = "upcoming" | "past";

export type Reservation = {
  id: string;
  eventId: EventId;
  status: ReservationStatus;
  kind: ReservationKind;
  createdAt: string;
};

export const RESERVATIONS: Reservation[] = [
  {
    id: "r-1",
    eventId: "day1-opening",
    status: "confirmed",
    kind: "past",
    createdAt: "2025-08-01T10:15:00Z",
  },
  {
    id: "r-2",
    eventId: "day2-esport",
    status: "confirmed",
    kind: "past",
    createdAt: "2025-08-02T14:32:00Z",
  },
  {
    id: "r-3",
    eventId: "day3-xr-skole",
    status: "waitlist",
    kind: "upcoming",
    createdAt: "2025-08-05T09:05:00Z",
  },
  {
    id: "r-4",
    eventId: "day5-family",
    status: "confirmed",
    kind: "upcoming",
    createdAt: "2025-08-10T11:45:00Z",
  },
  {
    id: "r-5",
    eventId: "day6-pitch",
    status: "confirmed",
    kind: "upcoming",
    createdAt: "2025-08-11T18:20:00Z",
  },
  {
    id: "r-6",
    eventId: "day7-closing",
    status: "cancelled",
    kind: "upcoming",
    createdAt: "2025-08-12T08:50:00Z",
  },
];
