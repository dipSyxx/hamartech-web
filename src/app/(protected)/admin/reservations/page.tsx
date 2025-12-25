'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Reservation = {
  id: string
  status: string
  quantity: number
  ticketCode: string | null
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
    phone: string
  }
  event: {
    id: string
    slug: string
    title: string
    dayLabel: string
    timeLabel: string
  }
  checkIns: Array<{
    id: string
    scannedAt: string
  }>
  _count: {
    checkIns: number
  }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = React.useState<Reservation[]>([])
  const [loading, setLoading] = React.useState(true)
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false)
  const [selectedReservation, setSelectedReservation] = React.useState<Reservation | null>(null)
  const [newStatus, setNewStatus] = React.useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [reservationToDelete, setReservationToDelete] = React.useState<Reservation | null>(null)

  const fetchReservations = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reservations')
      if (!res.ok) {
        throw new Error('Kunne ikke hente reservasjoner')
      }
      const data = await res.json()
      setReservations(data.reservations)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke laste reservasjoner')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const handleStatusChange = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setNewStatus(reservation.status)
    setStatusDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!selectedReservation) return

    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReservation.id,
          status: newStatus,
        }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kunne ikke oppdatere reservasjon')
      }
      toast.success('Reservasjon oppdatert')
      setStatusDialogOpen(false)
      setSelectedReservation(null)
      fetchReservations()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke oppdatere reservasjon')
    }
  }

  const handleDelete = (reservation: Reservation) => {
    setReservationToDelete(reservation)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!reservationToDelete) return

    try {
      const res = await fetch(`/api/admin/reservations?id=${reservationToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kunne ikke slette reservasjon')
      }
      toast.success('Reservasjon slettet')
      setDeleteDialogOpen(false)
      setReservationToDelete(null)
      fetchReservations()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke slette reservasjon')
    }
  }

  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Bekreftet',
    WAITLIST: 'Venteliste',
    CANCELLED: 'Kansellert',
  }

  const columns: Column<Reservation>[] = [
    {
      key: 'user.email',
      label: 'Bruker',
      sortable: true,
      render: (reservation) => (
        <div>
          <div className="font-medium">{reservation.user.name || reservation.user.email}</div>
          <div className="text-xs text-muted-foreground">{reservation.user.email}</div>
        </div>
      ),
    },
    {
      key: 'event.title',
      label: 'Arrangement',
      sortable: true,
      render: (reservation) => (
        <div>
          <div className="font-medium">{reservation.event.title}</div>
          <div className="text-xs text-muted-foreground">
            {reservation.event.dayLabel} • {reservation.event.timeLabel}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'Bekreftet', value: 'CONFIRMED' },
        { label: 'Venteliste', value: 'WAITLIST' },
        { label: 'Kansellert', value: 'CANCELLED' },
      ],
      render: (reservation) => {
        const colors: Record<string, string> = {
          CONFIRMED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          WAITLIST: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
        }
        return (
          <Badge className={colors[reservation.status] || ''}>
            {statusLabels[reservation.status] || reservation.status}
          </Badge>
        )
      },
    },
    {
      key: 'quantity',
      label: 'Antall',
      sortable: true,
    },
    {
      key: 'ticketCode',
      label: 'Billettkode',
      sortable: true,
      render: (reservation) =>
        reservation.ticketCode ? (
          <span className="font-mono text-xs">{reservation.ticketCode}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: '_count.checkIns',
      label: 'Check-ins',
      sortable: true,
      render: (reservation) =>
        reservation._count.checkIns > 0 ? (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            {reservation._count.checkIns}
          </Badge>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Opprettet',
      sortable: true,
      render: (reservation) =>
        new Date(reservation.createdAt).toLocaleDateString('no-NO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
    },
    {
      key: 'actions',
      label: 'Handlinger',
      render: (reservation) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(reservation)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(reservation)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reservasjoner</h2>
        <p className="text-sm text-muted-foreground">Administrer alle reservasjoner i systemet</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={reservations}
            columns={columns}
            searchKey="user.email"
            searchPlaceholder="Søk etter e-post, navn eller arrangement..."
            loading={loading}
          />
        </CardContent>
      </Card>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Endre reservasjonsstatus</DialogTitle>
            <DialogDescription>
              Endre status for reservasjonen til {selectedReservation?.event.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMED">Bekreftet</SelectItem>
                  <SelectItem value="WAITLIST">Venteliste</SelectItem>
                  <SelectItem value="CANCELLED">Kansellert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={confirmStatusChange}>Oppdater</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette reservasjonen? Denne handlingen kan ikke angres.
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

