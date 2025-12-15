import type { ReactNode } from "react";
import { BackgroundGlows } from "@/components/shared/background-glows";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <BackgroundGlows />

      <section className="border-b border-border bg-background">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-4 py-10 md:px-8 md:py-16">
          {children}
        </div>
      </section>
    </div>
  );
}
