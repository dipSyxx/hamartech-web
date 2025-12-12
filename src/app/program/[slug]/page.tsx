// app/program/[slug]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/lib/animations/presets";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { BackgroundGlows } from "@/components/shared/background-glows";
import { cn } from "@/lib/utils";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Ticket,
  ChevronLeft,
} from "lucide-react";
import { useParams } from "next/navigation";

import { EVENTS, TRACK_META } from "../page";

export default function ProgramEventPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const slug = React.useMemo(() => {
    const value = params?.slug;
    return Array.isArray(value) ? value[0] : value ?? "";
  }, [params]);

  const event = React.useMemo(
    () => EVENTS.find((item) => item.slug === slug),
    [slug]
  );

  if (!event) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <section className="border-b border-border bg-background">
          <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-6 px-4 py-16 md:px-8">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Fant ikke arrangementet
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Denne siden finnes ikke
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Arrangementet du prøver å åpne er ikke tilgjengelig. Det kan ha
                blitt fjernet eller fått en ny adresse.
              </p>
            </div>

            <Button asChild variant="outline" size="sm">
              <Link href="/program">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Tilbake til programmet
              </Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const track = TRACK_META[event.trackId as keyof typeof TRACK_META];
  const TrackIcon = track.icon;

  const sameDayEvents = EVENTS.filter(
    (item) => item.dayId === event.dayId && item.id !== event.id
  );
  const sameTrackEvents = EVENTS.filter(
    (item) =>
      item.trackId === event.trackId &&
      item.id !== event.id &&
      item.dayId !== event.dayId
  ).slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <BackgroundGlows />

      <motion.section
        aria-labelledby="event-heading"
        className="border-b border-border bg-background"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-14 md:px-8">
          {/* Top bar: back + track badge */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-3"
            variants={fadeIn(0)}
          >
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-border/70"
            >
              <Link href="/program">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Tilbake til programmet
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border text-[11px] md:text-xs",
                  track.badgeClass
                )}
              >
                <TrackIcon className="mr-1 h-3.5 w-3.5" />
                {track.label}
              </Badge>
              <Badge
                variant="secondary"
                className="border-border/60 bg-secondary/60 text-[11px] md:text-xs"
              >
                <Users className="mr-1 h-3.5 w-3.5" />
                {event.targetGroup}
              </Badge>
            </div>
          </motion.div>

          {/* HERO */}
          <motion.header className="mt-6 space-y-4" variants={fadeInUp(0.05)}>
            <p className="inline-flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{event.dayLabel}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
              <span>
                {event.weekday} – {event.date}
              </span>
            </p>

            <h1
              id="event-heading"
              className="text-3xl font-semibold leading-tight md:text-4xl"
            >
              {event.title}
            </h1>

            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              {event.description}
            </p>
          </motion.header>

          {/* MAIN CONTENT */}
          <motion.div
            className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] md:items-start"
            variants={fadeInUp(0.08)}
          >
            {/* Left: main details */}
            <motion.div variants={scaleIn(0.05)}>
              <Card className="border-border/80 bg-background/75 shadow-[0_16px_45px_rgba(0,0,0,0.65)]">
                <CardHeader className="border-b border-border/60 pb-4">
                  <CardTitle className="text-base font-semibold md:text-lg">
                    Om arrangementet
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground md:text-[15px]">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-muted-foreground md:text-[15px]">
                    <DetailRow icon={Clock3} label="Tid" value={event.time} />
                    <DetailRow icon={MapPin} label="Sted" value={event.venue} />
                    <DetailRow
                      icon={Users}
                      label="Målgruppe"
                      value={event.targetGroup}
                    />
                    <DetailRow
                      icon={Ticket}
                      label="Billetter"
                      value={
                        event.isFree
                          ? "Gratis – enkelte arrangementer krever plassreservasjon"
                          : "Betalt arrangement med billetter"
                      }
                    />
                    <DetailRow
                      icon={CalendarDays}
                      label="Dag"
                      value={`${event.weekday} – ${event.date}`}
                    />
                    <DetailRow
                      icon={TrackIcon}
                      label="Spor"
                      value={track.label}
                    />
                    <DetailRow
                      icon={Users}
                      label="Arrangør"
                      value={event.host}
                    />

                    {event.requiresRegistration && (
                      <p className="mt-3 rounded-lg border border-border/70 bg-secondary/20 px-3 py-2 text-xs text-muted-foreground md:text-sm">
                        Påmelding er nødvendig for dette arrangementet. I en
                        senere versjon av løsningen kan du reservere plass og få
                        digital billett via HamarTech-profilen din.
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
                    <Badge
                      variant={event.isFree ? "secondary" : "outline"}
                      className={cn(
                        "border-border/60 bg-secondary/50",
                        !event.isFree && "bg-transparent"
                      )}
                    >
                      {event.isFree ? "Gratis" : "Billetter"}
                    </Badge>
                    {event.requiresRegistration && (
                      <Badge
                        variant="outline"
                        className="border-border/70 text-[11px]"
                      >
                        Påmelding nødvendig
                      </Badge>
                    )}
                  </div>

                  <Button asChild size="sm" className="text-xs">
                    <Link href="/program">
                      Se hele programmet
                      <CalendarDays className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Right: compact practical info */}
            <motion.aside variants={scaleIn(0.1)}>
              <Card className="border-border/80 bg-background/80 shadow-[0_16px_45px_rgba(0,0,0,0.7)]">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold md:text-base">
                    Praktisk info
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground md:text-sm">
                    Kort oppsummering av når og hvor arrangementet skjer.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs text-muted-foreground md:text-sm">
                  <DetailRow
                    compact
                    icon={Clock3}
                    label="Tid"
                    value={event.time}
                  />
                  <DetailRow
                    compact
                    icon={MapPin}
                    label="Sted"
                    value={event.venue}
                  />
                  <DetailRow
                    compact
                    icon={Users}
                    label="For hvem"
                    value={event.targetGroup}
                  />
                  <DetailRow
                    compact
                    icon={Ticket}
                    label="Pris"
                    value={event.isFree ? "Gratis" : "Billetter"}
                  />
                </CardContent>
              </Card>
            </motion.aside>
          </motion.div>

          {/* Related events */}
          {(sameDayEvents.length > 0 || sameTrackEvents.length > 0) && (
            <motion.div className="mt-10 space-y-8" variants={fadeInUp(0.12)}>
              {sameDayEvents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold md:text-base">
                    Flere arrangementer samme dag
                  </h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Utforsk hva mer som skjer på{" "}
                    <span className="text-foreground">{event.dayLabel}</span>.
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {sameDayEvents.map((item) => (
                      <RelatedEventCard key={item.id} event={item} />
                    ))}
                  </div>
                </div>
              )}

              {sameTrackEvents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold md:text-base">
                    Flere {track.shortLabel}-arrangementer
                  </h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Andre tider i løpet av uka hvor samme spor er i fokus.
                  </p>

                  <div className="grid gap-3 md:grid-cols-2">
                    {sameTrackEvents.map((item) => (
                      <RelatedEventCard key={item.id} event={item} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

/* Shared UI bits */

type DetailRowProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  compact?: boolean;
};

function DetailRow({ icon: Icon, label, value, compact }: DetailRowProps) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/30">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "text-xs text-foreground md:text-sm",
            compact && "text-xs md:text-[13px]"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

type RelatedEventCardProps = {
  // тип виводиться з EVENTS, щоб не дублювати EventItem
  event: (typeof EVENTS)[number];
};

function RelatedEventCard({ event }: RelatedEventCardProps) {
  const track = TRACK_META[event.trackId as keyof typeof TRACK_META];
  const TrackIcon = track.icon;

  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-[border-color,background-color,box-shadow] duration-150 hover:border-primary/70 hover:bg-background/90 hover:shadow-[0_16px_45px_rgba(0,0,0,0.7)]">
      <CardContent className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {event.time} • {event.venue}
            </p>
            <h3 className="mt-1 text-sm font-semibold text-foreground">
              {event.title}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={cn("border text-[10px]", track.badgeClass)}
          >
            <TrackIcon className="mr-1 h-3 w-3" />
            {track.shortLabel}
          </Badge>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span>{event.targetGroup}</span>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[11px]"
          >
            <Link href={`/program/${event.slug}`}>Se mer</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
