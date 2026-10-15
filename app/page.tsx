import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  MessageSquareText,
  PackageSearch,
  Search,
  ShieldCheck,
  Store,
} from "lucide-react";

import { PlatformFeatures } from "@/components/platform-features";
import { InquiryCarousel } from "@/components/inquiry-carousel";
import { SiteFooter } from "@/components/site-footer";
import { SourcePageIntro } from "@/components/source-page-intro";
import { TopSellersListing } from "@/components/top-sellers-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { countryAlternates } from "@/lib/seo";
import { homeSpreadsheetMetadata } from "@/lib/spreadsheet-metadata";
import inquiryData from "@/data/inquiries.json";
import { services, sourceCountries } from "@/lib/services";
import { routePath } from "@/url";

export const metadata: Metadata = {
  ...homeSpreadsheetMetadata,
  alternates: countryAlternates(
    routePath.home,
    (market) => routePath.market(market.slug),
  ),
};

const workflowSteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Post your requirement",
    description:
      "Share your product, quantity, specifications, target budget in U.S. dollars, delivery city or ZIP code, and timeline so providers understand what you need.",
  },
  {
    number: "02",
    icon: PackageSearch,
    title: "Meet relevant partners",
    description:
      "Discover independent agents and service providers in China, India, and other sourcing markets, with experience that fits your U.S.-bound project.",
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Compare scope and offers",
    description:
      "Compare provider experience, deliverables, quotes, samples, production terms, quality checks, shipping assumptions, and timelines for delivery to the United States.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Choose your provider",
    description:
      "Agree the work and commercial terms directly with the independent provider, then keep decisions and milestones organized.",
  },
];

const faqs = [
  {
    question: "What is ChinaIndiaSourcing?",
    answer:
      "ChinaIndiaSourcing is a directory and connection platform for U.S. businesses to discover independent sourcing agents, suppliers, inspectors, and logistics providers in China, India, and other sourcing markets.",
  },
  {
    question: "Can I find providers outside China?",
    answer:
      "Yes. Browse providers in India, Vietnam, Taiwan, Mexico, and other listed markets. Share your U.S. delivery destination and ask each provider about its experience with your product, shipping route, and import handoffs.",
  },
  {
    question: "How should I compare sourcing providers?",
    answer:
      "Send each provider the same brief, including the U.S. delivery destination. Compare experience, scope, fees, lead times, quality checkpoints, and which costs are included, such as freight, insurance, customs brokerage, duties, and delivery. Confirm import costs and requirements with qualified professionals before committing.",
  },
  {
    question: "Does the platform provide sourcing or shipping services directly?",
    answer:
      "No. The platform helps buyers find and contact independent businesses. The provider you select is responsible for its services, quotation, contract, and agreed deliverables.",
  },
  {
    question: "What details should I include in a requirement?",
    answer:
      "Include the product, specifications, quantity, target price in U.S. dollars, preferred sourcing market, expected schedule, U.S. delivery city or ZIP code, and any product, labeling, testing, or compliance needs you already know.",
  },
];

const relatedServices = services
  .filter((service) => service.origin === "China")
  .slice(0, 6);

const sourcingMarkets = sourceCountries.map((country) => country.name).join(", ");

