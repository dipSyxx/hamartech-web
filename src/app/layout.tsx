import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

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
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
