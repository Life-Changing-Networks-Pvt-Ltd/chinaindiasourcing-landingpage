"use client";

import { Suspense } from "react";
import {
  BadgeCheck,
  ClipboardList,
  CreditCard,
  HandCoins,
  MessageSquareText,
  PackageSearch,
  Search,
  ShieldCheck,
  Store,
  Undo2,
} from "lucide-react";
import Link from "next/link";

import { InquiryCarousel } from "@/components/inquiry-carousel";
import { ServiceSearch } from "@/components/service-search";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CountryTypewriter } from "@/components/ui/country-typewriter";
import { World, type GlobePosition } from "@/components/ui/globe-client";
import { Separator } from "@/components/ui/separator";
import { sourceCountries } from "@/lib/services";
import { routePath } from "@/url";

const trustPoints = [
  { icon: BadgeCheck, title: "Country-specific discovery", description: "Find independent agents and providers based in the country you want to source from.", tone: "bg-blue-100/70 dark:bg-blue-950/30" },
  { icon: ShieldCheck, title: "Safer introductions", description: "Review profiles, define checkpoints, and keep eligible payments in the platform flow.", tone: "bg-cyan-100/70 dark:bg-cyan-950/30" },
  { icon: HandCoins, title: "Comparable quotations", description: "Request offers against the same product brief before selecting a partner.", tone: "bg-indigo-100/70 dark:bg-indigo-950/30" },
  { icon: Undo2, title: "Buyer support", description: "Use one platform to organize introductions, discussions, and sourcing milestones.", tone: "bg-sky-100/70 dark:bg-sky-950/30" },
];

const steps = [
  { number: "01", icon: ClipboardList, title: "Post your requirement", description: "Add the product, quantity, specifications, target price, and delivery destination.", tone: "bg-blue-100/60 dark:bg-blue-950/30" },
  { number: "02", icon: PackageSearch, title: "Meet relevant partners", description: "The platform connects you with independent agents and providers in your chosen sourcing country.", tone: "bg-sky-100/60 dark:bg-sky-950/30" },
  { number: "03", icon: MessageSquareText, title: "Compare agents and offers", description: "Review experience, scope, samples, quotations, production terms, and timelines.", tone: "bg-cyan-100/60 dark:bg-cyan-950/30" },
  { number: "04", icon: CreditCard, title: "Select your partner", description: "Agree the scope with your chosen provider and use the platform flow for eligible safeguards.", tone: "bg-indigo-100/60 dark:bg-indigo-950/30" },
];

const sourcingCountries = sourceCountries.map(({ name, flagCode }) => ({
  text: name,
  flagCode,
  className: "text-foreground",
}));

const globeData: GlobePosition[] = [
  { order: 1, startLat: 31.2304, startLng: 121.4737, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: "#bfdbfe" },
  { order: 2, startLat: 19.076, startLng: 72.8777, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.32, color: "#dbeafe" },
  { order: 3, startLat: 21.0285, startLng: 105.8542, endLat: 41.8781, endLng: -87.6298, arcAlt: 0.3, color: "#bfdbfe" },
  { order: 4, startLat: 25.033, startLng: 121.5654, endLat: 29.7604, endLng: -95.3698, arcAlt: 0.34, color: "#dbeafe" },
  { order: 5, startLat: 19.4326, startLng: -99.1332, endLat: 32.7767, endLng: -96.797, arcAlt: 0.16, color: "#bfdbfe" },
  { order: 6, startLat: 23.8103, startLng: 90.4125, endLat: 47.6062, endLng: -122.3321, arcAlt: 0.36, color: "#dbeafe" },
];

const globeConfig = {
  globeColor: "#1d4ed8",
  polygonColor: "rgba(219,234,254,0.88)",
  atmosphereColor: "#60a5fa",
  atmosphereAltitude: 0.08,
  emissive: "#172554",
  emissiveIntensity: 0.18,
  showAtmosphere: true,
  autoRotate: true,
  autoRotateSpeed: 0.65,
  initialPosition: { lat: 20, lng: 78 },
};

type SourcePageIntroProps = {
  title?: string;
  showHomepageSections?: boolean;
};

