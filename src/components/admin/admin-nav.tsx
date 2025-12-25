'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  FileText,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Brukere', icon: Users },
  { href: '/admin/events', label: 'Arrangementer', icon: Calendar },
  { href: '/admin/venues', label: 'Lokasjoner', icon: MapPin },
  { href: '/admin/reservations', label: 'Reservasjoner', icon: Ticket },
  { href: '/admin/check-ins', label: 'Check-ins', icon: CheckCircle2 },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
              'border border-transparent',
              isActive
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'text-muted-foreground hover:bg-secondary/20 hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

