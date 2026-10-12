import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ClipboardList,
  FileCheck2,
  MessagesSquare,
  Search,
  Ship,
} from "lucide-react";

import { InquiryCarousel } from "@/components/inquiry-carousel";
import { PlatformFeatures } from "@/components/platform-features";
import { SiteFooter } from "@/components/site-footer";
import { SourcePageIntro } from "@/components/source-page-intro";
import { TopSellersListing } from "@/components/top-sellers-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import inquiryData from "@/data/inquiries.json";
import type { BuyerMarket } from "@/lib/markets";
import { serviceDisplayName, services, type SourcingService } from "@/lib/services";
import { routePath } from "@/url";

type ChineseFreightForwarderPageProps = {
  market: BuyerMarket;
  service: SourcingService;
};

const freightSteps = [
  {
    icon: ClipboardList,
    title: "Share your shipment details",
    description: "Tell us what you are shipping, the carton size and weight, pickup city in China, delivery address in the United States, and your preferred date.",
  },
  {
    icon: MessagesSquare,
    title: "Meet relevant forwarders",
    description: "Your requirement can be seen by independent freight providers that handle China-to-U.S. shipments and match the service you need.",
  },
  {
    icon: FileCheck2,
    title: "Compare quotes and scope",
    description: "Review the route, transit time, included charges, customs support, insurance options, and final delivery terms before you choose.",
  },
  {
    icon: Ship,
    title: "Choose and coordinate",
    description: "Select a provider, agree the final scope directly, and stay in contact about pickup, documents, departure, arrival, and delivery.",
  },
];

const faqs = [
  {
    question: "What does a Chinese freight forwarder do?",
    answer:
      "A freight forwarder plans and coordinates the movement of your goods. Depending on the agreed service, this may include factory pickup, cargo consolidation, export documents, air or sea freight, customs support, and delivery in the United States.",
  },
  {
    question: "Can I compare more than one freight quote?",
    answer:
      "Yes. Sharing one clear shipment brief makes it easier to compare independent providers. Check that every quote uses the same weight, volume, route, trade term, and delivery scope before comparing the total price.",
  },
  {
    question: "What information should I provide first?",
    answer:
      "Provide the product name, number of cartons, carton dimensions, total weight, cargo value, pickup city, delivery ZIP code, ready date, and any special handling needs. Photos and a packing list are also useful when available.",
  },
  {
    question: "Can a provider arrange both air and sea freight?",
    answer:
      "Many forwarders can quote air, express, sea, or combined options. Available choices depend on the product, shipment size, urgency, origin city, and U.S. destination. Ask for the expected transit time for each option.",
  },
  {
    question: "Are customs duty and final delivery always included?",
    answer:
      "No. Inclusion depends on the quote and trade term. Ask the provider to state clearly whether export handling, customs brokerage, duty, tax, port charges, storage, and door delivery are included or excluded.",
  },
  {
    question: "Is ChinaIndiaSourcing the freight forwarder?",
    answer:
      "No. ChinaIndiaSourcing is a directory and connection platform. We help buyers discover independent providers. The provider you choose is responsible for its quote, contract, shipping work, documents, and agreed service.",
  },
];

