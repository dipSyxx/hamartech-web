import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/NoBgOnlyLogoSmall.png"
            alt="HamarTech"
            width={48}
            height={48}
          />
        </div>

        {/* Навігація */}
        <nav className="hidden items-center gap-2 text-muted-foreground md:flex">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-[9px] tracking-[0.08em] md:text-[11px]"
          >
            <Link href="#program">Program</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-[9px] tracking-[0.08em] md:text-[11px]"
          >
            <Link href="#tracks">Spor</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-[9px] tracking-[0.08em] md:text-[11px]"
          >
            <Link href="#about">Om HamarTech</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-[9px] tracking-[0.08em] md:text-[11px]"
          >
            <Link href="#info">Praktisk info</Link>
          </Button>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden border-border px-3 py-1.5 text-[9px] font-medium text-muted-foreground hover:border-ring hover:text-foreground md:inline-flex md:text-[10px]"
          >
            Logg inn
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-[linear-gradient(90deg,#22E4FF,#5B5BFF,#F044FF)] px-4 py-1.5 text-[9px] font-semibold text-background shadow-md hover:brightness-110 md:px-5 md:py-2 md:text-[10px]"
          >
            Se program
          </Button>
        </div>
      </div>
    </header>
  );
}