const homeGuideSections = [
  {
    title: "Start with your U.S. business requirements",
    description: `Before contacting providers, describe the product you plan to sell or use in the United States, the quantity, specifications, target budget in U.S. dollars, and when you need it. Include the delivery city and ZIP code, whether the order is for wholesale, retail, or ecommerce, and any packaging or labeling expectations. If costs or quantities are still estimates, say so. A clear brief helps independent businesses understand the project and gives you a fair basis for comparing replies.`,
  },
  {
    title: "Choose a sourcing market with U.S. delivery in mind",
    description: `The right origin depends on the product, supplier capability, order size, materials, lead time, and total cost to your U.S. destination. The marketplace lists providers across ${sourcingMarkets}. Treat location as a starting point, not a guarantee of product fit or delivery. Ask where the provider and proposed suppliers operate, what they can produce or coordinate, and whether they have handled shipments to the United States. Compare minimum order quantities, customization, shipping routes, and delivery assumptions before you commit.`,
  },
  {
    title: "Find the right partner for each part of the import",
    description: `A sourcing agent may research suppliers and coordinate communication; an inspection provider may check products against agreed criteria; a freight or logistics business may arrange transport and handoffs. Customs brokerage and final delivery may be handled by separate providers. Ask who performs each task, what is included, and where one company's responsibility ends. ChinaIndiaSourcing helps U.S. businesses discover and contact independent providers; the provider you choose remains responsible for its own services and commitments.`,
  },
  {
    title: "Compare the full cost of getting goods to the U.S.",
    description: `Ask each provider to explain what its quote covers and what it excludes. Depending on the project, separate line items may include product and sample costs, tooling, freight, insurance, customs brokerage, duties, and delivery to your U.S. address. Ask who will confirm applicable import charges and what estimates may change. A simple comparison sheet helps you evaluate the likely total cost and compare offers that cover the same work, instead of relying on a headline price.`,
  },
  {
    title: "Set product and quality expectations for the U.S. market",
    description: `Share drawings, dimensions, materials, performance needs, packaging, labeling, and reference photos before samples or production begin. Identify any U.S. product safety, testing, or labeling requirements that may apply to your product, and confirm them with the relevant qualified professionals. Agree what must be approved and what evidence you expect, such as sample photos, measurements, test records, or inspection findings. A written checklist helps catch gaps before they become costly corrections.`,
  },
  {
    title: "Plan production, shipping, and U.S. delivery milestones",
    description: `Ask for estimated dates and an owner for each step: supplier review, sample approval, order confirmation, production updates, inspection, export documents, international transit, customs handoff, and final delivery. Find out what decisions or information your team needs to provide at each milestone. When several providers are involved, clarify who coordinates each handoff. Include time for review and ask how delays or changed estimates will be communicated.`,
  },
  {
    title: "Put the scope, currency, and payment terms in writing",
    description: `Before authorizing work, confirm the provider's identity, payment recipient, written scope, fees, cancellation terms, and process for changes or disputes. State whether amounts are quoted in U.S. dollars or another currency, and ask which exchange-rate or third-party charges may apply. Keep proposals, invoices, approvals, and scope changes together. Confirm which platform safeguards apply to your transaction; not every service or off-platform payment is covered. Get the final responsibilities and terms in writing from the provider.`,
  },
  {
    title: "Use the marketplace to take your next step",
    description: `Review provider profiles, share your U.S.-bound requirement, and use replies to decide what to validate next. You choose which independent businesses to contact and whether to proceed. Keep the agreed brief, quote assumptions, and milestones together so your team can compare options, communicate changes, and manage repeat orders with accurate information.`,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SourcePageIntro showHomepageSections={false} />

      <TopSellersListing countryName="All" />

      <section
        id="how"
        className="scroll-mt-20 border-y border-border/50 bg-background py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              How it works
            </h2>
            <p className="mt-3 text-base font-medium text-foreground/80 sm:text-lg">
              From your U.S. import requirement to a sourcing partner you choose
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => (
              <Card
                key={step.number}
                className="h-full border-border/50 bg-blue-50/45 shadow-none dark:bg-blue-950/15"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white">
                      <step.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {step.number}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-lg leading-6">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="requests"
        className="scroll-mt-20 border-b border-border/50 bg-slate-50/55 py-10 dark:bg-slate-950/20 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Badge variant="outline">Live buyer requirements</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore active Sourcing Buyers
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Browse recent buyer requests and open a card to review the full
                sourcing requirement.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm">
              {Math.min(12, inquiryData.length)} requests shown
            </Badge>
          </div>
          <InquiryCarousel layout="grid" limit={12} includeLive />
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild>
              <Link href={routePath.buyers}>
                View more <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="sourcing-guide"
        className="border-b border-border/50 bg-sky-50/25 py-12 dark:bg-sky-950/10 sm:py-16"
      >
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary">A practical sourcing guide</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            How U.S. businesses can find and work with a sourcing partner
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Use this guide to plan an import, compare independent providers, and
            organize the decisions involved in sourcing products for the U.S. market.
          </p>
          <ol className="mt-10 divide-y divide-blue-100 border-y border-blue-100 dark:divide-blue-950 dark:border-blue-950">
            {homeGuideSections.map((section, index) => (
              <li key={section.title} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  <p className="mt-2 leading-7 text-foreground/75">{section.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <PlatformFeatures
        serviceName="sourcing partner discovery"
        marketName="the United States"
      />

      <section
        id="support"
        className="border-b border-blue-100 bg-blue-50/45 py-12 dark:border-blue-950 dark:bg-blue-950/10 sm:py-16"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <Badge variant="secondary">Frequently asked questions</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions buyers ask before getting started
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Learn how provider discovery works and what to prepare before
              sharing a sourcing requirement.
            </p>
          </div>
          <div className="divide-y divide-blue-100 rounded-2xl border border-blue-100 bg-white px-5 shadow-sm dark:divide-blue-950 dark:border-blue-950 dark:bg-slate-950 sm:px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>{faq.question}</span>
                  <span
                    className="text-xl font-normal text-blue-700 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {relatedServices.length > 0 ? (
        <section className="bg-background py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge variant="outline">Explore sourcing services</Badge>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Find support for your next sourcing project
                </h2>
              </div>
              <Button variant="outline" asChild>
                <Link href={routePath.services}>
                  View all services <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={routePath.marketService("us", service.slug)}
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
                    {service.name}
                  </span>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/50 bg-blue-100/70 p-6 dark:bg-blue-950/30 sm:p-7">
            <Badge variant="secondary">Start with your requirement</Badge>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Find a sourcing partner for your U.S. business
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Share your product, U.S. delivery destination, and service needs
                  to start comparing providers.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={routePath.buyers}>
                    <Search aria-hidden="true" /> Post a requirement
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={routePath.sellers}>
                    <Store aria-hidden="true" /> List my services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
