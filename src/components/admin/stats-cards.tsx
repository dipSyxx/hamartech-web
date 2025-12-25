'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, MapPin, Ticket, CheckCircle2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatsCardsProps = {
  users: { total: number; verified: number; unverified: number }
  events: { total: number }
  venues: { total: number }
  reservations: { total: number; withCheckIn: number; withoutCheckIn: number }
  checkIns: { total: number; lastWeek: number }
}

export function StatsCards({ users, events, venues, reservations, checkIns }: StatsCardsProps) {
  const checkInRate =
    reservations.total > 0
      ? ((reservations.withCheckIn / reservations.total) * 100).toFixed(1)
      : '0'

  const stats = [
    {
      label: 'Totale brukere',
      value: users.total,
      icon: Users,
      description: `${users.verified} verifisert, ${users.unverified} ikke verifisert`,
      color: 'text-blue-400',
    },
    {
      label: 'Arrangementer',
      value: events.total,
      icon: Calendar,
      description: 'Totalt antall arrangementer',
      color: 'text-purple-400',
    },
    {
      label: 'Lokasjoner',
      value: venues.total,
      icon: MapPin,
      description: 'Totalt antall lokasjoner',
      color: 'text-green-400',
    },
    {
      label: 'Reservasjoner',
      value: reservations.total,
      icon: Ticket,
      description: `${reservations.withCheckIn} med check-in, ${reservations.withoutCheckIn} uten`,
      color: 'text-orange-400',
    },
    {
      label: 'Check-ins',
      value: checkIns.total,
      icon: CheckCircle2,
      description: `${checkIns.lastWeek} siste uke`,
      color: 'text-emerald-400',
    },
    {
      label: 'Check-in rate',
      value: `${checkInRate}%`,
      icon: TrendingUp,
      description: 'Prosent med check-in',
      color: 'text-cyan-400',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className={cn('h-5 w-5', stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

