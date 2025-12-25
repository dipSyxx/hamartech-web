'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/admin/data-table'
import { UserForm } from '@/components/admin/user-form'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type User = {
  id: string
  email: string
  name: string | null
  phone: string
  role: string
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
  _count: {
    reservations: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [formOpen, setFormOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null)

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        throw new Error('Kunne ikke hente brukere')
      }
      const data = await res.json()
      setUsers(data.users)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke laste brukere')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormOpen(true)
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      const res = await fetch(`/api/admin/users?id=${userToDelete.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Kunne ikke slette bruker')
      }
      toast.success('Bruker slettet')
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      fetchUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke slette bruker')
    }
  }

  const columns: Column<User>[] = [
    {
      key: 'email',
      label: 'E-post',
      sortable: true,
      searchKey: 'email',
    },
    {
      key: 'name',
      label: 'Navn',
      sortable: true,
      render: (user) => user.name || <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'phone',
      label: 'Telefon',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Rolle',
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'USER', value: 'USER' },
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'APPROVER', value: 'APPROVER' },
      ],
      render: (user) => (
        <Badge variant="outline" className="capitalize">
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'emailVerifiedAt',
      label: 'Verifisert',
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'Verifisert', value: 'verified' },
        { label: 'Ikke verifisert', value: 'unverified' },
      ],
      render: (user) =>
        user.emailVerifiedAt ? (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Ja</Badge>
        ) : (
          <Badge variant="outline">Nei</Badge>
        ),
    },
    {
      key: '_count.reservations',
      label: 'Reservasjoner',
      sortable: true,
      render: (user) => user._count.reservations,
    },
    {
      key: 'actions',
      label: 'Handlinger',
      render: (user) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
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
          <h2 className="text-2xl font-bold">Brukere</h2>
          <p className="text-sm text-muted-foreground">Administrer alle brukere i systemet</p>
        </div>
        <Button onClick={() => {
          setSelectedUser(null)
          setFormOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Opprett bruker
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={users}
            columns={columns}
            searchKey="email"
            searchPlaceholder="Søk etter e-post, navn eller telefon..."
            loading={loading}
          />
        </CardContent>
      </Card>

      <UserForm
        user={selectedUser}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          fetchUsers()
          setSelectedUser(null)
        }}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekreft sletting</DialogTitle>
            <DialogDescription>
              Er du sikker på at du vil slette brukeren {userToDelete?.email}? Denne handlingen kan ikke angres.
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

