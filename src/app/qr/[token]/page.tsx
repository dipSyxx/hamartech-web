'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

import { BackgroundGlows } from '@/components/shared/background-glows'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations/presets'

export default function TicketPage() {
  const params = useParams<{ token?: string | string[] }>()
  const token = React.useMemo(() => {
    const value = params?.token
    return Array.isArray(value) ? value[0] : value ?? ''
  }, [params])

  const [imgLoaded, setImgLoaded] = React.useState(false)
  const [imgError, setImgError] = React.useState<string | null>(null)

  const qrUrl = React.useMemo(() => {
    if (!token) return ''
    return `/api/qr?token=${encodeURIComponent(token)}&size=320`
  }, [token])

  if (!token) {
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">Ugyldig billettlenke.</p>
          <Button asChild variant="outline" size="sm" className="border-border/70">
            <Link href="/">Gå til forsiden</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <BackgroundGlows />

      <motion.section
        className="border-b border-border bg-background"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-md px-4 py-10 md:py-14 md:px-8">
          <motion.div variants={fadeIn(0)} className="mb-6 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">QR-billett</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Din billett</h1>
            <p className="mt-2 text-sm text-muted-foreground">Vis QR-koden ved innsjekk.</p>
          </motion.div>

          <motion.div variants={fadeInUp(0.06)}>
            <Card className="border-border/70 bg-background/75 shadow-[0_16px_45px_rgba(0,0,0,0.65)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">QR-kode</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div className="relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background/80">
                  {!imgLoaded && !imgError && <Spinner className="h-8 w-8 text-primary" />}
                  <img
                    src={qrUrl}
                    alt="QR billett"
                    className="h-full w-full object-contain"
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError('Kunne ikke laste QR-koden.')}
                    style={{ display: imgError ? 'none' : 'block' }}
                  />
                  {imgError && <p className="px-6 text-center text-sm text-muted-foreground">{imgError}</p>}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Du kan også åpne dine reservasjoner i Min side.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <Button asChild size="sm" className="text-xs border-0">
                    <Link href="/min-side">Gå til Min side</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="border-border/70 text-xs">
                    <Link href="/program">Se program</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
