import type { ReactNode } from "react";
import { BackgroundGlows } from "@/components/shared/background-glows";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-background">
        <BackgroundGlows />
        <section className="relative flex min-h-screen items-center">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 md:px-8 md:py-16">
            {children}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
