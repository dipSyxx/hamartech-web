'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations/presets'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

import { BackgroundGlows } from '@/components/shared/background-glows'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Spinner } from '@/components/ui/spinner'
import { useUserStore } from '@/lib/stores/user-store'

import { CalendarDays, Clock3, MapPin, Ticket, User2, Mail, CheckCircle2, ClockAlert, XCircle } from 'lucide-react'

import { TRACK_META, type TrackId } from '@/lib/data/program-meta'

type ReservationStatus = 'CONFIRMED' | 'WAITLIST' | 'CANCELLED'

type ApiVenue = {
  id: string
  name: string
  label: string
  address: string | null
  city: string
  country: string | null
  mapQuery: string
  googleMapsUrl: string
  openStreetMapUrl: string
}

type ApiEvent = {
  id: string
  slug: string
  title: string
  description: string
  trackId: TrackId
  dayLabel: string
  weekday: string
  dateLabel: string
  timeLabel: string
  targetGroup: string
  host: string
  isFree: boolean
  requiresRegistration: boolean
  startsAt: string | null
  endsAt: string | null
  venueLabel: string
  venue: ApiVenue
}

type ApiReservation = {
  id: string
  status: ReservationStatus
  quantity: number
  ticketCode: string | null
  ticketUrl: string | null
  qrDataUrl: string | null
  createdAt: string
  updatedAt: string
  event: ApiEvent
}

type UserProfile = {
  name?: string | null
  email?: string | null
  phone?: string | null
}

const STATUS_META: Record<ReservationStatus, { label: string; icon: React.ElementType; className: string }> = {
  CONFIRMED: {
    label: 'Bekreftet',
    icon: CheckCircle2,
    className: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 dark:text-emerald-200',
  },
  WAITLIST: {
    label: 'Venteliste',
    icon: ClockAlert,
    className: 'border-amber-400/70 bg-amber-500/10 text-amber-300 dark:text-amber-200',
  },
  CANCELLED: {
    label: 'Avlyst',
    icon: XCircle,
    className: 'border-destructive/70 bg-destructive/10 text-destructive dark:text-destructive',
  },
}

