// app/program/page.tsx
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

import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Gamepad2,
  ScanEye,
  Code2,
  BriefcaseBusiness,
  Search,
  MapPin,
  Users,
  Clock3,
  Ticket,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import { BackgroundGlows } from "@/components/shared/background-glows";

type TrackId = "creative" | "games" | "xr" | "youth" | "business";
type DayId = "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7";

type EventItem = {
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
  venue: string;
  targetGroup: string;
  host: string;
  isFree: boolean;
  requiresRegistration: boolean;
};

export const TRACK_META: Record<
  TrackId,
  {
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    badgeClass: string;
    pillClass: string;
  }
> = {
  creative: {
    label: "HamarTech:Creative",
    shortLabel: "Creative",
    icon: Sparkles,
    badgeClass: "border-chart-1/70 bg-chart-1/10 text-chart-1",
    pillClass: "border-chart-1/70 bg-chart-1/10 text-chart-1",
  },
  games: {
    label: "HamarTech:Games",
    shortLabel: "Games",
    icon: Gamepad2,
    badgeClass: "border-chart-2/70 bg-chart-2/10 text-chart-2",
    pillClass: "border-chart-2/70 bg-chart-2/10 text-chart-2",
  },
  xr: {
    label: "HamarTech:XR",
    shortLabel: "XR",
    icon: ScanEye,
    badgeClass: "border-chart-3/70 bg-chart-3/10 text-chart-3",
    pillClass: "border-chart-3/70 bg-chart-3/10 text-chart-3",
  },
  youth: {
    label: "HamarTech:Youth",
    shortLabel: "Youth",
    icon: Code2,
    badgeClass: "border-chart-4/70 bg-chart-4/10 text-chart-4",
    pillClass: "border-chart-4/70 bg-chart-4/10 text-chart-4",
  },
  business: {
    label: "HamarTech:Business",
    shortLabel: "Business",
    icon: BriefcaseBusiness,
    badgeClass: "border-chart-5/70 bg-chart-5/10 text-chart-5",
    pillClass: "border-chart-5/70 bg-chart-5/10 text-chart-5",
  },
};

const DAY_OPTIONS: { id: DayId | "all"; label: string; shortLabel: string }[] =
  [
    { id: "all", label: "Alle dager", shortLabel: "Alle dager" },
    {
      id: "day1",
      label: "Dag 1 – Opening & Media Arts",
      shortLabel: "Dag 1",
    },
    {
      id: "day2",
      label: "Dag 2 – Games & E-sport",
      shortLabel: "Dag 2",
    },
    {
      id: "day3",
      label: "Dag 3 – XR & Immersive Learning",
      shortLabel: "Dag 3",
    },
    {
      id: "day4",
      label: "Dag 4 – Youth & Coding",
      shortLabel: "Dag 4",
    },
    {
      id: "day5",
      label: "Dag 5 – Family & City Experience",
      shortLabel: "Dag 5",
    },
    {
      id: "day6",
      label: "Dag 6 – Business & Innovation",
      shortLabel: "Dag 6",
    },
    {
      id: "day7",
      label: "Dag 7 – International & Closing Day",
      shortLabel: "Dag 7",
    },
  ];

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

