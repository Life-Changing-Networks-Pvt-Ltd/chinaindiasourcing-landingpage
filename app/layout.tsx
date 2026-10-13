import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { countryAlternates } from "@/lib/seo";
import { routePath, siteOrigin } from "@/url";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "ChinaIndiaSourcing | Find Global Sourcing Agents for U.S. Buyers",
  description:
    "A U.S.-focused directory and marketplace that connects buyers with independent sourcing agents, suppliers, inspectors, and logistics providers in China, India, and other sourcing countries.",
  alternates: countryAlternates(
    routePath.home,
    (market) => routePath.market(market.slug),
  ),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/logo-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${manrope.variable} ${bebasNeue.variable} antialiased`}>{children}</body>
    </html>
  );
}
