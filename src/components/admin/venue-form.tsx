'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

const venueSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd').max(200),
  label: z.string().min(1, 'Label er påkrevd').max(200),
  address: z.string().max(500).optional().or(z.literal('')),
  city: z.string().min(1, 'By er påkrevd').max(100),
  country: z.string().max(100).optional().or(z.literal('')),
  mapQuery: z.string().min(1, 'Map query er påkrevd'),
  googleMapsUrl: z.string().url('Ugyldig URL'),
  openStreetMapUrl: z.string().url('Ugyldig URL'),
})

type VenueFormValues = z.infer<typeof venueSchema>

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
}

type VenueFormProps = {
  venue?: Venue | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function VenueForm({ venue, open, onOpenChange, onSuccess }: VenueFormProps) {
  const [loading, setLoading] = React.useState(false)
  const isEdit = !!venue

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: venue?.name || '',
      label: venue?.label || '',
      address: venue?.address || '',
      city: venue?.city || '',
      country: venue?.country || 'Norway',
      mapQuery: venue?.mapQuery || '',
      googleMapsUrl: venue?.googleMapsUrl || '',
      openStreetMapUrl: venue?.openStreetMapUrl || '',
    },
  })

  React.useEffect(() => {
    if (venue) {
      form.reset({
        name: venue.name,
        label: venue.label,
        address: venue.address || '',
        city: venue.city,
        country: venue.country || 'Norway',
        mapQuery: venue.mapQuery,
        googleMapsUrl: venue.googleMapsUrl,
        openStreetMapUrl: venue.openStreetMapUrl,
      })
    } else {
      form.reset({
        name: '',
        label: '',
        address: '',
        city: '',
        country: 'Norway',
        mapQuery: '',
        googleMapsUrl: '',
        openStreetMapUrl: '',
      })
    }
  }, [venue, form])

  const onSubmit = async (data: VenueFormValues) => {
    setLoading(true)
    try {
      const payload: any = {
        ...data,
        address: data.address || null,
        country: data.country || 'Norway',
      }

      if (isEdit) {
        const res = await fetch('/api/admin/venues', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: venue!.id, ...payload }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Kunne ikke oppdatere lokasjon')
        }
        toast.success('Lokasjon oppdatert')
      } else {
        const res = await fetch('/api/admin/venues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Kunne ikke opprette lokasjon')
        }
        toast.success('Lokasjon opprettet')
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
          <DialogTitle>{isEdit ? 'Rediger lokasjon' : 'Opprett lokasjon'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" id="venue-form">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Navn *</label>
              <Input {...form.register('name')} placeholder="Hamar kulturhus" required />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Label *</label>
              <Input {...form.register('label')} placeholder="Hamar kulturhus" required />
              {form.formState.errors.label && (
                <p className="text-xs text-destructive">{form.formState.errors.label.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Adresse</label>
            <Input {...form.register('address')} placeholder="Storgata 1" />
            {form.formState.errors.address && (
              <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">By *</label>
              <Input {...form.register('city')} placeholder="Hamar" required />
              {form.formState.errors.city && (
                <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Land</label>
              <Input {...form.register('country')} placeholder="Norway" />
              {form.formState.errors.country && (
                <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Map Query *</label>
            <Input {...form.register('mapQuery')} placeholder="Hamar kulturhus, Hamar" required />
            {form.formState.errors.mapQuery && (
              <p className="text-xs text-destructive">{form.formState.errors.mapQuery.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Maps URL *</label>
            <Input {...form.register('googleMapsUrl')} type="url" placeholder="https://maps.google.com/..." required />
            {form.formState.errors.googleMapsUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.googleMapsUrl.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenStreetMap URL *</label>
            <Input {...form.register('openStreetMapUrl')} type="url" placeholder="https://www.openstreetmap.org/..." required />
            {form.formState.errors.openStreetMapUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.openStreetMapUrl.message}</p>
            )}
          </div>
          </form>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6 pt-4 shrink-0 border-t border-border/50">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button type="submit" disabled={loading} onClick={form.handleSubmit(onSubmit)} form="venue-form">
            {loading ? 'Lagrer...' : isEdit ? 'Oppdater' : 'Opprett'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

