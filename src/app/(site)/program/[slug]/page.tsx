'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { fadeIn, fadeInUp, scaleIn, staggerContainer } from '@/lib/animations/presets'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

import { BackgroundGlows } from '@/components/shared/background-glows'
import { cn } from '@/lib/utils'

import { CalendarDays, Clock3, MapPin, Users, Ticket, ChevronLeft } from 'lucide-react'
import { useParams } from 'next/navigation'

import { TRACK_META } from '@/lib/data/program-meta'
import { Spinner } from '@/components/ui/spinner'

type ApiVenue = {
  id: string
  label: string
  name: string
  address: string | null
  city: string | null
  mapQuery: string | null
  googleMapsUrl: string | null
  openStreetMapUrl: string | null
}

type ProgramEvent = {
  id: string
  slug: string
  title: string
  description: string
  dayId: string
  dayLabel: string
  weekday: string
  date: string
  time: string
  trackId: string
  venueId: string
  venue: string
  venueInfo: ApiVenue | null
  targetGroup: string
  host: string
  isFree: boolean
  requiresRegistration: boolean
  startsAt?: string | null
  endsAt?: string | null
}

function mapApiEvent(event: any): ProgramEvent {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    dayId: event.dayId,
    dayLabel: event.dayLabel,
    weekday: event.weekday,
    date: event.dateLabel ?? event.date ?? '',
    time: event.timeLabel ?? event.time ?? '',
    trackId: event.trackId,
    venueId: event.venueId,
    venue: event.venueLabel ?? event.venue?.label ?? '',
    venueInfo: event.venue ?? null,
    targetGroup: event.targetGroup,
    host: event.host,
    isFree: Boolean(event.isFree),
    requiresRegistration: Boolean(event.requiresRegistration),
    startsAt: event.startsAt ?? null,
    endsAt: event.endsAt ?? null,
  }
}

