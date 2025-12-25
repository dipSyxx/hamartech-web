'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCards } from '@/components/admin/stats-cards'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Users, Calendar, Ticket } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type Stats = {
  users: {
    total: number
    byRole: Record<string, number>
    verified: number
    unverified: number
  }
  events: {
    total: number
    byTrack: Record<string, number>
    byDay: Record<string, number>
  }
  venues: {
    total: number
    byCity: Record<string, number>
  }
  reservations: {
    total: number
    byStatus: Record<string, number>
    withCheckIn: number
    withoutCheckIn: number
  }
  checkIns: {
    total: number
    lastWeek: number
  }
  auditLogs: {
    recent: Array<{
      id: string
      action: string
      entityType: string
      entityId: string
      createdAt: string
      actor?: {
        id: string
        name: string | null
        email: string
      } | null
    }>
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<Stats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) {
          throw new Error('Kunne ikke hente statistikk')
        }
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-destructive">{error || 'Kunne ikke laste statistikk'}</p>
        </CardContent>
      </Card>
    )
  }

  const actionLabels: Record<string, string> = {
    EVENT_CREATE: 'Opprettet arrangement',
    EVENT_UPDATE: 'Oppdatert arrangement',
    EVENT_DELETE: 'Slettet arrangement',
    VENUE_CREATE: 'Opprettet lokasjon',
    VENUE_UPDATE: 'Oppdatert lokasjon',
    VENUE_DELETE: 'Slettet lokasjon',
    RESERVATION_APPROVE: 'Godkjent reservasjon',
    RESERVATION_REJECT: 'Avvist reservasjon',
    RESERVATION_CANCEL: 'Kansellert reservasjon',
    USER_ROLE_CHANGE: 'Endret brukerrolle',
  }

  return (
    <div className="space-y-6">
      <StatsCards
        users={stats.users}
        events={stats.events}
        venues={stats.venues}
        reservations={stats.reservations}
        checkIns={stats.checkIns}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Brukerstatistikk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Totalt:</span>
                <span className="font-medium">{stats.users.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Verifisert:</span>
                <span className="font-medium">{stats.users.verified}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ikke verifisert:</span>
                <span className="font-medium">{stats.users.unverified}</span>
              </div>
            </div>
            <div className="border-t border-border/50 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Etter rolle</p>
              <div className="space-y-1">
                {Object.entries(stats.users.byRole).map(([role, count]) => (
                  <div key={role} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{role}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/users">
                Se alle brukere <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Reservation Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Reservasjonsstatistikk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Totalt:</span>
                <span className="font-medium">{stats.reservations.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Med check-in:</span>
                <span className="font-medium text-emerald-400">{stats.reservations.withCheckIn}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uten check-in:</span>
                <span className="font-medium text-amber-400">{stats.reservations.withoutCheckIn}</span>
              </div>
            </div>
            <div className="border-t border-border/50 pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Etter status</p>
              <div className="space-y-1">
                {Object.entries(stats.reservations.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{status}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/reservations">
                Se alle reservasjoner <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Nylig aktivitet</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.auditLogs.recent.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tid</TableHead>
                  <TableHead>Handling</TableHead>
                  <TableHead>Entitet</TableHead>
                  <TableHead>Utført av</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.auditLogs.recent.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.createdAt).toLocaleString('no-NO', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{actionLabels[log.action] || log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.entityType} ({log.entityId.slice(0, 8)}...)
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.actor ? log.actor.name || log.actor.email : 'System'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">Ingen nylig aktivitet</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hurtighandlinger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/admin/users">
                <Users className="mb-2 h-6 w-6" />
                <span className="font-medium">Brukere</span>
                <span className="mt-1 text-xs text-muted-foreground">Administrer brukere</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/admin/events">
                <Calendar className="mb-2 h-6 w-6" />
                <span className="font-medium">Arrangementer</span>
                <span className="mt-1 text-xs text-muted-foreground">Administrer arrangementer</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link href="/admin/reservations">
                <Ticket className="mb-2 h-6 w-6" />
                <span className="font-medium">Reservasjoner</span>
                <span className="mt-1 text-xs text-muted-foreground">Administrer reservasjoner</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

