import { prisma as prismaRaw } from "./prisma";

import { VENUES } from "../lib/data/venues";
import { EVENTS } from "../lib/data/events";

// Prisma client (adapter-configured) – cast to any to avoid stale generated typings
const prisma = prismaRaw as any;

async function main() {
  console.log("Upserting venues...");
  await Promise.all(
    Object.values(VENUES).map((venue) =>
      prisma.venue.upsert({
        where: { id: venue.id },
        update: {
          name: venue.name,
          label: venue.label,
          address: venue.address ?? null,
          city: venue.city,
          country: venue.city ? "Norway" : "Norway",
          mapQuery: venue.mapQuery,
          googleMapsUrl: venue.googleMapsUrl,
          openStreetMapUrl: venue.openStreetMapUrl,
        },
        create: {
          id: venue.id,
          name: venue.name,
          label: venue.label,
          address: venue.address ?? null,
          city: venue.city,
          country: venue.city ? "Norway" : "Norway",
          mapQuery: venue.mapQuery,
          googleMapsUrl: venue.googleMapsUrl,
          openStreetMapUrl: venue.openStreetMapUrl,
        },
      })
    )
  );

  console.log("Upserting events...");
  await Promise.all(
    EVENTS.map((event) =>
      prisma.event.upsert({
        where: { id: event.id },
        update: {
          slug: event.slug,
          title: event.title,
          description: event.description,
          trackId: event.trackId,
          dayId: event.dayId,
          dayLabel: event.dayLabel,
          weekday: event.weekday,
          dateLabel: event.date,
          timeLabel: event.time,
          targetGroup: event.targetGroup,
          host: event.host,
          isFree: event.isFree,
          requiresRegistration: event.requiresRegistration,
          venueId: event.venueId,
          venueLabel: event.venue,
        },
        create: {
          id: event.id,
          slug: event.slug,
          title: event.title,
          description: event.description,
          trackId: event.trackId,
          dayId: event.dayId,
          dayLabel: event.dayLabel,
          weekday: event.weekday,
          dateLabel: event.date,
          timeLabel: event.time,
          targetGroup: event.targetGroup,
          host: event.host,
          isFree: event.isFree,
          requiresRegistration: event.requiresRegistration,
          venueId: event.venueId,
          venueLabel: event.venue,
        },
      })
    )
  );

  console.log("Seed completed (venues + events). Users and reservations were left untouched by request.");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
