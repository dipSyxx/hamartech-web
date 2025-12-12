"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
      delay: 0.1,
    },
  },
};

export function Footer() {
  return (
    <motion.footer
      className="border-t border-border bg-background/95"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8 md:text-sm">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/NoBgOnlyLogoSmall.PNG"
              alt="HamarTech"
              width={40}
              height={40}
            />
            <p className="text-lg font-semibold tracking-wide text-foreground md:text-xl">
              HamarTech
            </p>
          </div>
          <p>En uke for teknologi og kreativitet i Hamar-regionen.</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
          <Button
            asChild
            variant="link"
            size="sm"
            className="px-1 py-0 text-muted-foreground hover:text-foreground"
          >
            <Link href="#program">Program</Link>
          </Button>
          <Button
            asChild
            variant="link"
            size="sm"
            className="px-1 py-0 text-muted-foreground hover:text-foreground"
          >
            <Link href="#about">Om HamarTech</Link>
          </Button>
          <Button
            asChild
            variant="link"
            size="sm"
            className="px-1 py-0 text-muted-foreground hover:text-foreground"
          >
            <Link href="#info">Personvern &amp; cookies</Link>
          </Button>
        </motion.div>
      </div>
    </motion.footer>
  );
}
