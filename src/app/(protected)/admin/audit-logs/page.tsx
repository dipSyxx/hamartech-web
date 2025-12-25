'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type AuditLog = {
  id: string
  action: string
  entityType: string
  entityId: string
  meta: any
  createdAt: string
  actor: {
    id: string
    email: string
    name: string | null
  } | null
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchAuditLogs = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit-logs?limit=500')
      if (!res.ok) {
        throw new Error('Kunne ikke hente audit logs')
      }
      const data = await res.json()
      setAuditLogs(data.auditLogs)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kunne ikke laste audit logs')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAuditLogs()
  }, [fetchAuditLogs])

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

  const columns: Column<AuditLog>[] = [
    {
      key: 'createdAt',
      label: 'Tid',
      sortable: true,
      render: (log) =>
        new Date(log.createdAt).toLocaleString('no-NO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
    },
    {
      key: 'action',
      label: 'Handling',
      sortable: true,
      filterable: true,
      filterOptions: Object.keys(actionLabels).map((key) => ({
        label: actionLabels[key],
        value: key,
      })),
      render: (log) => (
        <Badge variant="outline">{actionLabels[log.action] || log.action}</Badge>
      ),
    },
    {
      key: 'entityType',
      label: 'Entitet',
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: 'User', value: 'User' },
        { label: 'Event', value: 'Event' },
        { label: 'Venue', value: 'Venue' },
        { label: 'Reservation', value: 'Reservation' },
      ],
    },
    {
      key: 'entityId',
      label: 'Entitet ID',
      sortable: true,
      render: (log) => <span className="font-mono text-xs">{log.entityId.slice(0, 8)}...</span>,
    },
    {
      key: 'actor.email',
      label: 'Utført av',
      sortable: true,
      render: (log) =>
        log.actor ? (
          <div>
            <div className="font-medium">{log.actor.name || log.actor.email}</div>
            <div className="text-xs text-muted-foreground">{log.actor.email}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">System</span>
        ),
    },
    {
      key: 'meta',
      label: 'Detaljer',
      render: (log) =>
        log.meta ? (
          <details className="cursor-pointer">
            <summary className="text-xs text-muted-foreground">Vis detaljer</summary>
            <pre className="mt-2 max-w-md overflow-auto rounded bg-secondary/20 p-2 text-xs">
              {JSON.stringify(log.meta, null, 2)}
            </pre>
          </details>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <p className="text-sm text-muted-foreground">Oversikt over alle administrative handlinger i systemet</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={auditLogs}
            columns={columns}
            searchKey="entityId"
            searchPlaceholder="Søk etter entitet ID..."
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}

