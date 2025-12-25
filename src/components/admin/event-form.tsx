'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { TRACK_META, DAY_OPTIONS } from '@/lib/data/program-meta'

const eventSchema = z.object({
  slug: z.string().min(1, 'Slug er påkrevd').max(200),
  title: z.string().min(1, 'Tittel er påkrevd').max(500),
  description: z.string().min(1, 'Beskrivelse er påkrevd'),
  trackId: z.enum(['creative', 'games', 'xr', 'youth', 'business']),
  dayId: z.enum(['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']),
  dayLabel: z.string().min(1),
  weekday: z.string().min(1),
  dateLabel: z.string().min(1),
  timeLabel: z.string().min(1),
  targetGroup: z.string().min(1),
  host: z.string().min(1),
  isFree: z.boolean(),
  requiresRegistration: z.boolean(),
  venueId: z.string().min(1),
  venueLabel: z.string().min(1),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
})

type EventFormValues = z.infer<typeof eventSchema>

type Event = {
  id: string
  slug: string
  title: string
  description: string
  trackId: string
  dayId: string
  dayLabel: string
  weekday: string
  dateLabel: string
  timeLabel: string
  targetGroup: string
  host: string
  isFree: boolean
  requiresRegistration: boolean
  venueId: string
  venueLabel: string
  startsAt: string | null
  endsAt: string | null
  venue?: {
    id: string
    name: string
    label: string
  }
}

type EventFormProps = {
  event?: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  venues: Array<{ id: string; name: string; label: string }>
}

export function EventForm({ event, open, onOpenChange, onSuccess, venues }: EventFormProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!event

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      slug: event?.slug || '',
      title: event?.title || '',
      description: event?.description || '',
      trackId: (event?.trackId as any) || 'creative',
      dayId: (event?.dayId as any) || 'day1',
      dayLabel: event?.dayLabel || '',
      weekday: event?.weekday || '',
      dateLabel: event?.dateLabel || '',
      timeLabel: event?.timeLabel || '',
      targetGroup: event?.targetGroup || '',
      host: event?.host || '',
      isFree: event?.isFree ?? true,
      requiresRegistration: event?.requiresRegistration ?? false,
      venueId: event?.venueId || venues[0]?.id || '',
      venueLabel: event?.venueLabel || venues[0]?.label || '',
      startsAt: event?.startsAt ? new Date(event.startsAt).toISOString().slice(0, 16) : null,
      endsAt: event?.endsAt ? new Date(event.endsAt).toISOString().slice(0, 16) : null,
    },
  })

  React.useEffect(() => {
    if (event) {
      form.reset({
        slug: event.slug,
        title: event.title,
        description: event.description,
        trackId: event.trackId as any,
        dayId: event.dayId as any,
        dayLabel: event.dayLabel,
        weekday: event.weekday,
        dateLabel: event.dateLabel,
        timeLabel: event.timeLabel,
        targetGroup: event.targetGroup,
        host: event.host,
        isFree: event.isFree,
        requiresRegistration: event.requiresRegistration,
        venueId: event.venueId,
        venueLabel: event.venueLabel,
        startsAt: event.startsAt ? new Date(event.startsAt).toISOString().slice(0, 16) : null,
        endsAt: event.endsAt ? new Date(event.endsAt).toISOString().slice(0, 16) : null,
      })
    } else {
      form.reset({
        slug: '',
        title: '',
        description: '',
        trackId: 'creative',
        dayId: 'day1',
        dayLabel: '',
        weekday: '',
        dateLabel: '',
        timeLabel: '',
        targetGroup: '',
        host: '',
        isFree: true,
        requiresRegistration: false,
        venueId: venues[0]?.id || '',
        venueLabel: venues[0]?.label || '',
        startsAt: null,
        endsAt: null,
      })
    }
  }, [event, form, venues])

  const handleVenueChange = (venueId: string) => {
    const venue = venues.find((v) => v.id === venueId)
    if (venue) {
      form.setValue('venueId', venue.id)
      form.setValue('venueLabel', venue.label)
    }
  }

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true)
    try {
      const payload: any = {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt).toISOString() : null,
        endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : null,
      }

      if (isEdit) {
        const res = await fetch('/api/admin/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: event!.id, ...payload }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Kunne ikke oppdatere arrangement')
        }
        toast.success('Arrangement oppdatert')
      } else {
        const res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Kunne ikke opprette arrangement')
        }
        toast.success('Arrangement opprettet')
      }
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'En feil oppstod')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Rediger arrangement' : 'Opprett arrangement'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="event-form">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <Input {...form.register('slug')} placeholder="event-slug" required />
              {form.formState.errors.slug && (
                <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tittel *</label>
              <Input {...form.register('title')} placeholder="Arrangement tittel" required />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Beskrivelse *</label>
            <Textarea {...form.register('description')} placeholder="Beskrivelse" rows={4} required />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Track *</label>
              <Select
                value={form.watch('trackId')}
                onValueChange={(value) => form.setValue('trackId', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRACK_META).map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dag *</label>
              <Select
                value={form.watch('dayId')}
                onValueChange={(value) => form.setValue('dayId', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAY_OPTIONS.filter((d) => d.id !== 'all').map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dag label *</label>
              <Input {...form.register('dayLabel')} placeholder="Dag 1 – Opening" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ukedag *</label>
              <Input {...form.register('weekday')} placeholder="Mandag" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dato label *</label>
              <Input {...form.register('dateLabel')} placeholder="Uke 42" required />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tid label *</label>
              <Input {...form.register('timeLabel')} placeholder="18:00–21:00" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Målgruppe *</label>
              <Input {...form.register('targetGroup')} placeholder="Åpent for alle" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Arrangør *</label>
            <Input {...form.register('host')} placeholder="Hamar kommune" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Lokasjon *</label>
            <Select
              value={form.watch('venueId')}
              onValueChange={handleVenueChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Starter</label>
              <Input
                type="datetime-local"
                {...form.register('startsAt')}
                value={form.watch('startsAt') || ''}
                onChange={(e) => form.setValue('startsAt', e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slutter</label>
              <Input
                type="datetime-local"
                {...form.register('endsAt')}
                value={form.watch('endsAt') || ''}
                onChange={(e) => form.setValue('endsAt', e.target.value || null)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gratis</label>
              <Select
                value={form.watch('isFree') ? 'true' : 'false'}
                onValueChange={(value) => form.setValue('isFree', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ja</SelectItem>
                  <SelectItem value="false">Nei</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Krever registrering</label>
              <Select
                value={form.watch('requiresRegistration') ? 'true' : 'false'}
                onValueChange={(value) => form.setValue('requiresRegistration', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ja</SelectItem>
                  <SelectItem value="false">Nei</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          </form>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6 pt-4 shrink-0 border-t border-border/50">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button type="submit" disabled={loading} onClick={form.handleSubmit(onSubmit)} form="event-form">
            {loading ? 'Lagrer...' : isEdit ? 'Oppdater' : 'Opprett'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

