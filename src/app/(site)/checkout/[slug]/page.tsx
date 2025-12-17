"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BackgroundGlows } from "@/components/shared/background-glows";
import { TRACK_META, type TrackId } from "@/lib/data/program-meta";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations/presets";
import { Spinner } from "@/components/ui/spinner";

type ApiVenue = {
  id: string;
  label: string;
  name: string;
  address: string | null;
  city: string | null;
  mapQuery: string | null;
  googleMapsUrl: string | null;
  openStreetMapUrl: string | null;
};

type CheckoutEvent = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  dayLabel: string;
  timeLabel: string;
  venueLabel: string;
  venueInfo: ApiVenue | null;
  trackId: TrackId;
};

const mapApiEvent = (event: any): CheckoutEvent => ({
  id: event.id,
  slug: event.slug,
  title: event.title,
  description: event.description ?? null,
  dayLabel: event.dayLabel ?? event.weekday ?? "",
  timeLabel: event.timeLabel ?? event.time ?? "",
  venueLabel: event.venueLabel ?? event.venue?.label ?? "",
  venueInfo: event.venue ?? null,
  trackId: event.trackId as TrackId,
});

export default function CheckoutPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const slug = React.useMemo(() => {
    const value = params?.slug;
    return Array.isArray(value) ? value[0] : value ?? "";
  }, [params]);

  const router = useRouter();
  const [event, setEvent] = React.useState<CheckoutEvent | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingEvent, setLoadingEvent] = React.useState(true);
  const track = event ? TRACK_META[event.trackId] : null;

  React.useEffect(() => {
    const load = async () => {
      if (!slug) {
        setLoadingEvent(false);
        return;
      }
      try {
        setLoadingEvent(true);
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Fant ikke arrangementet");
        }
        setEvent(mapApiEvent(data.event));
      } catch (err: any) {
        setError(err?.message || "Uventet feil");
      } finally {
        setLoadingEvent(false);
      }
    };
    load();
  }, [slug]);

  if (!event) {
    if (loadingEvent) {
      return (
        <div className="relative overflow-hidden">
          <BackgroundGlows />
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size="md" />
          </div>
        </div>
      );
    }
    return (
      <div className="relative overflow-hidden">
        <BackgroundGlows />
        <section className="border-b border-border bg-background">
          <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-6 px-4 py-16 md:px-8">
            <h1 className="text-3xl font-semibold md:text-4xl">
              Fant ikke arrangementet
            </h1>
            <Button asChild variant="outline" size="sm">
              <Link href="/program">Tilbake til programmet</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: event.slug, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Kunne ikke opprette reservasjon");
      }
      router.push("/min-side");
    } catch (err: any) {
      setError(err?.message || "Uventet feil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <BackgroundGlows />
      <motion.section
        className="border-b border-border bg-background"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-3xl px-4 py-10 md:py-14 md:px-8">
          <motion.div variants={fadeIn(0)} className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Checkout
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              {event.title}
            </h1>
          </motion.div>

          <motion.div variants={fadeInUp(0.05)}>
            <Card className="border-border/80 bg-background/80 shadow-[0_16px_45px_rgba(0,0,0,0.65)]">
              <CardHeader>
                <CardTitle>Oppsummering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Dato</span>
                  <span>{event.dayLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tid</span>
                  <span>{event.timeLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Sted</span>
                  <span>{event.venueLabel}</span>
                </div>
                {track && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Spor</span>
                    <span>{track.label}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Antall
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-24"
                  />

                  {error && <p className="text-xs text-destructive">{error}</p>}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Bestiller..." : "Bekreft"}
                    </Button>
                    <Button variant="ghost" asChild>
                      <Link href={`/program/${event.slug}`}>Avbryt</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
