'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type CheckIn = {
  id: string
  scannedAt: string
  reservation: {
    id: string
    ticketCode: string | null
    user: {
      id: string
      email: string
      name: string | null
    }
    event: {
      id: string
      title: string
      slug: string
    }
  }
  scannedBy: {
    id: string
    email: string
    name: string | null
  } | null
}

export default function CheckInsPage() {
  const [checkIns, setCheckIns] = React.useState<CheckIn[]>([])
  const [loading, setLoading] = React.useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [checkInToDelete, setCheckInToDelete] = React.useState<CheckIn | null>(null)

  const fetchCheckIns = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/check-ins')
      if (!res.ok) {
        throw new Error('Kunne ikke hente check-ins')
      }
      const data = await res.json()
      setCheckIns(data.checkIns)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke laste check-ins')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCheckIns()
  }, [fetchCheckIns])

  const handleDelete = (checkIn: CheckIn) => {
    setCheckInToDelete(checkIn)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!checkInToDelete) return

    try {
      const res = await fetch(`/api/admin/check-ins?id=${checkInToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kunne ikke slette check-in')
      }
      toast.success('Check-in slettet')
      setDeleteDialogOpen(false)
      setCheckInToDelete(null)
      fetchCheckIns()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke slette check-in')
    }
  }

  const columns: Column<CheckIn>[] = [
    {
      key: 'reservation.user.email',
      label: 'Bruker',
      sortable: true,
      render: (checkIn) => (
        <div>
          <div className="font-medium">{checkIn.reservation.user.name || checkIn.reservation.user.email}</div>
          <div className="text-xs text-muted-foreground">{checkIn.reservation.user.email}</div>
        </div>
      ),
    },
    {
      key: 'reservation.event.title',
      label: 'Arrangement',
      sortable: true,
      render: (checkIn) => checkIn.reservation.event.title,
    },
    {
      key: 'reservation.ticketCode',
      label: 'Billettkode',
      sortable: true,
      render: (checkIn) =>
        checkIn.reservation.ticketCode ? (
          <span className="font-mono text-xs">{checkIn.reservation.ticketCode}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: 'scannedAt',
      label: 'Skannet',
      sortable: true,
      render: (checkIn) =>
        new Date(checkIn.scannedAt).toLocaleString('no-NO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'scannedBy.email',
      label: 'Skannet av',
      sortable: true,
      render: (checkIn) =>
        checkIn.scannedBy ? (
          <div>
            <div className="font-medium">{checkIn.scannedBy.name || checkIn.scannedBy.email}</div>
            <div className="text-xs text-muted-foreground">{checkIn.scannedBy.email}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">System</span>
        ),
    },
    {
      key: 'actions',
      label: 'Handlinger',
      render: (checkIn) => (
        <Button variant="ghost" size="sm" onClick={() => handleDelete(checkIn)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Check-ins</h2>
        <p className="text-sm text-muted-foreground">Oversikt over alle check-ins i systemet</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={checkIns}
            columns={columns}
            searchKey="reservation.user.email"
            searchPlaceholder="Søk etter e-post, navn eller arrangement..."
            loading={loading}
          />
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette denne check-in'en? Denne handlingen kan ikke angres.
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