export function SourcePageIntro({ title, showHomepageSections }: SourcePageIntroProps) {
  const includeHomepageSections = showHomepageSections ?? !title;

  return (
    <>
      <link rel="preload" href="/globe.json" as="fetch" crossOrigin="anonymous" />
      <SiteHeader />

      <section id="top" className="relative -mt-16 overflow-hidden scroll-mt-24 hero-ambient-flow pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="animate-float-slow absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-reverse absolute -right-20 top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-drift absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-600/15 sm:h-80 sm:w-80" />
          <div className="animate-float-slow absolute right-1/4 bottom-16 h-64 w-64 rounded-full bg-rose-200/25 blur-3xl dark:bg-rose-600/10 sm:h-72 sm:w-72" />
        </div>

        <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 pt-4 text-center sm:px-6">

          <h1 className="mt-5 flex max-w-5xl flex-col items-center text-balance text-4xl font-semibold tracking-tight sm:block sm:text-6xl lg:text-7xl">
            {title ? (
              title
            ) : (
              <>
                <span>Sourcing for</span>{" "}
                <CountryTypewriter items={sourcingCountries} className="min-w-[8ch] justify-center px-0 text-foreground sm:justify-start" typingSpeed={40} deletingSpeed={22} pauseDuration={480} />
              </>
            )}
          </h1>

          

          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              className="h-14 rounded-xl bg-gradient-to-r from-black via-zinc-900 to-neutral-700 px-8 text-base font-semibold text-white shadow-lg shadow-black/20 hover:from-neutral-900 hover:via-black hover:to-zinc-800 sm:min-w-52 sm:text-lg"
              asChild
            >
              <Link href={routePath.buyers}>I&apos;m a Buyer<Search aria-hidden="true" /></Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-xl border-neutral-800 bg-gradient-to-r from-white via-zinc-50 to-neutral-200 px-8 text-base font-semibold text-neutral-950 shadow-md shadow-black/10 hover:from-neutral-100 hover:via-white hover:to-zinc-200 sm:min-w-52 sm:text-lg"
              asChild
            >
              <Link href={routePath.sellers}>I&apos;m a Seller<Store aria-hidden="true" /></Link>
            </Button>
          </div>

          <div className="relative z-30 mt-4 w-full max-w-xl">
            <ServiceSearch />
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-2 h-72 max-w-7xl overflow-hidden sm:mt-3 sm:h-80" aria-label="Interactive rotating globe showing worldwide trade">
          <Suspense fallback={<div className="h-full w-full" />}>
            <World
              className="absolute left-1/2 -top-16 h-[40rem] w-[40rem] -translate-x-1/2 sm:-top-20 sm:h-[44rem] sm:w-[44rem]"
              data={globeData}
              globeConfig={globeConfig}
            />
          </Suspense>
        </div>
        <Separator />
      </section>

      {includeHomepageSections && <>
      <section className="bg-sky-50/25 py-6 dark:bg-sky-950/5 sm:py-8" aria-label="Platform assurances">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustPoints.map((point) => (
            <Card key={point.title} className={`gap-4 border-border/40 py-5 shadow-none ${point.tone}`}>
              <CardContent className="flex gap-3 px-5">
                <point.icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <div><h2 className="font-medium">{point.title}</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">{point.description}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="how" className="scroll-mt-20 border-y border-border/50 bg-blue-50/35 py-10 dark:bg-blue-950/10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><Badge variant="outline">How the platform works</Badge><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">From U.S. buying requirement to sourcing partner</h2><p className="mt-4 text-base leading-7 text-muted-foreground">We facilitate discovery and introductions; the buyer chooses and contracts with the independent provider.</p></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.number} className={`h-full border-border/40 shadow-none ${step.tone}`}><CardHeader><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-md bg-white/60 dark:bg-black/10"><step.icon className="size-5" aria-hidden="true" /></span><Badge variant="secondary">{step.number}</Badge></div><CardTitle className="mt-3">{step.title}</CardTitle><CardDescription className="leading-6">{step.description}</CardDescription></CardHeader></Card>
            ))}
          </div>
        </div>
      </section>

      <section id="requests" className="scroll-mt-20 border-b border-border/50 bg-background py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Badge variant="outline">Live buyer requirements</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Explore active sourcing enquiries</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">Browse recent buyer requests and open a card to review the complete sourcing requirement.</p>
            </div>
            <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm">Live requests</Badge>
          </div>
          <InquiryCarousel />
        </div>
      </section>
      </>}
    </>
  );
}