export function ChineseFreightForwarderPage({
  market,
  service,
}: ChineseFreightForwarderPageProps) {
  const displayServiceName = serviceDisplayName(service.name);
  const pageTitle = `${displayServiceName} for ${market.name} Buyers`;
  const relatedServices = services
    .filter((item) => item.origin === service.origin && item.slug !== service.slug)
    .slice(0, 6);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      description:
        "A simple guide for U.S. buyers who need an independent freight forwarder to move goods from China to the United States.",
      about: {
        "@type": "Service",
        name: displayServiceName,
        areaServed: { "@type": "Place", name: market.locationName },
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: `${market.name} buyers and importers`,
      },
      publisher: { "@type": "Organization", name: "ChinaIndiaSourcing" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <SourcePageIntro title={pageTitle} />
      <TopSellersListing countryName={service.origin} />

      <section
        id="requests"
        className="scroll-mt-20 border-b border-border/50 bg-slate-50/55 py-10 dark:bg-slate-950/20 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Top Sourcing Buyers in China
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Browse recent buyer requests and open a card to review the complete sourcing requirement.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm">
              {Math.min(12, inquiryData.length)} requests shown
            </Badge>
          </div>
          <InquiryCarousel layout="grid" limit={12} />
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild>
              <Link href={routePath.buyers}>
                View more <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-sky-50/25 py-12 dark:bg-sky-950/10 sm:py-16">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-2">
              <Image
                src="/flags/china.svg"
                alt="China flag"
                width={24}
                height={16}
                className="h-4 w-6 rounded-[2px] border border-black/10 object-cover"
              />
              Pickup in China
            </Badge>
            <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
            <Badge variant="outline" className="gap-2 bg-background/70">
              <Image
                src="/flags/united-states.svg"
                alt="United States flag"
                width={24}
                height={16}
                className="h-4 w-6 rounded-[2px] border border-black/10 object-cover"
              />
              Delivery in the United States
            </Badge>
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            What to check before booking a China freight forwarder
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Use these seven checks to prepare a clear request, compare quotes fairly, and avoid unclear charges or responsibilities.
          </p>

          <ol className="mt-10 divide-y divide-blue-100 border-y border-blue-100 dark:divide-blue-950 dark:border-blue-950">
            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">01</span>
              <div>
                <h3 className="text-xl font-semibold">Send one complete shipment brief</h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Share the product name, number of cartons, carton dimensions, total weight, cargo value, ready date, pickup city, and U.S. delivery ZIP code. Add a packing list and product photos when available. Tell the forwarder immediately if the shipment contains batteries, liquids, magnets, chemicals, food, medical goods, or branded products. These details affect the available route, paperwork, handling rules, and final price.
                </p>
              </div>
            </li>

            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">02</span>
              <div>
                <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                  <Image src="/flags/china.svg" alt="China flag" width={24} height={16} className="h-4 w-6 rounded-[2px] border border-black/10 object-cover" />
                  China: confirm the pickup and export work
                </h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Ask who will collect the goods from the factory, check carton counts, store or consolidate cargo, and complete export handling. If you are buying from several suppliers, confirm the warehouse address, free storage period, consolidation fee, and cut-off date. Your supplier should know which invoice, packing list, declaration details, and product records must be sent before the cargo can leave China.
                </p>
              </div>
            </li>

            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">03</span>
              <div>
                <h3 className="text-xl font-semibold">Compare the full quote—not only the freight rate</h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Ask each provider to quote the same shipment details and delivery scope. Check origin charges, freight, fuel or peak-season surcharges, customs brokerage, duty and tax, port or airport fees, storage, insurance, and final delivery. The quote should state whether it is port-to-port, port-to-door, or door-to-door, along with its validity date. A low headline rate can become expensive when local charges are added later.
                </p>
              </div>
            </li>

            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">04</span>
              <div>
                <h3 className="text-xl font-semibold">Choose the shipping mode around the order</h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Express courier may suit samples and small urgent parcels. Air freight can work for time-sensitive commercial cargo. Sea freight is usually considered for larger shipments where cost matters more than speed. Ask for the estimated transit time, departure schedule, route, and chargeable weight or volume. If timing is important, also ask whether the quote covers direct service or a route with transfers.
                </p>
              </div>
            </li>

            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">05</span>
              <div>
                <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                  <Image src="/flags/united-states.svg" alt="United States flag" width={24} height={16} className="h-4 w-6 rounded-[2px] border border-black/10 object-cover" />
                  United States: confirm customs and final delivery
                </h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Confirm who will act as the importer of record, which customs broker will file the entry, and who will pay duty, tax, bond, examination, storage, or demurrage charges. Share whether the destination is a business, home, warehouse, or fulfilment centre, and whether an appointment, liftgate, pallet delivery, or inside service is needed. Do not assume these items are included unless the written quote says so.
                </p>
              </div>
            </li>

            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">06</span>
              <div>
                <h3 className="text-xl font-semibold">Check the provider before making payment</h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Review the company name, business contact details, service agreement, payment account, and experience with your product and route. Ask how cargo insurance works and what happens if cartons are lost, damaged, held, or delayed. Keep quotations, invoices, approvals, and shipment documents in writing. ChinaIndiaSourcing introduces independent providers; the forwarder you select remains responsible for the service and terms agreed with you.
                </p>
              </div>
            </li>

            <li className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">07</span>
              <div>
                <h3 className="text-xl font-semibold">Agree on updates before the goods move</h3>
                <p className="mt-2 leading-7 text-foreground/75">
                  Ask who will be your contact and how often updates will be sent. Useful milestones include factory pickup, warehouse receipt, booking confirmation, departure, estimated arrival, customs release, and final delivery. If a date changes, the provider should explain the reason and give a revised estimate. A simple written update schedule makes it easier to plan inventory, warehouse space, sales dates, and customer commitments.
                </p>
              </div>
            </li>
          </ol>
        </article>
      </section>

      <section id="process" className="scroll-mt-20 border-b border-border/50 bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              How it works
            </h2>
            <p className="mt-3 text-base font-medium text-foreground/80 sm:text-lg">
              From shipment details to a chosen provider
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {freightSteps.map((step, index) => (
              <Card key={step.title} className="h-full border-border/50 bg-blue-50/45 shadow-none dark:bg-blue-950/15">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white">
                      <step.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      0{index + 1}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-lg leading-6">{step.title}</CardTitle>
                  <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PlatformFeatures serviceName={displayServiceName} marketName={market.name} />

      <section className="border-b border-blue-100 bg-blue-50/45 py-12 dark:border-blue-950 dark:bg-blue-950/10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <Badge variant="secondary">Frequently asked questions</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Common freight questions
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Simple answers to help you prepare before speaking with a provider.
            </p>
          </div>
          <div className="divide-y divide-blue-100 rounded-2xl border border-blue-100 bg-white px-5 shadow-sm dark:divide-blue-950 dark:border-blue-950 dark:bg-slate-950 sm:px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>{faq.question}</span>
                  <span className="text-xl font-normal text-blue-700 transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Continue building your sourcing plan
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href={routePath.services}>
                View all services <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((item) => (
              <Link
                key={item.slug}
                href={routePath.marketService(market.slug, item.slug)}
                className="group flex items-center justify-between rounded-xl border border-border/60 bg-blue-50/40 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:border-blue-800"
              >
                <span className="flex min-w-0 items-center gap-3 font-medium">
                  <Image
                    src="/flags/china.svg"
                    alt="China flag"
                    width={24}
                    height={16}
                    className="h-4 w-6 shrink-0 rounded-[2px] border border-black/10 object-cover"
                  />
                  <span>{serviceDisplayName(item.name)}</span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-border/50 bg-blue-100/70 shadow-none dark:bg-blue-950/30">
            <CardContent className="flex flex-col gap-5 px-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
               
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Find providers offering Chinese Freight Forwarder in China
                </h2>
               
              </div>
              <Button size="lg" asChild>
                <Link href={routePath.buyers}>
                  <Search aria-hidden="true" /> Post a requirement
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter marketName={market.locationName} marketSlug={market.slug} />
    </main>
  );
}
