"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const navVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      delay: 0.1,
    },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      delay: 0.15,
    },
  },
};

export function Header() {
  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
        >
          <Link href="/">
            <Image
              src="/NoBgOnlyLogoSmall.PNG"
              alt="HamarTech"
              width={48}
              height={48}
            />
          </Link>
        </motion.div>

        {/* Навігація */}
        <motion.nav
          className="hidden items-center gap-2 text-muted-foreground md:flex"
          variants={navVariants}
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 md:px-3"
          >
            <Link href="/program">Program</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 md:px-3"
          >
            <Link href="#tracks">Spor</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 md:px-3"
          >
            <Link href="#about">Om HamarTech</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 md:px-3"
          >
            <Link href="#info">Praktisk info</Link>
          </Button>
        </motion.nav>

        {/* CTA */}
        <motion.div className="flex items-center gap-2" variants={ctaVariants}>
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Logg inn
          </Button>
          <Button size="sm" className="border-0px-4 md:px-5">
            Se program
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
