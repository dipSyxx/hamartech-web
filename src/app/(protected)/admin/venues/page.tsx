'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/admin/data-table'
import { VenueForm } from '@/components/admin/venue-form'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type Venue = {
  id: string
  name: string
  label: string
  address: string | null
  city: string
  country: string | null
  mapQuery: string
  googleMapsUrl: string
  openStreetMapUrl: string
  _count?: {
    events: number
  }
}

export default function VenuesPage() {
  const [venues, setVenues] = React.useState<Venue[]>([])
  const [loading, setLoading] = React.useState(true)
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedVenue, setSelectedVenue] = React.useState<Venue | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [venueToDelete, setVenueToDelete] = React.useState<Venue | null>(null)

  const fetchVenues = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/venues')
      if (!res.ok) {
        throw new Error('Kunne ikke hente lokasjoner')
      }
      const data = await res.json()
      setVenues(data.venues)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke laste lokasjoner')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchVenues()
  }, [fetchVenues])

  const handleEdit = (venue: Venue) => {
    setSelectedVenue(venue)
    setFormOpen(true)
  }

  const handleDelete = (venue: Venue) => {
    setVenueToDelete(venue)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!venueToDelete) return

    try {
      const res = await fetch(`/api/admin/venues?id=${venueToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kunne ikke slette lokasjon')
      }
      toast.success('Lokasjon slettet')
      setDeleteDialogOpen(false)
      setVenueToDelete(null)
      fetchVenues()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke slette lokasjon')
    }
  }

  const columns: Column<Venue>[] = [
    {
      key: 'name',
      label: 'Navn',
      sortable: true,
      searchKey: 'name',
    },
    {
      key: 'label',
      label: 'Label',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Adresse',
      sortable: true,
      render: (venue) => venue.address || <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'city',
      label: 'By',
      sortable: true,
      filterable: true,
      filterOptions: Array.from(new Set(venues.map((v) => v.city))).map((city) => ({
        label: city,
        value: city,
      })),
    },
    {
      key: 'country',
      label: 'Land',
      sortable: true,
      render: (venue) => venue.country || <span className="text-muted-foreground">-</span>,
    },
    {
      key: '_count.events',
      label: 'Arrangementer',
      sortable: true,
      render: (venue) => venue._count?.events || 0,
    },
    {
      key: 'actions',
      label: 'Handlinger',
      render: (venue) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(venue)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(venue)}>
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
          <h2 className="text-2xl font-bold">Lokasjoner</h2>
          <p className="text-sm text-muted-foreground">Administrer alle lokasjoner i systemet</p>
        </div>
        <Button
          onClick={() => {
            setSelectedVenue(null)
            setFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Opprett lokasjon
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={venues}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Søk etter navn, label eller by..."
            loading={loading}
          />
        </CardContent>
      </Card>

      <VenueForm
        venue={selectedVenue}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          fetchVenues()
          setSelectedVenue(null)
        }}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette lokasjonen {venueToDelete?.label}?
              {venueToDelete?._count?.events && venueToDelete._count.events > 0
                ? ` Denne lokasjonen har ${venueToDelete._count.events} tilknyttede arrangementer og kan ikke slettes.`
                : ' Denne handlingen kan ikke angres.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={!!venueToDelete?._count?.events && venueToDelete._count.events > 0}
            >
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

