import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { IntroGate } from "@/components/shared/intro-gate";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HamarTech – uke for teknologi og kreativitet",
  description:
    "Digital festivalhub for HamarTech – en uke med teknologi, spill, XR og kreative uttrykk i Hamar-regionen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`
          ${sans.variable}
          ${mono.variable}
          font-sans
          antialiased
        `}
      >
        <IntroGate
          logoSrc="/NoBgOnlyLogoSmall.PNG"
          minDurationMs={3000}
          showSkip={false}
        >
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </IntroGate>
      </body>
    </html>
  );
}
