"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const INTRO_VERSION = "v2";
const STORAGE_KEY = `ht_intro_seen_${INTRO_VERSION}`;

type IntroGateProps = {
  children: React.ReactNode;
  minDurationMs?: number;
  logoSrc?: string;
  logoAlt?: string;
  logoSizePx?: number;
  showSkip?: boolean;
};

export function IntroGate({
  children,
  minDurationMs = 900,
  logoSrc = "/NoBgOnlyLogoSmall.PNG",
  logoAlt = "HamarTech",
  logoSizePx = 180,
  showSkip = true,
}: IntroGateProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen) return;

      localStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);

      const started = performance.now();
      const t = window.setTimeout(() => {
        const elapsed = performance.now() - started;
        const remaining = Math.max(0, minDurationMs - elapsed);
        window.setTimeout(() => setOpen(false), remaining);
      }, 60);

      return () => window.clearTimeout(t);
    } catch {}
  }, [minDurationMs]);

  return (
    <>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] grid place-items-center overflow-hidden"
            role="status"
            aria-live="polite"
            aria-busy="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            {/* Переливаючий background (layers) */}
            <div className="absolute inset-0 bg-background" />

            {/* Layer 1: conic wash (rotating) */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-[70%] opacity-70 blur-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(34,228,255,.85), rgba(91,91,255,.85), rgba(240,68,255,.85), rgba(34,228,255,.85))",
              }}
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 5, repeat: Infinity, ease: "linear" }
              }
            />

            {/* Layer 2: soft moving blobs */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(800px 420px at 20% 25%, rgba(34,228,255,.32), transparent 60%)," +
                  "radial-gradient(760px 420px at 80% 30%, rgba(240,68,255,.26), transparent 62%)," +
                  "radial-gradient(820px 520px at 55% 78%, rgba(91,91,255,.24), transparent 65%)",
              }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      backgroundPosition: [
                        "0% 0%, 0% 0%, 0% 0%",
                        "8% 10%, -6% 6%, 4% -8%",
                        "0% 0%, 0% 0%, 0% 0%",
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
              }
            />

            {/* Layer 3: vignette + tint */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(1200px 700px at 50% 45%, rgba(0,0,0,.10), rgba(0,0,0,.72))",
              }}
            />

            {/* Optional: skip */}
            {showSkip && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  "absolute right-4 top-4 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur",
                  "transition hover:bg-background/60 hover:text-foreground"
                )}
              >
                Skip
              </button>
            )}

            {/* Center logo */}
            <motion.div
              className="relative grid place-items-center"
              initial={reduceMotion ? undefined : { scale: 0.96, opacity: 0 }}
              animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
              exit={reduceMotion ? undefined : { scale: 0.98, opacity: 0 }}
              transition={
                reduceMotion
                  ? undefined
                  : { type: "spring", stiffness: 220, damping: 18 }
              }
            >
              {/* Animated halo behind logo */}
              <motion.div
                aria-hidden
                className="absolute rounded-full blur-2xl"
                style={{
                  width: logoSizePx * 1.75,
                  height: logoSizePx * 1.75,
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(34,228,255,.35), transparent 55%)," +
                    "radial-gradient(circle at 70% 35%, rgba(240,68,255,.30), transparent 60%)," +
                    "radial-gradient(circle at 55% 75%, rgba(91,91,255,.28), transparent 60%)",
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.06, 1], opacity: [0.7, 0.95, 0.7] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                }
              />

              <div
                className="relative"
                style={{ width: logoSizePx, height: logoSizePx }}
              >
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  fill
                  priority
                  sizes={`${logoSizePx}px`}
                  className={cn(
                    "object-contain",
                    "drop-shadow-[0_28px_90px_rgba(0,0,0,0.65)]"
                  )}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
