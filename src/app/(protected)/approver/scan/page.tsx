'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, X, ScanLine } from 'lucide-react'

type ReservationResult = {
  id: string
  status: string
  user?: {
    id: string
    name?: string | null
    email?: string | null
    phone?: string | null
  }
  event?: {
    id: string
    title: string
    venue?: {
      name: string
      label: string
    }
  }
  checkIns?: Array<{ id: string }>
}

export default function ApproverScanPage() {
  const [token, setToken] = React.useState('')
  const [result, setResult] = React.useState<ReservationResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [isScanning, setIsScanning] = React.useState(false)
  const [cameraError, setCameraError] = React.useState<string | null>(null)
  const scannerRef = React.useRef<Html5Qrcode | null>(null)
  const scanContainerRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const stopScanner = React.useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {
        // Ignore errors when stopping
      }
      scannerRef.current = null
    }
    setIsScanning(false)
    setCameraError(null)
  }, [])

  const processToken = React.useCallback(
    async (scannedToken: string) => {
      setToken(scannedToken)
      setLoading(true)
      setError(null)
      setResult(null)
      try {
        const res = await fetch(`/api/approver/scan?token=${encodeURIComponent(scannedToken)}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || 'Ugyldig billett')
        }
        setResult(data.reservation)
        // Stop scanning after successful scan
        if (isScanning) {
          await stopScanner()
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Uventet feil'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [isScanning, stopScanner],
  )

  const handleScan = async () => {
    if (!token.trim()) return
    await processToken(token)
  }

  const startScanner = React.useCallback(async () => {
    try {
      setCameraError(null)
      setError(null)

      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera er ikke tilgjengelig i denne nettleseren')
      }

      // Explicitly request camera permission first (important for mobile)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        // Stop the stream immediately, we just needed permission
        stream.getTracks().forEach((track) => track.stop())
      } catch (permissionErr) {
        const err = permissionErr as Error
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          throw new Error('Kameratilgang ble nektet. Vennligst tillat tilgang i nettleserinnstillingene.')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          throw new Error('Ingen kamera funnet på enheten')
        } else {
          throw new Error(`Kunne ikke få tilgang til kamera: ${err.message}`)
        }
      }

      // Set scanning state first to render the container
      setIsScanning(true)

      // Wait for DOM to update and container to be rendered
      await new Promise((resolve) => {
        // Use requestAnimationFrame to wait for next render cycle
        requestAnimationFrame(() => {
          // Double RAF to ensure DOM is fully updated
          requestAnimationFrame(() => {
            resolve(undefined)
          })
        })
      })

      // Now check if container exists
      if (!scanContainerRef.current) {
        throw new Error('Scan container not found')
      }

      const html5QrCode = new Html5Qrcode(scanContainerRef.current.id)
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          processToken(decodedText)
        },
        () => {
          // Error callback - ignore most errors, they're just "no QR found" messages
          // Only show actual errors
        },
      )
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Kunne ikke starte kamera'
      setCameraError(errorMsg)
      setIsScanning(false)
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop()
          scannerRef.current.clear()
        } catch {
          // Ignore cleanup errors
        }
        scannerRef.current = null
      }
    }
  }, [processToken])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear()
          })
          .catch(() => {
            // Ignore cleanup errors
          })
      }
    }
  }, [])

  const handleCheckIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/approver/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Kunne ikke checke inn')
      }
      router.refresh()
      setResult((prev) => (prev ? { ...prev, checkIns: [data.checkIn] } : null))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Uventet feil'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            QR Billett Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scanner Section */}
          <div className="space-y-3">
            {!isScanning ? (
              <Button onClick={startScanner} disabled={loading} className="w-full border-0" type="button">
                <Camera className="h-4 w-4" />
                Start QR Scanner
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-lg border border-border/70 bg-background/50 p-4">
                  <div id="qr-reader" ref={scanContainerRef} className="w-full" style={{ minHeight: '300px' }} />
                  <Button
                    onClick={stopScanner}
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-2 border-border/70"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                    Stopp
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">Rett kameraet mot QR-koden på billetten</p>
              </div>
            )}

            {cameraError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-xs font-medium text-destructive">{cameraError}</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>• Sørg for at du har gitt tillatelse til å bruke kameraet</p>
                  <p>• Sjekk at nettleseren har tilgang til kamera i innstillingene</p>
                  <p>• På mobil: Sjekk at nettleseren har kamera-tillatelse i telefoninnstillingene</p>
                  {typeof window !== 'undefined' && window.location.protocol !== 'https:' && (
                    <p className="text-amber-400">• Kamera krever HTTPS. Sørg for at du bruker en sikker tilkobling</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">eller</span>
            </div>
          </div>

          {/* Manual Input Section */}
          <div className="space-y-3">
            <Input
              placeholder="Lim inn QR-token manuelt"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && token.trim()) {
                  handleScan()
                }
              }}
            />
            <div className="flex gap-2">
              <Button onClick={handleScan} disabled={!token || loading} className="border-0 flex-1">
                {loading ? 'Sjekker...' : 'Sjekk billett'}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-3 rounded-lg border border-border/70 bg-background/50 p-4">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Bruker:</span>{' '}
                  <span className="text-foreground">{result.user?.name ?? result.user?.email ?? 'Ukjent'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Event:</span>{' '}
                  <span className="text-foreground">{result.event?.title}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>{' '}
                  <span className="text-foreground">{result.status}</span>
                </div>
                {result.checkIns && result.checkIns.length > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground">Allerede sjekket inn:</span>{' '}
                    <span className="text-foreground">Ja</span>
                  </div>
                )}
              </div>

              {result.status === 'CONFIRMED' && !result.checkIns?.length && (
                <Button variant="outline" onClick={handleCheckIn} disabled={loading} className="w-full">
                  {loading ? 'Sjekker inn...' : 'Bekreft check-in'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
