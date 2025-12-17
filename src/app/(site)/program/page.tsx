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
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

import { cn } from "@/lib/utils";
import {
  TRACK_META,
  DAY_OPTIONS,
  type TrackId,
  type DayId,
} from "@/lib/data/program-meta";
import {
  Search,
  MapPin,
  Users,
  Clock3,
  Ticket,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import { BackgroundGlows } from "@/components/shared/background-glows";

type ApiVenue = {
  id: string;
  label: string;
  name: string;
  address: string | null;
  city: string | null;
  mapQuery: string | null;
  googleMapsUrl: string | null;
  openStreetMapUrl: string | null;
};

type ProgramEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  dayId: DayId;
  dayLabel: string;
  weekday: string;
  date: string;
  time: string;
  trackId: TrackId;
  venueId: string;
  venue: string;
  venueInfo: ApiVenue | null;
  targetGroup: string;
  host: string;
  isFree: boolean;
  requiresRegistration: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

function mapApiEvent(event: any): ProgramEvent {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    dayId: event.dayId as DayId,
    dayLabel: event.dayLabel,
    weekday: event.weekday,
    date: event.dateLabel ?? event.date ?? "",
    time: event.timeLabel ?? event.time ?? "",
    trackId: event.trackId as TrackId,
    venueId: event.venueId,
    venue: event.venueLabel ?? event.venue?.label ?? "",
    venueInfo: event.venue ?? null,
    targetGroup: event.targetGroup,
    host: event.host,
    isFree: Boolean(event.isFree),
    requiresRegistration: Boolean(event.requiresRegistration),
    startsAt: event.startsAt ?? null,
    endsAt: event.endsAt ?? null,
  };
}

const DAY_ORDER = DAY_OPTIONS.reduce((acc, option, index) => {
  if (option.id !== "all") {
    acc[option.id as DayId] = index;
  }
  return acc;
}, {} as Record<DayId, number>);

const DAY_META = DAY_OPTIONS.reduce((acc, option) => {
  if (option.id !== "all") {
    acc[option.id as DayId] = option as {
      id: DayId;
      label: string;
      shortLabel: string;
    };
  }
  return acc;
}, {} as Record<DayId, { id: DayId; label: string; shortLabel: string }>);

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getStartMinutes = (timeRange: string) => {
  const match = timeRange.match(/(\d{1,2}):(\d{2})/);
  if (!match) return Number.POSITIVE_INFINITY;

  const [, hours, minutes] = match;
  return Number(hours) * 60 + Number(minutes);
};

