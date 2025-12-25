import { AdminNav } from '@/components/admin/admin-nav'
import { Card } from '@/components/ui/card'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Administrer brukere, arrangementer og reservasjoner</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside>
            <Card className="p-4">
              <AdminNav />
            </Card>
          </aside>
          <main className="min-w-0 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  )
}

