'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/admin/data-table'
import { EventForm } from '@/components/admin/event-form'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TRACK_META } from '@/lib/data/program-meta'

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
  _count?: {
    reservations: number
  }
}

type Venue = {
  id: string
  name: string
  label: string
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<Event[]>([])
  const [venues, setVenues] = React.useState<Venue[]>([])
  const [loading, setLoading] = React.useState(true)
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null)

  const fetchEvents = React.useCallback(async () => {
    try {
      const res = await fetch('/api/events')
      if (!res.ok) {
        throw new Error('Kunne ikke hente arrangementer')
      }
      const data = await res.json()
      setEvents(data.events)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke laste arrangementer')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchVenues = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/venues')
      if (!res.ok) {
        throw new Error('Kunne ikke hente lokasjoner')
      }
      const data = await res.json()
      setVenues(data.venues)
    } catch (error) {
      console.error('Failed to fetch venues:', error)
    }
  }, [])

  React.useEffect(() => {
    fetchEvents()
    fetchVenues()
  }, [fetchEvents, fetchVenues])

  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
    setFormOpen(true)
  }

  const handleDelete = (event: Event) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return

    try {
      const res = await fetch(`/api/admin/events?id=${eventToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kunne ikke slette arrangement')
      }
      toast.success('Arrangement slettet')
      setDeleteDialogOpen(false)
      setEventToDelete(null)
      fetchEvents()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke slette arrangement')
    }
  }

  const columns: Column<Event>[] = [
    {
      key: 'title',
      label: 'Tittel',
      sortable: true,
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
    },
    {
      key: 'trackId',
      label: 'Track',
      sortable: true,
      filterable: true,
      filterOptions: Object.keys(TRACK_META).map((key) => ({
        label: TRACK_META[key as keyof typeof TRACK_META].label,
        value: key,
      })),
      render: (event) => {
        const track = TRACK_META[event.trackId as keyof typeof TRACK_META]
        return track ? (
          <Badge variant="outline" className={track.badgeClass}>
            {track.shortLabel}
          </Badge>
        ) : (
          event.trackId
        )
      },
    },
    {
      key: 'dayLabel',
      label: 'Dag',
      sortable: true,
    },
    {
      key: 'venueLabel',
      label: 'Lokasjon',
      sortable: true,
    },
    {
      key: 'isFree',
      label: 'Gratis',
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'Gratis', value: 'true' },
        { label: 'Betalt', value: 'false' },
      ],
      render: (event) =>
        event.isFree ? (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Ja</Badge>
        ) : (
          <Badge variant="outline">Nei</Badge>
        ),
    },
    {
      key: 'requiresRegistration',
      label: 'Registrering',
      sortable: true,
      render: (event) =>
        event.requiresRegistration ? (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Ja</Badge>
        ) : (
          <Badge variant="outline">Nei</Badge>
        ),
    },
    {
      key: 'actions',
      label: 'Handlinger',
      render: (event) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(event)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arrangementer</h2>
          <p className="text-sm text-muted-foreground">Administrer alle arrangementer i systemet</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEvent(null)
            setFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Opprett arrangement
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={events}
            columns={columns}
            searchKey="title"
            searchPlaceholder="Søk etter tittel eller slug..."
            loading={loading}
          />
        </CardContent>
      </Card>

      <EventForm
        event={selectedEvent}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          fetchEvents()
          setSelectedEvent(null)
        }}
        venues={venues}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette arrangementet {eventToDelete?.title}? Alle reservasjoner for dette
              arrangementet vil også bli slettet. Denne handlingen kan ikke angres.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Avbryt
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

