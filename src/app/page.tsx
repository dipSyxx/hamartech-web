"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, CalendarRange, Layers3, Handshake } from "lucide-react";
import {
  fadeInUp,
  fadeIn,
  scaleIn,
  staggerContainer,
} from "@/lib/animations/presets";
import type { LucideIcon } from "lucide-react";

const TRACKS = [
  {
    id: "creative",
    label: "HamarTech:Creative",
    description:
      "Digital kunst, media arts, installasjoner og visuelle opplevelser.",
    colorClass: "border-chart-1/70 bg-chart-1/5",
  },
  {
    id: "games",
    label: "HamarTech:Games",
    description: "Spilltesting, e-sport, møte spillutviklere og LAN-stemning.",
    colorClass: "border-chart-2/70 bg-chart-2/5",
  },
  {
    id: "xr",
    label: "HamarTech:XR",
    description:
      "VR/AR-demoer, immersive læringsopplevelser og VRINN-samarbeid.",
    colorClass: "border-chart-3/70 bg-chart-3/5",
  },
  {
    id: "youth",
    label: "HamarTech:Youth",
    description: "Kodeklubb, maker space, game jam og kreative ungdomslab’er.",
    colorClass: "border-chart-4/70 bg-chart-4/5",
  },
  {
    id: "business",
    label: "HamarTech:Business",
    description:
      "Samarbeid, innovasjon, næringslivsseminarer og pitch-sesjoner.",
    colorClass: "border-chart-5/70 bg-chart-5/5",
  },
];

