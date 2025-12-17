// app/min-side/page.tsx
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { BackgroundGlows } from "@/components/shared/background-glows";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/stores/user-store";
import { redirect } from "next/navigation";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Ticket,
  User2,
  Mail,
  CheckCircle2,
  ClockAlert,
  XCircle,
} from "lucide-react";

import { EVENTS } from "@/lib/data/events";
import { TRACK_META } from "@/lib/data/program-meta";
import {
  RESERVATIONS,
  type Reservation,
  type ReservationStatus,
} from "@/lib/data/reservations";

type EventItem = (typeof EVENTS)[number];

type ReservationWithEvent = Reservation & {
  event: EventItem;
};

const STATUS_META: Record<
  ReservationStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  confirmed: {
    label: "Bekreftet",
    icon: CheckCircle2,
    className:
      "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 dark:text-emerald-200",
  },
  waitlist: {
    label: "Venteliste",
    icon: ClockAlert,
    className:
      "border-amber-400/70 bg-amber-500/10 text-amber-300 dark:text-amber-200",
  },
  cancelled: {
    label: "Avlyst",
    icon: XCircle,
    className:
      "border-destructive/70 bg-destructive/10 text-destructive dark:text-destructive",
  },
};

const MOCK_USER = {
  name: "Festivalgjest",
  email: "festival.gjest@example.com",
};