export const EVENTS: EventItem[] = [
  // DAG 1 – CREATIVE / MEDIA ARTS
  {
    id: "day1-opening",
    slug: "apningskveld-media-arts",
    title: "Åpningskveld: Media Arts & performance",
    description:
      "Offisiell åpning av HamarTech med digital kunst, live performance, korte innlegg og introduksjon av ukas program.",
    dayId: "day1",
    dayLabel: "Dag 1 – Opening & Media Arts",
    weekday: "Mandag",
    date: "Uke 42",
    time: "18:00–21:00",
    trackId: "creative",
    venue: "Hamar kulturhus",
    targetGroup: "Åpent for alle",
    host: "Hamar kommune & Hamar kulturhus",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day1-lyslope",
    slug: "digital-lyslope-sentrum",
    title: "Digital lysløype i sentrum",
    description:
      "Interaktiv lys- og projeksjonsløype i Hamar sentrum der byrommet blir lerret for media arts.",
    dayId: "day1",
    dayLabel: "Dag 1 – Opening & Media Arts",
    weekday: "Mandag",
    date: "Uke 42",
    time: "20:00–22:00",
    trackId: "creative",
    venue: "Hamar sentrum",
    targetGroup: "Familier, ungdom, voksne",
    host: "Hamar kulturhus & lokale kunstnere",
    isFree: true,
    requiresRegistration: false,
  },

  // DAG 2 – GAMES & E-SPORT
  {
    id: "day2-esport",
    slug: "spilltesting-esportkveld",
    title: "Spilltesting & e-sportkveld",
    description:
      "Prøv nye spill fra Hamar Game Collective, delta i e-sportturneringer og møt utviklere i uformelle sessions.",
    dayId: "day2",
    dayLabel: "Dag 2 – Games & E-sport",
    weekday: "Tirsdag",
    date: "Uke 42",
    time: "16:00–22:00",
    trackId: "games",
    venue: "PARK Hamar / spillsone",
    targetGroup: "Ungdom & unge voksne",
    host: "Hamar Game Collective & PARK Hamar",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day2-gamedev",
    slug: "møt-spillutviklerne-workshop",
    title: "Møt spillutviklerne – miniworkshop",
    description:
      "Kort introduksjon til spilldesign, historiefortelling og prototyping med eksempler fra lokale spillstudioer.",
    dayId: "day2",
    dayLabel: "Dag 2 – Games & E-sport",
    weekday: "Tirsdag",
    date: "Uke 42",
    time: "17:30–19:00",
    trackId: "games",
    venue: "PARK Hamar / verkstedrom",
    targetGroup: "Studenter, unge skapere",
    host: "Spillskolen & Hamar Game Collective",
    isFree: false,
    requiresRegistration: true,
  },

  // DAG 3 – XR & IMMERSIVE
  {
    id: "day3-xr-lab",
    slug: "xr-lab-vrinn",
    title: "XR-lab med VRINN",
    description:
      "Hands-on demoer av VR/AR, workshops om bruk av immersive teknologi i utdanning, helse og kultur.",
    dayId: "day3",
    dayLabel: "Dag 3 – XR & Immersive Learning",
    weekday: "Onsdag",
    date: "Uke 42",
    time: "12:00–17:00",
    trackId: "xr",
    venue: "VRINN / Høgskolen i Innlandet",
    targetGroup: "Studenter, lærere, fagmiljø",
    host: "VRINN & Høgskolen i Innlandet",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day3-xr-skole",
    slug: "xr-for-skole-og-læring",
    title: "XR for skole og læring",
    description:
      "Faglig seminar om hvordan VR/AR kan brukes i undervisning, med eksempler fra lokale prosjekter.",
    dayId: "day3",
    dayLabel: "Dag 3 – XR & Immersive Learning",
    weekday: "Onsdag",
    date: "Uke 42",
    time: "14:00–16:00",
    trackId: "xr",
    venue: "Høgskolen i Innlandet",
    targetGroup: "Lærere, skoleledere, utdanningsfolk",
    host: "Høgskolen i Innlandet",
    isFree: false,
    requiresRegistration: true,
  },

  // DAG 4 – YOUTH & CODING
  {
    id: "day4-kodeklubb",
    slug: "kodeklubb-maker-kveld",
    title: "Kodeklubb & maker-kveld",
    description:
      "Lavterskel kodeverksted, kreativ bruk av teknologi og små game jam-aktiviteter for barn og unge.",
    dayId: "day4",
    dayLabel: "Dag 4 – Youth & Coding",
    weekday: "Torsdag",
    date: "Uke 42",
    time: "17:00–20:00",
    trackId: "youth",
    venue: "Katta teknologiske treningssenter (KTT)",
    targetGroup: "Barn & ungdom",
    host: "Kodeklubben & Hamar katedralskole",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day4-gamejam",
    slug: "mini-game-jam-ungdom",
    title: "Mini game jam for ungdom",
    description:
      "Lag en enkel prototype på én kveld – med veiledning fra studenter og spillutviklere.",
    dayId: "day4",
    dayLabel: "Dag 4 – Youth & Coding",
    weekday: "Torsdag",
    date: "Uke 42",
    time: "17:30–21:00",
    trackId: "youth",
    venue: "KTT / makerspace",
    targetGroup: "Ungdom 13–20 år",
    host: "Hamar katedralskole & Høgskolen i Innlandet",
    isFree: true,
    requiresRegistration: true,
  },

  // DAG 5 – FAMILY & CITY EXPERIENCE
  {
    id: "day5-family",
    slug: "familiedag-i-sentrum",
    title: "Familiedag i sentrum: teknologi & byopplevelser",
    description:
      "Interaktive poster, AR-løyper og kreative stasjoner for familier i Hamar sentrum.",
    dayId: "day5",
    dayLabel: "Dag 5 – Family & City Experience",
    weekday: "Fredag",
    date: "Uke 42",
    time: "12:00–17:00",
    trackId: "creative",
    venue: "Hamar sentrum / Hamar kulturhus",
    targetGroup: "Familier med barn",
    host: "Anno museum, Hamar naturskole, Hamar kulturhus",
    isFree: true,
    requiresRegistration: false,
  },
  {
    id: "day5-ar-løype",
    slug: "ar-loype-anno",
    title: "AR-løype med Anno museum",
    description:
      "Utforsk byens historie gjennom mobilbasert AR-løype med digitale lag over kjente steder.",
    dayId: "day5",
    dayLabel: "Dag 5 – Family & City Experience",
    weekday: "Fredag",
    date: "Uke 42",
    time: "13:00–16:00",
    trackId: "xr",
    venue: "Hamar sentrum",
    targetGroup: "Familier, skoleklasser",
    host: "Anno museum",
    isFree: true,
    requiresRegistration: true,
  },

  // DAG 6 – BUSINESS & INNOVATION
  {
    id: "day6-business-seminar",
    slug: "creative-tech-business-seminar",
    title: "Creative Tech – næringslivsseminar",
    description:
      "Fagseminar om kreative næringer, teknologi, bærekraft og nye forretningsmodeller i Hamar-regionen.",
    dayId: "day6",
    dayLabel: "Dag 6 – Business & Innovation",
    weekday: "Lørdag",
    date: "Uke 42",
    time: "09:00–12:00",
    trackId: "business",
    venue: "Hamar kulturhus / konferansesal",
    targetGroup: "Næringsliv, gründere, beslutningstakere",
    host: "Hamar næringsforum & Hamar kommune",
    isFree: false,
    requiresRegistration: true,
  },
  {
    id: "day6-pitch",
    slug: "pitchkveld-startups-studios",
    title: "Pitchkveld: startups & studios",
    description:
      "Kortpitches fra spillstudioer, XR-aktører og kreative startups, med panel og mingling.",
    dayId: "day6",
    dayLabel: "Dag 6 – Business & Innovation",
    weekday: "Lørdag",
    date: "Uke 42",
    time: "18:00–21:00",
    trackId: "business",
    venue: "Hamar kulturhus / scene",
    targetGroup: "Investorer, næringsliv, studenter",
    host: "Hamar Game Collective, VRINN, Hamar næringsforum",
    isFree: false,
    requiresRegistration: true,
  },

  // DAG 7 – INTERNATIONAL & CLOSING
  {
    id: "day7-media-arts-talks",
    slug: "media-arts-city-talks",
    title: "Media Arts City Talks",
    description:
      "Samtaler med representanter fra andre UNESCO Media Arts-byer om samarbeid, prosjekter og muligheter.",
    dayId: "day7",
    dayLabel: "Dag 7 – International & Closing Day",
    weekday: "Søndag",
    date: "Uke 42",
    time: "12:00–15:00",
    trackId: "creative",
    venue: "Hamar kulturhus",
    targetGroup: "Kulturfelt, fagmiljø, interesserte innbyggere",
    host: "Hamar kommune & internasjonale partnere",
    isFree: true,
    requiresRegistration: true,
  },
  {
    id: "day7-closing",
    slug: "avslutningskveld",
    title: "Avslutningskveld: HamarTech – veien videre",
    description:
      "Oppsummering av uka, korte presentasjoner, kunstinnslag og blikk mot neste års satsinger.",
    dayId: "day7",
    dayLabel: "Dag 7 – International & Closing Day",
    weekday: "Søndag",
    date: "Uke 42",
    time: "18:00–20:00",
    trackId: "business",
    venue: "Hamar kulturhus",
    targetGroup: "Åpent for alle",
    host: "Hamar kommune & samarbeidspartnere",
    isFree: true,
    requiresRegistration: true,
  },
];

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

  const normalizedSearch = normalizeText(search);
  const searchTerms = React.useMemo(
    () =>
      normalizedSearch ? normalizedSearch.split(/\s+/).filter(Boolean) : [],
    [normalizedSearch]
  );

  const filteredEvents = React.useMemo(() => {
    const terms = searchTerms;

    const filtered = EVENTS.filter((event) => {
      if (activeTrack !== "all" && event.trackId !== activeTrack) return false;
      if (activeDay !== "all" && event.dayId !== activeDay) return false;

      if (terms.length === 0) return true;

      const track = TRACK_META[event.trackId];

      const searchable = normalizeText(
        [
          event.title,
          event.description,
          event.venue,
          event.targetGroup,
          event.host,
          event.weekday,
          event.date,
          event.time,
          event.dayLabel,
          track.label,
          track.shortLabel,
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
  }, [activeTrack, activeDay, searchTerms]);

  const eventsByDay = React.useMemo(() => {
    const grouped: Record<DayId, EventItem[]> = {
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

  const totalEvents = EVENTS.length;
  const totalTracks = Object.keys(TRACK_META).length;
  const totalDays = 7;

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

function EventCard({ event }: { event: EventItem }) {
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

        <Button asChild size="sm" className="text-xs">
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
