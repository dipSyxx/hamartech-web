import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { VENUES } from "../lib/data/venues";
import { EVENTS } from "../lib/data/events";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function seedVenues() {
  const venueIdMap = new Map<string, string>();

  for (const [dataId, venue] of Object.entries(VENUES)) {
    // Keep ids auto-generated while avoiding duplicate venue rows on repeat runs
    const existing = await prisma.venue.findFirst({
      where: { name: venue.name, city: venue.city },
    });

    const record =
      existing ??
      (await prisma.venue.create({
        data: {
          name: venue.name,
          label: venue.label,
          address: venue.address,
          city: venue.city,
          mapQuery: venue.mapQuery,
          googleMapsUrl: venue.googleMapsUrl,
          openStreetMapUrl: venue.openStreetMapUrl,
        },
      }));

    venueIdMap.set(dataId, record.id);
  }

  return venueIdMap;
}

async function seedEvents(venueIdMap: Map<string, string>) {
  for (const event of EVENTS) {
    const venueId = venueIdMap.get(event.venueId);

    if (!venueId) {
      throw new Error(
        `Missing venue mapping for ${event.venueId} (required for event ${event.slug})`
      );
    }

    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
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
        venueId,
        venueLabel: event.venue,
      },
      create: {
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
        venueId,
        venueLabel: event.venue,
      },
    });
  }
}

async function main() {
  const venueIdMap = await seedVenues();
  await seedEvents(venueIdMap);
}

main()
  .then(() => {
    console.log("Database seed complete.");
  })
  .catch(async (error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
