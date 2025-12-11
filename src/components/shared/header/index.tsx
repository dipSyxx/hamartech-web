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
            className="h-auto px-2 md:px-3"
          >
            <Link href="#program">Program</Link>
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
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Logg inn
          </Button>
          <Button
            size="sm"
            // variant="default" вже за замовчуванням → градієнт з button.tsx
            className="px-4 md:px-5"
          >
            Se program
          </Button>
        </div>
      </div>
    </header>
  );
}
