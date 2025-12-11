import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-[9px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8 md:text-[10px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-end">
            <Image
              src="/NoBgOnlyLogoSmall.png"
              alt="HamarTech"
              width={48}
              height={48}
            />
            <p className="font-pixel text-[30px] leading-none tracking-[0.16em] text-foreground">
              AMARTECH
            </p>
          </div>
          <p>En uke for teknologi og kreativitet i Hamar-regionen.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="link"
            className="px-1 py-0 text-[9px] md:text-[10px]"
          >
            <Link href="#program">Program</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="px-1 py-0 text-[9px] md:text-[10px]"
          >
            <Link href="#about">Om HamarTech</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className="px-1 py-0 text-[9px] md:text-[10px]"
          >
            <Link href="#info">Personvern &amp; cookies</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