export default function ProgramEvent() {
  const params = useParams<{ slug?: string | string[] }>()
  const slug = React.useMemo(() => {
    const value = params?.slug
    return Array.isArray(value) ? value[0] : value ?? ''
  }, [params])

  const [event, setEvent] = React.useState<ProgramEvent | null>(null)
  const [allEvents, setAllEvents] = React.useState<ProgramEvent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!slug) {
        setEvent(null)
        setAllEvents([])
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const [eventRes, listRes] = await Promise.all([fetch(`/api/events/${slug}`), fetch('/api/events')])

        const eventJson = await eventRes.json()
        if (!eventRes.ok) {
          throw new Error(eventJson?.error || 'Fant ikke arrangementet.')
        }

        const current = mapApiEvent(eventJson.event)
        let mappedList: ProgramEvent[] = []

        if (listRes.ok) {
          const listJson = await listRes.json()
          mappedList = listJson?.events?.map((item: any) => mapApiEvent(item)) ?? []
        }

        if (!cancelled) {
          setEvent(current)
          setAllEvents(mappedList.filter((item) => item.id !== current.id))
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Kunne ikke hente arrangementet.')
          setEvent(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [slug])

  const venue = event?.venueInfo
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapEmbedSrc =
    venue && mapsApiKey
      ? `https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=${encodeURIComponent(
          venue.mapQuery ?? venue.label ?? event?.venue ?? '',
        )}`
      : null

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <section className="border-b border-border bg-background">
          <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-6 px-4 py-16 md:px-8 text-center">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Kunne ikke hente arrangementet
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">Noe gikk galt</h1>
              <p className="text-sm text-muted-foreground md:text-base">{error}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/program">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Tilbake til programmet
                </Link>
              </Button>
              <Button size="sm" onClick={() => window.location.reload()}>
                Prøv igjen
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

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
              <h1 className="text-3xl font-semibold md:text-4xl">Denne siden finnes ikke</h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Arrangementet du prøver å åpne er ikke tilgjengelig. Det kan ha blitt fjernet eller fått en ny adresse.
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
    )
  }

  const trackMeta = TRACK_META[event.trackId as keyof typeof TRACK_META] ?? null
  const track =
    trackMeta ??
    ({
      label: event.trackId,
      shortLabel: event.trackId,
      badgeClass: '',
      icon: CalendarDays,
    } as const)
  const TrackIcon = track.icon ?? CalendarDays

  const sameDayEvents = allEvents.filter((item) => item.dayId === event.dayId && item.id !== event.id)
  const sameTrackEvents = allEvents
    .filter((item) => item.trackId === event.trackId && item.id !== event.id && item.dayId !== event.dayId)
    .slice(0, 3)

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
          <motion.div className="flex flex-wrap items-center justify-between gap-3" variants={fadeIn(0)}>
            <Button asChild variant="outline" size="sm" className="border-border/70">
              <Link href="/program">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Tilbake til programmet
              </Link>
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn('border text-[11px] md:text-xs', track.badgeClass)}>
                <TrackIcon className="mr-1 h-3.5 w-3.5" />
                {track.label}
              </Badge>
              <Badge variant="secondary" className="border-border/60 bg-secondary/60 text-[11px] md:text-xs">
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

            <h1 id="event-heading" className="text-3xl font-semibold leading-tight md:text-4xl">
              {event.title}
            </h1>

            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{event.description}</p>
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
                  <CardTitle className="text-base font-semibold md:text-lg">Om arrangementet</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground md:text-[15px]">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm text-muted-foreground md:text-[15px]">
                    <DetailRow icon={Clock3} label="Tid" value={event.time} />
                    <DetailRow icon={MapPin} label="Sted" value={event.venue} />
                    <DetailRow icon={Users} label="Målgruppe" value={event.targetGroup} />
                    <DetailRow
                      icon={Ticket}
                      label="Billetter"
                      value={
                        event.isFree
                          ? 'Gratis – enkelte arrangementer krever plassreservasjon'
                          : 'Betalt arrangement med billetter'
                      }
                    />
                    <DetailRow icon={CalendarDays} label="Dag" value={`${event.weekday} – ${event.date}`} />
                    <DetailRow icon={TrackIcon} label="Spor" value={track.label} />
                    <DetailRow icon={Users} label="Arrangør" value={event.host} />

                    {event.requiresRegistration && (
                      <p className="mt-3 rounded-lg border border-border/70 bg-secondary/20 px-3 py-2 text-xs text-muted-foreground md:text-sm">
                        Påmelding er nødvendig for dette arrangementet. I en senere versjon av løsningen kan du
                        reservere plass og få digital billett via HamarTech-profilen din.
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
                    <Badge
                      variant={event.isFree ? 'secondary' : 'outline'}
                      className={cn('border-border/60 bg-secondary/50', !event.isFree && 'bg-transparent')}
                    >
                      {event.isFree ? 'Gratis' : 'Billetter'}
                    </Badge>
                    {event.requiresRegistration && (
                      <Badge variant="outline" className="border-border/70 text-[11px]">
                        Påmelding nødvendig
                      </Badge>
                    )}
                  </div>

                  {event.requiresRegistration ? (
                    <Button asChild size="sm" className="text-xs border-0">
                      <Link href={`/checkout/${event.slug}`}>
                        Bestille
                        <CalendarDays className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Ingen reservasjon nødvendig.</span>
                  )}
                </CardFooter>
              </Card>

              {venue && (
                <motion.section className="mt-6 space-y-3" variants={scaleIn(0.08)}>
                  <h2 className="text-sm font-semibold md:text-base">Sted & kart</h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    {venue.label}
                    {venue.address && (
                      <>
                        {' · '}
                        <span className="text-foreground">{venue.address}</span>
                      </>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <Button asChild variant="outline" size="sm">
                      <a href={venue.googleMapsUrl ?? undefined} target="_blank" rel="noreferrer">
                        Åpne i Google Maps
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <a href={venue.openStreetMapUrl ?? undefined} target="_blank" rel="noreferrer">
                        Åpne i OpenStreetMap
                      </a>
                    </Button>
                  </div>

                  {mapEmbedSrc && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                      <iframe
                        title={`Kart – ${venue.label}`}
                        src={mapEmbedSrc}
                        width="100%"
                        height="260"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                  )}
                </motion.section>
              )}
            </motion.div>

            {/* Right: compact practical info */}
            <motion.aside variants={scaleIn(0.1)}>
              <Card className="border-border/80 bg-background/80 shadow-[0_16px_45px_rgba(0,0,0,0.7)]">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold md:text-base">Praktisk info</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground md:text-sm">
                    Kort oppsummering av når og hvor arrangementet skjer.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs text-muted-foreground md:text-sm">
                  <DetailRow compact icon={Clock3} label="Tid" value={event.time} />
                  <DetailRow compact icon={MapPin} label="Sted" value={event.venue} />
                  <DetailRow compact icon={Users} label="For hvem" value={event.targetGroup} />
                  <DetailRow compact icon={Ticket} label="Pris" value={event.isFree ? 'Gratis' : 'Billetter'} />
                </CardContent>
              </Card>
            </motion.aside>
          </motion.div>

          {/* Related events */}
          {(sameDayEvents.length > 0 || sameTrackEvents.length > 0) && (
            <motion.div className="mt-10 space-y-8" variants={fadeInUp(0.12)}>
              {sameDayEvents.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold md:text-base">Flere arrangementer samme dag</h2>
                  <p className="text-xs text-muted-foreground md:text-sm">
                    Utforsk hva mer som skjer på <span className="text-foreground">{event.dayLabel}</span>.
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
                  <h2 className="text-sm font-semibold md:text-base">Flere {track.shortLabel}-arrangementer</h2>
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
  )
}

/* Shared UI bits */

type DetailRowProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  compact?: boolean
}

function DetailRow({ icon: Icon, label, value, compact }: DetailRowProps) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/30">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className={cn('text-xs text-foreground md:text-sm', compact && 'text-xs md:text-[13px]')}>{value}</p>
      </div>
    </div>
  )
}

type RelatedEventCardProps = {
  event: ProgramEvent
}

function RelatedEventCard({ event }: RelatedEventCardProps) {
  const trackMeta = TRACK_META[event.trackId as keyof typeof TRACK_META] ?? null
  const track =
    trackMeta ??
    ({
      label: event.trackId,
      shortLabel: event.trackId,
      badgeClass: '',
      icon: CalendarDays,
    } as const)
  const TrackIcon = track.icon ?? CalendarDays

  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-[border-color,background-color,box-shadow] duration-150 hover:border-primary/70 hover:bg-background/90 hover:shadow-[0_16px_45px_rgba(0,0,0,0.7)]">
      <CardContent className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">
              {event.time} • {event.venue}
            </p>
            <h3 className="mt-1 text-sm font-semibold text-foreground">{event.title}</h3>
          </div>
          <Badge variant="outline" className={cn('border text-[10px]', track.badgeClass)}>
            <TrackIcon className="mr-1 h-3 w-3" />
            {track.shortLabel}
          </Badge>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span>{event.targetGroup}</span>
          <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
            <Link href={`/program/${event.slug}`}>Se mer</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