const EVENT_PREVIEW = [
  {
    id: "day1-opening",
    dateLabel: "Dag 1 – Opening & Media Arts",
    time: "18:00–21:00",
    title: "Åpningskveld: Media Arts & performance",
    trackLabel: "Creative",
    trackColorClass: "border-chart-1/70 text-chart-1 bg-chart-1/10",
    targetGroup: "Åpent for alle",
    venue: "Hamar kulturhus",
    description:
      "Offisiell åpning av HamarTech med digital kunst, live performance, korte innlegg og introduksjon av ukas program.",
  },
  {
    id: "day2-games",
    dateLabel: "Dag 2 – Games & E-sport",
    time: "16:00–22:00",
    title: "Spilltesting & e-sportkveld",
    trackLabel: "Games",
    trackColorClass: "border-chart-2/70 text-chart-2 bg-chart-2/10",
    targetGroup: "Ungdom & unge voksne",
    venue: "PARK Hamar / spillsone",
    description:
      "Prøv nye spill fra Hamar Game Collective, delta i e-sportturneringer og møt spillutviklere i uformelle sessions.",
  },
  {
    id: "day3-xr",
    dateLabel: "Dag 3 – XR & Immersive Learning",
    time: "12:00–17:00",
    title: "XR-lab med VRINN",
    trackLabel: "XR",
    trackColorClass: "border-chart-3/70 text-chart-3 bg-chart-3/10",
    targetGroup: "Studenter, lærere, fagmiljø",
    venue: "VRINN / Høgskolen i Innlandet",
    description:
      "Hands-on demoer av VR/AR, workshops om bruk av XR i læring og presentasjoner fra VRINN-partnere.",
  },
  {
    id: "day4-youth",
    dateLabel: "Dag 4 – Youth & Coding",
    time: "17:00–20:00",
    title: "Kodeklubb & maker-kveld",
    trackLabel: "Youth",
    trackColorClass: "border-chart-4/70 text-chart-4 bg-chart-4/10",
    targetGroup: "Barn & ungdom",
    venue: "Katta teknologiske treningssenter (KTT)",
    description:
      "Lavterskel kodeverksted, kreativ bruk av teknologi og små game jam-aktiviteter for barn og unge.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Глобальні градієнтні blur-кружки */}
      <BackgroundGlows />

      {/* HERO */}
      <motion.section
        aria-labelledby="hero-heading"
        className="border-b border-border bg-background"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:py-20 md:px-8">
          {/* Left column */}
          <div className="flex-1 space-y-6">
            <motion.p
              className="inline-flex rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
              variants={fadeInUp(0)}
            >
              UNESCO Creative City of Media Arts
            </motion.p>

            <motion.h1
              id="hero-heading"
              className="text-3xl font-semibold leading-tight md:text-4xl lg:text-4xl"
              variants={fadeInUp(0.05)}
            >
              HamarTech – en uke for
              <br />
              teknologi og kreativitet
            </motion.h1>

            <motion.p
              className="max-w-xl text-sm text-muted-foreground md:text-base"
              variants={fadeInUp(0.1)}
            >
              HamarTech samler spill, XR, digital kunst, koding og kreative
              prosjekter i én festivaluke. Utforsk programmet, reserver
              billetter og oppdag hvordan teknologi og kultur møtes i
              Hamar-regionen.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={fadeInUp(0.15)}
            >
              <Button asChild size="lg">
                <Link href="#program">
                  Se program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border/70"
              >
                <Link href="#about">Om HamarTech</Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-6 text-sm text-muted-foreground"
              variants={fadeInUp(0.2)}
            >
              <Stat label="arrangementer" value="30+" icon={CalendarRange} />
              <Stat label="spor" value="5" icon={Layers3} />
              <Stat label="partnere" value="20+" icon={Handshake} />
            </motion.div>
          </div>

          {/* Right column – декоративний блок */}
          <motion.div className="flex-1" variants={scaleIn(0.15)}>
            <div className="relative mx-auto max-w-xs rounded-[32px] border border-border/70 bg-gradient-to-br from-background via-background/60 to-background/20 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
              <div className="aspect-square rounded-3xl bg-[radial-gradient(circle_at_top,#22E4FF33,transparent_55%),radial-gradient(circle_at_bottom,#F044FF33,transparent_55%)]" />
              <p className="mt-4 text-xs text-muted-foreground md:text-sm">
                En digital festivalhub for Hamar – med spill, XR, media arts og
                åpne hus hos aktørene i byen.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* TRACKS */}
      <motion.section
        id="tracks"
        aria-labelledby="tracks-heading"
        className="border-b border-border bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 md:px-8">
          <motion.header className="mb-8 space-y-3" variants={fadeIn(0)}>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Spor
            </p>
            <h2
              id="tracks-heading"
              className="text-2xl font-semibold md:text-3xl"
            >
              Fem spor som dekker hele HamarTech
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Programmet er delt inn i tydelige spor, slik at publikum enkelt
              kan finne aktiviteter innen spill, XR, media arts, ungdomstilbud
              og næringsliv.
            </p>
          </motion.header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((track, index) => (
              <motion.article
                key={track.id}
                className={cn(
                  "flex h-full flex-col rounded-2xl border bg-background/40 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
                  track.colorClass
                )}
                variants={fadeInUp(0.05 * index)}
              >
                <h3 className="mb-2 text-sm font-semibold">{track.label}</h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {track.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* PROGRAM PREVIEW */}
      <motion.section
        id="program"
        aria-labelledby="program-heading"
        className="border-b border-border bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 md:px-8">
          <motion.header
            className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            variants={fadeIn(0)}
          >
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Program (utvalg)
              </p>
              <h2
                id="program-heading"
                className="text-2xl font-semibold md:text-3xl"
              >
                Høydepunkter gjennom uka
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Her er et lite utvalg av arrangementene som viser bredden i
                HamarTech – fra åpning og media arts til spill, XR og
                ungdomstilbud.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-border/70"
              >
                <Link href="/program">Se fullstendig program</Link>
              </Button>
            </div>
          </motion.header>

          <div className="grid gap-4 md:grid-cols-2">
            {EVENT_PREVIEW.map((event, index) => (
              <motion.article
                key={event.id}
                className="flex h-full flex-col rounded-2xl border border-border/70 bg-background/60 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
                variants={fadeInUp(0.05 * index)}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="uppercase tracking-[0.16em]">
                    {event.dateLabel}
                  </span>
                  <span>{event.time}</span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-foreground md:text-lg">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {event.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
                      event.trackColorClass
                    )}
                  >
                    {event.trackLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-1 text-xs font-medium text-muted-foreground">
                    {event.targetGroup}
                  </span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-[0.16em]">
                    Sted:
                  </span>{" "}
                  <span>{event.venue}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ABOUT / HAMAR & UNESCO MEDIA ARTS */}
      <motion.section
        id="about"
        aria-labelledby="about-heading"
        className="border-b border-border bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 md:px-8">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
            {/* Tekstkolonne */}
            <motion.div className="space-y-4" variants={fadeInUp(0)}>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Om HamarTech & Hamar
              </p>
              <h2
                id="about-heading"
                className="text-2xl font-semibold md:text-3xl"
              >
                Hamar – UNESCO Creative City of Media Arts
              </h2>

              <p className="text-sm text-muted-foreground md:text-base">
                HamarTech bygger på at Hamar siden 2020 har status som{" "}
                <span className="text-foreground">
                  UNESCO Creative City of Media Arts
                </span>
                . Media Arts handler om kreativ bruk av teknologi for å formidle
                kunst, kultur, historier og nye opplevelser.
              </p>

              <p className="text-sm text-muted-foreground md:text-base">
                I Hamar jobber rundt{" "}
                <span className="text-foreground">5,8 %</span> av arbeidsstyrken
                innen kreative næringer og mediekunst. Byen har Norges største
                spillutviklingsklynge, Hamar Game Collective, og VR-klyngen
                VRINN – i tillegg til sterke miljøer rundt The Gathering,
                Høgskolen i Innlandet, Hamar kulturhus og flere festivaler.
              </p>

              <p className="text-sm text-muted-foreground md:text-base">
                HamarTech samler disse aktørene i én felles uke. Målet er å vise
                fram mangfoldet, invitere innbyggere inn i miljøene, og skape
                nye møter mellom barn, unge, fagfolk, næringsliv og
                kulturaktører.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border/70"
                >
                  <Link
                    href="https://www.hamar.no/hamar-i-unesco/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Les mer om Hamar i UNESCO
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Fakta / highlight-kort */}
            <motion.div
              className="rounded-3xl border border-border/70 bg-background/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              variants={scaleIn(0.1)}
            >
              <div className="rounded-2xl bg-[radial-gradient(circle_at_top,#22E4FF22,transparent_60%),radial-gradient(circle_at_bottom,#F044FF22,transparent_60%)] p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Hvorfor HamarTech?
                </h3>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground md:text-base">
                  <p>
                    • Hamar er den første norske byen med UNESCO-status innen{" "}
                    <span className="text-foreground">Media Arts</span>.
                  </p>
                  <p>
                    • Store klynger innen{" "}
                    <span className="text-foreground">
                      spill, VR og digitalt innhold
                    </span>{" "}
                    gjør byen til et naturlig knutepunkt for teknologi og
                    kreativitet.
                  </p>
                  <p>
                    • HamarTech kobler{" "}
                    <span className="text-foreground">
                      skoler, næringsliv, kulturinstitusjoner og frivillighet
                    </span>{" "}
                    i en felles festivaluke.
                  </p>
                  <p>
                    • Målet er å gjøre teknologimiljøene{" "}
                    <span className="text-foreground">
                      tilgjengelige for alle
                    </span>{" "}
                    – fra barn og unge til profesjonelle aktører.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* PRAKTISK INFO */}
      <motion.section
        id="info"
        aria-labelledby="info-heading"
        className="border-b border-border bg-background"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 md:px-8">
          <motion.header className="mb-8 space-y-3" variants={fadeInUp(0)}>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Praktisk informasjon
            </p>
            <h2
              id="info-heading"
              className="text-2xl font-semibold md:text-3xl"
            >
              Når, hvor og hvordan deltar du?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              HamarTech er en uke med arrangementer rundt i Hamar-regionen –
              kombinert med digitale aktiviteter. Her er en kort oversikt over
              hvordan festivalen er bygget opp.
            </p>
          </motion.header>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
            {/* Venstre kolonne – når & hvor + format */}
            <motion.div
              className="space-y-6 text-sm text-muted-foreground md:text-base"
              variants={fadeInUp(0.05)}
            >
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Når
                </h3>
                <p>
                  HamarTech planlegges som en{" "}
                  <span className="text-foreground">festivaluke</span> med
                  arrangementer mandag–søndag. Hver dag har sitt hovedtema
                  (Creative, Games, XR, Youth, Business, familie & avslutning).
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Hvor
                </h3>
                <ul className="space-y-1">
                  <li>
                    • <span className="text-foreground">Hamar kulturhus</span> –
                    åpningskveld, media arts, talks.
                  </li>
                  <li>
                    • <span className="text-foreground">PARK Hamar</span> &
                    spillscener – spilltesting og e-sport.
                  </li>
                  <li>
                    •{" "}
                    <span className="text-foreground">
                      Høgskolen i Innlandet / VRINN
                    </span>{" "}
                    – XR-lab og faglige seminarer.
                  </li>
                  <li>
                    •{" "}
                    <span className="text-foreground">
                      Katta teknologiske treningssenter (KTT)
                    </span>{" "}
                    – ungdomslab, kodeklubb og maker-aktiviteter.
                  </li>
                  <li>
                    •{" "}
                    <span className="text-foreground">
                      Spillskolen, Making View, Fabelaktiv
                    </span>{" "}
                    m.fl. – åpne hus og omvisninger.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Format
                </h3>
                <ul className="space-y-1">
                  <li>• Fysiske arrangementer hos lokale aktører.</li>
                  <li>• Digitale sendinger, streamede talks og verksteder.</li>
                  <li>
                    • Enkel påmelding og billettsystem via HamarTech-nettsiden.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Billetter & påmelding
                </h3>
                <ul className="space-y-1">
                  <li>
                    • Flere arrangementer er{" "}
                    <span className="text-foreground">gratis</span>, men krever
                    påmelding pga. begrenset kapasitet.
                  </li>
                  <li>
                    • Du reserverer plass og får{" "}
                    <span className="text-foreground">
                      digital billett med QR-kode
                    </span>{" "}
                    i profilen din.
                  </li>
                  <li>
                    • QR-koden brukes ved inngang til utvalgte arrangementer.
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Høyrekolonne – kompakt oversiktskort */}
            <motion.div
              className="rounded-3xl border border-border/70 bg-background/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              variants={scaleIn(0.1)}
            >
              <h3 className="text-sm font-semibold text-foreground">
                Kort oppsummert
              </h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground md:text-base">
                <p>
                  • <span className="text-foreground">Målgruppe:</span> alle
                  innbyggere i Hamar-regionen – barn, ungdom, familier,
                  studenter og næringsliv.
                </p>
                <p>
                  • <span className="text-foreground">Tilgjengelighet:</span>{" "}
                  fokus på sentrale lokasjoner, universell utforming og
                  lavterskeltilbud for barn og unge.
                </p>
                <p>
                  • <span className="text-foreground">Reise:</span> kort
                  gangavstand mellom flere arenaer i Hamar sentrum, samt enkel
                  tilgang med tog og buss.
                </p>
                <p>
                  • <span className="text-foreground">Digital deltakelse:</span>{" "}
                  utvalgte talks og verksteder strømmes, og enkelte aktiviteter
                  er kun digitale.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border/70"
                >
                  <Link href="/program">Se program og billetter</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/praktisk-info">Detaljert praktisk info</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

type StatProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

function Stat({ label, value, icon: Icon }: StatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-secondary/40">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground md:text-xl">
          {value}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Глобальні градієнтові blur-кружки на фоні всієї сторінки */
function BackgroundGlows() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Верхній лівий */}
      <motion.div
        className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#22E4FF] opacity-25 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Верхній правий */}
      <motion.div
        className="absolute right-[-40px] top-0 h-80 w-80 rounded-full bg-[#F044FF] opacity-20 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
      />
      {/* Центр / низ */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#5B5BFF] opacity-20 blur-3xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: 0.2,
          scale: 1,
          y: 0,
        }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.15 }}
      />
    </div>
  );
}
