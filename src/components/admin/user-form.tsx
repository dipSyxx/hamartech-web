'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

const userSchema = z.object({
  name: z.string().min(2, 'Navn må ha minst 2 tegn').max(80).optional().or(z.literal('')),
  phone: z.string().trim().min(4, 'Telefonnummer er for kort').max(30),
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(8, 'Passord må ha minst 8 tegn').max(128).optional().or(z.literal('')),
  role: z.enum(['USER', 'ADMIN', 'APPROVER']),
  emailVerified: z.boolean(),
})

type UserFormValues = z.infer<typeof userSchema>

type User = {
  id: string
  email: string
  name: string | null
  phone: string
  role: string
  emailVerifiedAt: string | null
}

type UserFormProps = {
  user?: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserForm({ user, open, onOpenChange, onSuccess }: UserFormProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!user

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      password: '',
      role: (user?.role as 'USER' | 'ADMIN' | 'APPROVER') || 'USER',
      emailVerified: !!user?.emailVerifiedAt,
    },
  })

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        phone: user.phone,
        email: user.email,
        password: '',
        role: (user.role as 'USER' | 'ADMIN' | 'APPROVER') || 'USER',
        emailVerified: !!user.emailVerifiedAt,
      })
    } else {
      form.reset({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'USER',
        emailVerified: false,
      })
    }
  }, [user, form])

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true)
    try {
      const payload: any = {
        name: data.name || undefined,
        phone: data.phone,
        email: data.email,
        role: data.role,
        emailVerified: data.emailVerified,
      }

      if (isEdit) {
        if (data.password) {
          payload.password = data.password
        }
        const res = await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user!.id, ...payload }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Kunne ikke oppdatere bruker')
        }
        toast.success('Bruker oppdatert')
      } else {
        if (!data.password) {
          throw new Error('Passord er påkrevd for nye brukere')
        }
        payload.password = data.password
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Kunne ikke opprette bruker')
        }
        toast.success('Bruker opprettet')
      }
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'En feil oppstod')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Rediger bruker' : 'Opprett bruker'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="user-form">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Navn</label>
                <Input {...form.register('name')} placeholder="Navn" />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <Input {...form.register('phone')} placeholder="Telefonnummer" required />
                {form.formState.errors.phone && (
                  <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-post</label>
              <Input {...form.register('email')} type="email" placeholder="E-post" required />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Passord {isEdit && '(la stå tomt for å beholde nåværende)'}</label>
              <Input
                {...form.register('password')}
                type="password"
                placeholder={isEdit ? 'Nytt passord (valgfritt)' : 'Passord'}
                required={!isEdit}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rolle</label>
                <Select
                  value={form.watch('role')}
                  onValueChange={(value) => form.setValue('role', value as 'USER' | 'ADMIN' | 'APPROVER')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="APPROVER">APPROVER</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-post verifisert</label>
                <Select
                  value={form.watch('emailVerified') ? 'true' : 'false'}
                  onValueChange={(value) => form.setValue('emailVerified', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Ja</SelectItem>
                    <SelectItem value="false">Nei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6 pt-4 shrink-0 border-t border-border/50">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button type="submit" disabled={loading} onClick={form.handleSubmit(onSubmit)} form="user-form">
            {loading ? 'Lagrer...' : isEdit ? 'Oppdater' : 'Opprett'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