export default function MyPage() {
  const router = useRouter()
  const { status: sessionStatus } = useSession()
  const { user, loading, hasFetched, fetchUser, clearUser } = useUserStore()
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null)
  const [reservations, setReservations] = React.useState<ApiReservation[]>([])
  const [reservationsLoading, setReservationsLoading] = React.useState(true)
  const [reservationsError, setReservationsError] = React.useState<string | null>(null)
  const reservationsFetchedRef = React.useRef(false)
  const redirectAttemptedRef = React.useRef(false)

  const handleProfileSave = (values: ProfileFormValues) => {
    setSaveMessage('Profilen er oppdatert lokalt.')
  }

  const handleSignOut = async () => {
    clearUser()
    await signOut({ callbackUrl: '/' })
  }

  const fetchReservations = React.useCallback(async () => {
    setReservationsError(null)
    setReservationsLoading(true)
    try {
      const res = await fetch('/api/reservations')
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Kunne ikke hente reservasjoner.')
      }
      setReservations((data?.reservations ?? []) as ApiReservation[])
    } catch (err: any) {
      setReservationsError(err?.message ?? 'Kunne ikke hente reservasjoner.')
    } finally {
      setReservationsLoading(false)
    }
  }, [])

  // Перевірка авторизації через useSession
  // Тільки перенаправляємо якщо сесія точно не автентифікована (не завантажується)
  React.useEffect(() => {
    if (sessionStatus === 'unauthenticated' && !redirectAttemptedRef.current) {
      redirectAttemptedRef.current = true
      router.push('/login?callbackUrl=/min-side')
    }
    // Reset redirect attempt if session becomes authenticated
    if (sessionStatus === 'authenticated') {
      redirectAttemptedRef.current = false
    }
  }, [sessionStatus, router])

  // Завантаження даних користувача, якщо сесія є
  React.useEffect(() => {
    if (sessionStatus === 'authenticated' && !hasFetched && !loading) {
      fetchUser()
    }
  }, [sessionStatus, fetchUser, hasFetched, loading])

  React.useEffect(() => {
    if (reservationsFetchedRef.current) return
    if (sessionStatus !== 'authenticated' || !hasFetched || loading || !user) return
    reservationsFetchedRef.current = true
    fetchReservations()
  }, [sessionStatus, fetchReservations, hasFetched, loading, user])

  const upcomingReservations = React.useMemo(() => {
    const now = Date.now()
    return reservations.filter((reservation) => {
      const endsAt = reservation.event.endsAt ? new Date(reservation.event.endsAt).getTime() : null
      return !endsAt || endsAt >= now
    })
  }, [reservations])

  const pastReservations = React.useMemo(() => {
    const now = Date.now()
    return reservations.filter((reservation) => {
      const endsAt = reservation.event.endsAt ? new Date(reservation.event.endsAt).getTime() : null
      return !!endsAt && endsAt < now
    })
  }, [reservations])

  // Show spinner while checking session or fetching data
  if (sessionStatus === 'loading' || loading || !hasFetched || reservationsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

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
              <h1 id="profile-heading" className="text-3xl font-semibold md:text-4xl">
                Dine reservasjoner og billetter
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Her ser du oversikt over arrangementer du har reservert plass på, og QR-billetter du kan vise ved
                innsjekk.
              </p>
            </div>

            <motion.div
              variants={fadeInUp(0.05)}
              className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-xs text-muted-foreground shadow-[0_14px_36px_rgba(0,0,0,0.6)] md:text-sm"
            >
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Innlogget som
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#22E4FF44,transparent_55%),radial-gradient(circle_at_bottom,#F044FF44,transparent_55%)] text-sm font-semibold text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.6)]">
                    {(user?.name ?? user?.email ?? 'U').charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs font-medium text-foreground md:text-sm">
                      <User2 className="h-3.5 w-3.5 text-primary" />
                      <span>{user?.name ?? 'Ukjent bruker'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground md:text-xs">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{user?.email ?? 'ukjent@bruker.no'}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-border/70" onClick={handleSignOut}>
                  Logg ut
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="mt-6" variants={fadeInUp(0.04)} initial="hidden" animate="visible">
            <ProfileForm user={user ?? null} onSave={handleProfileSave} saveMessage={saveMessage} />
          </motion.div>

          {reservationsError && (
            <motion.div
              className="mt-6 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground shadow-[0_14px_36px_rgba(0,0,0,0.6)]"
              variants={fadeInUp(0.04)}
              initial="hidden"
              animate="visible"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Kunne ikke hente reservasjoner
              </p>
              <p className="mt-2 text-sm">{reservationsError}</p>
              <div className="mt-3">
                <Button onClick={fetchReservations} variant="outline" size="sm" className="border-border/70">
                  Prøv igjen
                </Button>
              </div>
            </motion.div>
          )}

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
            <SummaryCard label="Tidligere arrangementer" value={pastReservations.length.toString()} icon={Clock3} />
            <SummaryCard
              label="Forskjellige spor"
              value={new Set(reservations.map((r) => r.event.trackId)).size.toString()}
              icon={Ticket}
            />
          </motion.div>

          <motion.div className="mt-10" variants={fadeInUp(0.08)} initial="hidden" animate="visible">
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
                  Her finner du dine aktive reservasjoner og QR-billetter for innsjekk.
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
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <ReservationCard item={reservation} isUpcoming />
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
                          type: 'spring',
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
  )
}

type SummaryCardProps = {
  label: string
  value: string
  icon: React.ElementType
}

function SummaryCard({ label, value, icon: Icon }: SummaryCardProps) {
  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
      <CardContent className="flex items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-secondary/30">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}

type ReservationCardProps = {
  item: ApiReservation
  isUpcoming: boolean
}

function ReservationCard({ item, isUpcoming }: ReservationCardProps) {
  const event = item.event
  const trackMeta = TRACK_META[event.trackId]
  const track = trackMeta ?? {
    label: event.trackId,
    shortLabel: event.trackId,
    badgeClass: '',
    pillClass: '',
    icon: Ticket,
  }
  const TrackIcon = track.icon ?? Ticket

  const statusMeta = STATUS_META[item.status]

  return (
    <Card
      className={cn(
        'border-border/80 bg-background/80 shadow-[0_14px_40px_rgba(0,0,0,0.65)]',
        'transition-[border-color,background-color,box-shadow] duration-200 ease-out',
        'hover:border-primary/70 hover:bg-background/90 hover:shadow-[0_18px_55px_rgba(0,0,0,0.75)]',
      )}
    >
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span>{event.dayLabel}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
              <span>
                {event.weekday} – {event.dateLabel}
              </span>
            </p>
            <CardTitle className="text-base font-semibold md:text-lg">{event.title}</CardTitle>

            <CardDescription className="flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                {event.timeLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {event.venueLabel}
              </span>
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={cn('border text-[10px] md:text-[11px]', statusMeta.className)}>
              <statusMeta.icon className="mr-1 h-3.5 w-3.5" />
              {statusMeta.label}
            </Badge>
            <Badge variant="outline" className={cn('border text-[10px] md:text-[11px]', track.badgeClass)}>
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
              Arrangør: <span className="text-foreground font-medium">{event.host}</span>
            </p>
          </div>

          {isUpcoming && item.qrDataUrl && (
            <div className="mt-1 flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-background/70 p-3 text-center text-[11px] text-muted-foreground shadow-[0_10px_30px_rgba(0,0,0,0.6)] md:w-52">
              <img
                src={item.qrDataUrl}
                alt="QR billett"
                width={160}
                height={160}
                className="h-40 w-40 rounded-xl border border-border/70 bg-background/80 object-contain"
              />
              {item.ticketCode && (
                <p className="font-mono text-[10px] text-muted-foreground">Ticket: {item.ticketCode}</p>
              )}
              {item.ticketUrl && (
                <Button asChild variant="outline" size="sm" className="border-border/70">
                  <a href={item.ticketUrl} target="_blank" rel="noreferrer">
                    Åpne billett
                  </a>
                </Button>
              )}
              {item.status !== 'CONFIRMED' && (
                <p className="text-[10px] text-muted-foreground/80">QR brukes ved innsjekk når status er Bekreftet.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
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

        <Button asChild size="sm" className="text-xs">
          <Link href={`/program/${event.slug}`}>
            Se detaljer
            <Ticket className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

type EmptyStateProps = {
  title: string
  description: string
}

type ProfileFormValues = {
  name: string
  phone: string
  email: string
}

function ProfileForm({
  user,
  onSave,
  saveMessage,
}: {
  user: UserProfile | null
  onSave: (values: ProfileFormValues) => void
  saveMessage: string | null
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
    },
  })

  React.useEffect(() => {
    reset({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
    })
  }, [reset, user?.email, user?.name, user?.phone])

  const onSubmit = (values: ProfileFormValues) => {
    onSave(values)
  }

  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Profil</CardTitle>
        <CardDescription>Oppdater navn og telefon. E-post kan ikke endres.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Navn</label>
            <Input
              type="text"
              autoComplete="name"
              {...register('name', { required: 'Navn er påkrevd' })}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Telefon</label>
            <Input
              type="tel"
              autoComplete="tel"
              {...register('phone', {
                minLength: { value: 4, message: 'For kort nummer' },
              })}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">E-post</label>
            <Input type="email" disabled {...register('email')} />
          </div>

          {saveMessage && <p className="text-xs text-emerald-400">{saveMessage}</p>}

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isSubmitting || !user}>
              {isSubmitting ? 'Lagrer...' : 'Lagre endringer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-border/70 bg-background/70 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
      <CardContent className="px-4 py-6 text-sm text-muted-foreground md:text-base">
        <p className="text-sm font-semibold text-foreground md:text-base">{title}</p>
        <p className="mt-2 text-xs text-muted-foreground md:text-sm">{description}</p>
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
  )
}
