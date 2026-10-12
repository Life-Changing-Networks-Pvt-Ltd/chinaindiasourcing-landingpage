import type { Metadata } from "next";
import { countryAlternates } from "@/lib/seo";
import { routePath, siteOrigin } from "@/url";
import "./globals.css";

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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