export default function MyPage() {
  const { user, loading, hasFetched } = useUserStore();

  React.useEffect(() => {
    if (hasFetched && !loading && user === null) {
      redirect("/login?callbackUrl=/min-side");
    }
  }, [hasFetched, loading, user]);

  const reservationsWithEvent = React.useMemo<ReservationWithEvent[]>(() => {
    return RESERVATIONS.reduce<ReservationWithEvent[]>((acc, reservation) => {
      const event = EVENTS.find((e) => e.id === reservation.eventId);
      if (!event) return acc;
      acc.push({ ...reservation, event });
      return acc;
    }, []);
  }, []);

  const upcomingReservations = reservationsWithEvent.filter(
    (r) => r.kind === "upcoming"
  );
  const pastReservations = reservationsWithEvent.filter(
    (r) => r.kind === "past"
  );

  return (
    <div className="relative overflow-hidden">
      <BackgroundGlows />

      <motion.section
        id="min-side"
        aria-labelledby="profile-heading"
        className="border-b border-border bg-background"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-8">
          <motion.div
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            variants={fadeIn(0)}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <User2 className="h-4 w-4" />
                Min HamarTech-profil
              </p>
              <h1
                id="profile-heading"
                className="text-3xl font-semibold md:text-4xl"
              >
                Dine reservasjoner og billetter
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Her ser du oversikt over arrangementer du har reservert plass
                på. Senere kan denne siden kobles til innlogging og digitale
                billetter med QR-kode.
              </p>
            </div>

            <motion.div
              variants={fadeInUp(0.05)}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-xs text-muted-foreground shadow-[0_14px_36px_rgba(0,0,0,0.6)] md:text-sm"
            >
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Innlogget som
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#22E4FF44,transparent_55%),radial-gradient(circle_at_bottom,#F044FF44,transparent_55%)] text-sm font-semibold text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.6)]">
                  {(user?.name ?? user?.email ?? "U").charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-xs font-medium text-foreground md:text-sm">
                    <User2 className="h-3.5 w-3.5 text-primary" />
                    <span>{user?.name ?? "Ukjent bruker"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground md:text-xs">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user?.email ?? "ukjent@bruker.no"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 grid gap-4 md:grid-cols-3"
            variants={fadeInUp(0.06)}
            initial="hidden"
            animate="visible"
          >
            <SummaryCard
              label="Kommende reservasjoner"
              value={upcomingReservations.length.toString()}
              icon={CalendarDays}
            />
            <SummaryCard
              label="Tidligere arrangementer"
              value={pastReservations.length.toString()}
              icon={Clock3}
            />
            <SummaryCard
              label="Forskjellige spor"
              value={new Set(reservationsWithEvent.map((r) => r.event.trackId))
                .size
                .toString()}
              icon={Ticket}
            />
          </motion.div>

          <motion.div
            className="mt-10"
            variants={fadeInUp(0.08)}
            initial="hidden"
            animate="visible"
          >
            <Tabs defaultValue="upcoming" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <TabsList className="flex w-fit flex-wrap gap-1 bg-secondary/40 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                  <TabsTrigger value="upcoming" className="min-w-max">
                    Kommende ({upcomingReservations.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="min-w-max">
                    Tidligere ({pastReservations.length})
                  </TabsTrigger>
                </TabsList>

                <p className="text-xs text-muted-foreground md:text-sm">
                  Dette er en prototype-visning. I en senere løsning kan du
                  administrere reservasjoner, avbestille og hente QR-billetter.
                </p>
              </div>

              <TabsContent value="upcoming" className="mt-2 space-y-4">
                {upcomingReservations.length === 0 ? (
                  <EmptyState
                    title="Ingen kommende reservasjoner"
                    description="Når du reserverer plass på arrangementer under HamarTech, vil de dukke opp her."
                  />
                ) : (
                  <div className="space-y-4">
                    {upcomingReservations.map((reservation, index) => (
                      <motion.div
                        key={reservation.id}
                        variants={fadeInUp(0.04 * index)}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <ReservationCard
                          item={reservation}
                          isUpcoming
                          showQrPlaceholder={reservation.status === "confirmed"}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="mt-2 space-y-4">
                {pastReservations.length === 0 ? (
                  <EmptyState
                    title="Ingen tidligere arrangementer"
                    description="Etter at festivalen er gjennomført, vil tidligere arrangementer du har deltatt på vises her."
                  />
                ) : (
                  <div className="space-y-4">
                    {pastReservations.map((reservation, index) => (
                      <motion.div
                        key={reservation.id}
                        variants={fadeInUp(0.04 * index)}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -3, scale: 1.005 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 22,
                        }}
                      >
                        <ReservationCard item={reservation} isUpcoming={false} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  icon: React.ElementType;
};

function SummaryCard({ label, value, icon: Icon }: SummaryCardProps) {
  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
      <CardContent className="flex items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-secondary/30">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

type ReservationCardProps = {
  item: ReservationWithEvent;
  isUpcoming: boolean;
  showQrPlaceholder?: boolean;
};

function ReservationCard({
  item,
  isUpcoming,
  showQrPlaceholder,
}: ReservationCardProps) {
  const event = item.event;
  const track = TRACK_META[event.trackId as keyof typeof TRACK_META];
  const TrackIcon = track.icon;

  const statusMeta = STATUS_META[item.status];

  return (
    <Card
      className={cn(
        "border-border/80 bg-background/80 shadow-[0_14px_40px_rgba(0,0,0,0.65)]",
        "transition-[border-color,background-color,box-shadow] duration-200 ease-out",
        "hover:border-primary/70 hover:bg-background/90 hover:shadow-[0_18px_55px_rgba(0,0,0,0.75)]"
      )}
    >
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span>{event.dayLabel}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
              <span>
                {event.weekday} – {event.date}
              </span>
            </p>
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
              className={cn(
                "border text-[10px] md:text-[11px]",
                statusMeta.className
              )}
            >
              <statusMeta.icon className="mr-1 h-3.5 w-3.5" />
              {statusMeta.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "border text-[10px] md:text-[11px]",
                track.badgeClass
              )}
            >
              <TrackIcon className="mr-1 h-3 w-3" />
              {track.shortLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm text-muted-foreground md:text-[15px]">
            <p>{event.description}</p>
            <p className="text-[11px] text-muted-foreground md:text-xs">
              Arrangør:{" "}
              <span className="text-foreground font-medium">{event.host}</span>
            </p>
          </div>

          {isUpcoming && showQrPlaceholder && (
            <div className="mt-1 flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-background/70 p-3 text-center text-[11px] text-muted-foreground shadow-[0_10px_30px_rgba(0,0,0,0.6)] md:w-48">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[radial-gradient(circle_at_top,#22E4FF44,transparent_55%),radial-gradient(circle_at_bottom,#F044FF55,transparent_55%)] shadow-[0_14px_34px_rgba(0,0,0,0.7)]">
                <div className="h-12 w-12 rounded-lg border border-dashed border-border/70 bg-background/70" />
              </div>
              <p className="flex items-center justify-center gap-1">
                <Ticket className="h-3.5 w-3.5 text-primary" />
                Digital billett
              </p>
              <p className="text-[10px] text-muted-foreground/80">
                QR-kode blir tilgjengelig nærmere arrangementsstart i den
                endelige løsningen.
              </p>
            </div>
          )}
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

type EmptyStateProps = {
  title: string;
  description: string;
};

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
      <CardContent className="px-4 py-6 text-sm text-muted-foreground md:text-base">
        <p className="text-sm font-semibold text-foreground md:text-base">
          {title}
        </p>
        <p className="mt-2 text-xs text-muted-foreground md:text-sm">
          {description}
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm" className="border-border/70">
            <Link href="/program">
              Gå til programmet
              <CalendarDays className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