export default function Program() {
  const [activeTrack, setActiveTrack] = React.useState<TrackId | "all">("all");
  const [activeDay, setActiveDay] = React.useState<DayId | "all">("all");
  const [search, setSearch] = React.useState("");
  const [events, setEvents] = React.useState<ProgramEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Kunne ikke hente arrangementer.");
      }
      const mapped: ProgramEvent[] =
        data?.events?.map((event: any) => mapApiEvent(event)) ?? [];
      setEvents(mapped);
    } catch (err: any) {
      setError(err?.message ?? "Kunne ikke hente arrangementer.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const normalizedSearch = normalizeText(search);
  const searchTerms = React.useMemo(
    () =>
      normalizedSearch ? normalizedSearch.split(/\s+/).filter(Boolean) : [],
    [normalizedSearch]
  );

  const filteredEvents = React.useMemo(() => {
    const terms = searchTerms;

    const filtered = events.filter((event) => {
      if (activeTrack !== "all" && event.trackId !== activeTrack) return false;
      if (activeDay !== "all" && event.dayId !== activeDay) return false;

      if (terms.length === 0) return true;

      const track = TRACK_META[event.trackId];
      const venue = event.venueInfo;

      const searchable = normalizeText(
        [
          event.title,
          event.description,
          event.venue,
          venue?.label ?? "",
          venue?.name ?? "",
          venue?.address ?? "",
          venue?.city ?? "",
          venue?.mapQuery ?? "",
          event.venueId,
          event.targetGroup,
          event.host,
          event.weekday,
          event.date,
          event.time,
          event.dayLabel,
          track?.label ?? "",
          track?.shortLabel ?? "",
          event.slug,
          event.isFree ? "gratis free billettfri" : "billetter ticket betalt",
          event.requiresRegistration
            ? "påmelding registrering registration signup"
            : "drop-in uten påmelding",
        ].join(" ")
      );

      return terms.every((term) => searchable.includes(term));
    });

    return filtered.sort((a, b) => {
      const dayDiff = DAY_ORDER[a.dayId] - DAY_ORDER[b.dayId];
      if (dayDiff !== 0) return dayDiff;

      const timeDiff = getStartMinutes(a.time) - getStartMinutes(b.time);
      if (timeDiff !== 0) return timeDiff;

      return a.title.localeCompare(b.title);
    });
  }, [activeTrack, activeDay, searchTerms, events]);

  const eventsByDay = React.useMemo(() => {
    const grouped: Record<DayId, ProgramEvent[]> = {
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: [],
      day7: [],
    };

    filteredEvents.forEach((event) => {
      grouped[event.dayId].push(event);
    });

    return grouped;
  }, [filteredEvents]);

  const visibleDays = React.useMemo(
    () =>
      (Object.keys(eventsByDay) as DayId[])
        .filter((dayId) => eventsByDay[dayId].length > 0)
        .sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]),
    [eventsByDay]
  );

  const resultListKey = `${activeTrack}-${activeDay}-${ 
    searchTerms.length ? searchTerms.join("-") : "all"
  }`;

  const totalEvents = events.length;
  const totalTracks = Object.keys(TRACK_META).length;
  const totalDays = 7;

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={fetchEvents} variant="outline" size="sm">
            Prøv igjen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <BackgroundGlows />

      <motion.section
        id="program"
        aria-labelledby="program-page-heading"
        className="border-b border-border bg-background"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-8">
          {/* HEADER */}
          <motion.div
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            variants={fadeIn(0)}
          >
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Program for HamarTech
              </p>
              <h1
                id="program-page-heading"
                className="text-3xl font-semibold md:text-4xl"
              >
                Program – hele uka
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Her finner du hele programmet for HamarTech-uka. Filtrer på spor
                og dag, søk etter temaer – og finn arrangementer som passer for
                deg.
              </p>
            </div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-4 text-xs text-muted-foreground md:text-sm"
              variants={fadeInUp(0.05)}
            >
              <Stat label="Arrangementer" value={`${totalEvents}`} />
              <Stat label="Spor" value={`${totalTracks}`} />
              <Stat label="Dager" value={`${totalDays}`} />
            </motion.div>
          </motion.div>

          {/* FILTERBAR */}
          <motion.div className="relative mt-8" variants={fadeInUp(0.08)}>
            <div className="relative overflow-hidden rounded-3xl p-[2px]">
              {/* Анімований градієнтний бордер (лише фон) */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-[conic-gradient(from_0deg,#22E4FF,#5B5BFF,#F044FF,#22E4FF)] opacity-85 blur-[6px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
              />

              {/* Внутрішня панель фільтрів */}
              <div className="relative flex flex-col gap-4 rounded-[1.45rem] border border-border/60 bg-background p-4 shadow-[0_18px_45px_rgba(0,0,0,0.65)] md:p-5">
                {/* Верхній ряд: заголовок + пошук */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span>Filtrer programmet</span>
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-72">
                    <Search className="pointer-events-none absolute z-1 left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Søk i arrangementer..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Нижній ряд: Tabs по треках + day pills */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {/* Track Tabs */}
                  <div className="w-full md:w-auto">
                    <Tabs
                      value={activeTrack}
                      onValueChange={(value) =>
                        setActiveTrack(value as TrackId | "all")
                      }
                      className="w-full"
                    >
                      <div className="w-full overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] md:w-auto">
                        <TabsList
                          className="
                  flex w-max items-center gap-1
                  rounded-full bg-secondary/40 px-1 py-1
                  shadow-[0_10px_30px_rgba(0,0,0,0.45)]
                "
                        >
                          <TabsTrigger value="all" className="min-w-max">
                            Alle spor
                          </TabsTrigger>

                          {Object.entries(TRACK_META).map(([id, track]) => (
                            <TabsTrigger
                              key={id}
                              value={id}
                              className="min-w-max"
                            >
                              <track.icon className="h-3 w-3" />
                              <span>{track.shortLabel}</span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                    </Tabs>
                  </div>

                  {/* Day pills */}
                  <div className="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
                    {DAY_OPTIONS.map((day) => (
                      <Button
                        key={day.id}
                        type="button"
                        size="sm"
                        variant={activeDay === day.id ? "default" : "outline"}
                        className={cn(
                          "px-2 text-xs md:px-3",
                          activeDay === day.id &&
                            "shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                        )}
                        onClick={() => setActiveDay(day.id as DayId | "all")}
                      >
                        {day.shortLabel}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RESULT COUNT */}
          <motion.p
            className="mt-4 text-xs text-muted-foreground md:text-sm"
            variants={fadeInUp(0.1)}
          >
            Viser{" "}
            <span className="font-semibold text-foreground">
              {filteredEvents.length}
            </span>{" "}
            arrangement(er) basert på valgte filtre.
          </motion.p>

          {/* DAYS + EVENTS */}
          <div key={resultListKey} className="mt-8 space-y-10">
            {filteredEvents.length === 0 ? (
              <motion.div
                className="rounded-2xl border border-border/60 bg-background/70 p-6 text-sm text-muted-foreground shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
                variants={fadeInUp(0.12)}
              >
                Ingen arrangementer matcher filtrene akkurat nå. Prøv å velge
                flere spor, en annen dag eller rydde søket.
              </motion.div>
            ) : (
              visibleDays.map((dayId, dayIndex) => {
                const eventsForDay = eventsByDay[dayId];
                const exampleEvent = eventsForDay[0];
                const dayMeta = DAY_META[dayId];

                return (
                  <motion.section
                    key={dayId}
                    aria-labelledby={`day-${dayId}-heading`}
                    className="space-y-4"
                    variants={fadeInUp(0.04 * dayIndex)}
                    initial="hidden"
                    animate="visible"
                  >
                    <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {exampleEvent.weekday} – {exampleEvent.date}
                        </p>
                        <h2
                          id={`day-${dayId}-heading`}
                          className="text-lg font-semibold md:text-xl"
                        >
                          {dayMeta.label}
                        </h2>
                      </div>
                    </header>

                    <div className="grid gap-4 md:grid-cols-2">
                      {eventsForDay.map((event, index) => (
                        <motion.div
                          key={event.id}
                          variants={scaleIn(0.05 * index)}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ y: -6, scale: 1.01 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                        >
                          <EventCard event={event} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                );
              })
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function EventCard({ event }: { event: ProgramEvent }) {
  const track = TRACK_META[event.trackId];
  const TrackIcon = track.icon;

  return (
    <Card
      className={cn(
        "border-border/80 bg-background/75 shadow-[0_12px_35px_rgba(0,0,0,0.6)]",
        "transition-[border-color,background-color,box-shadow] duration-200 ease-out",
        "hover:border-primary/70 hover:bg-background/90 hover:shadow-[0_18px_55px_rgba(0,0,0,0.75)]"
      )}
    >
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold md:text-lg">
              {event.title}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                {event.time}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {event.venue}
              </span>
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="outline"
              className={cn("border text-[10px]", track.badgeClass)}
            >
              <TrackIcon className="mr-1 h-3 w-3" />
              {track.shortLabel}
            </Badge>

            <Badge
              variant="secondary"
              className="border-border/60 bg-secondary/60 text-[10px]"
            >
              <Users className="mr-1 h-3 w-3" />
              {event.targetGroup}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground md:text-[15px]">
          {event.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground md:text-xs">
          <span>
            Arrangør: <span className="text-foreground">{event.host}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
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
            <Badge variant="outline" className="border-border/70 text-[11px]">
              Påmelding nødvendig
            </Badge>
          )}
        </div>

        <Button asChild size="sm" className="text-xs border-0">
          <Link href={`/program/${event.slug}`}>
            Se detaljer
            <Ticket className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-foreground md:text-xl">
        {value}
      </span>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
