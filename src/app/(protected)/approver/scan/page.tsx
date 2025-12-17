"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApproverScanPage() {
  const [token, setToken] = React.useState("");
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/approver/scan?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Ugyldig billett");
      }
      setResult(data.reservation);
    } catch (err: any) {
      setError(err?.message || "Uventet feil");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/approver/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Kunne ikke checke inn");
      }
      router.refresh();
      setResult((prev: any) => ({ ...prev, checkIn: data.checkIn }));
    } catch (err: any) {
      setError(err?.message || "Uventet feil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Approver Scan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Lim inn QR-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleScan} disabled={!token || loading}>
              {loading ? "Sjekker..." : "Sjekk billett"}
            </Button>
            {result && (
              <Button variant="outline" onClick={handleCheckIn} disabled={loading}>
                Bekreft check-in
              </Button>
            )}
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          {result && (
            <div className="text-sm text-foreground">
              <p>
                Bruker: {result.user?.name ?? result.user?.email ?? "Ukjent"}
              </p>
              <p>Event: {result.event?.title}</p>
              <p>Status: {result.status}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
