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
import inquiryData from "@/data/inquiries.json";
import { services, sourceCountries } from "@/lib/services";
import { routePath } from "@/url";

export const metadata: Metadata = {
  title: "Find Sourcing Agents in China, India & Beyond | ChinaIndiaSourcing",
  description:
    "ChinaIndiaSourcing connects buyers with independent sourcing agents, suppliers, inspectors, and logistics providers across China, India, and other sourcing countries.",
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
      "Share the product, quantity, specifications, target budget, timeline, and delivery destination so providers understand what you need.",
  },
  {
    number: "02",
    icon: PackageSearch,
    title: "Meet relevant partners",
    description:
      "Discover independent agents and service providers in your chosen sourcing country, with experience that fits your requirement.",
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Compare scope and offers",
    description:
      "Review provider experience, deliverables, quotations, samples, production terms, quality checks, and expected timelines.",
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
      "ChinaIndiaSourcing is a directory and connection platform where buyers can discover independent sourcing agents, suppliers, inspectors, and logistics providers across multiple countries.",
  },
  {
    question: "Can I find providers outside China?",
    answer:
      "Yes. Browse sourcing services by origin country, including India, Vietnam, Taiwan, and other listed markets, then share the requirement with providers that match your needs.",
  },
  {
    question: "How should I compare sourcing providers?",
    answer:
      "Send each provider the same product brief and compare relevant experience, exact scope, fees, lead times, communication, quality checkpoints, and the assumptions behind each quotation.",
  },
  {
    question: "Does the platform provide sourcing or shipping services directly?",
    answer:
      "No. The platform helps buyers find and contact independent businesses. The provider you select is responsible for its services, quotation, contract, and agreed deliverables.",
  },
  {
    question: "What details should I include in a requirement?",
    answer:
      "Include the product or service, specifications, quantity, target price or budget, sourcing country, expected schedule, destination, and any quality or compliance needs you already know.",
  },
];

const relatedServices = services
  .filter((service) => service.origin === "China")
  .slice(0, 6);

const sourcingMarkets = sourceCountries.map((country) => country.name).join(", ");

const homeGuideSections = [
  {
    title: "Start with the result your business needs",
    description: `Before contacting providers, describe the result you want from your sourcing project. You may need help finding a supplier, comparing manufacturers, checking a product, coordinating an order, or arranging freight and documentation. State the product or service, intended use, quantity, target market, budget, and expected timeline. If some details are not final, label them as estimates and explain what still needs to be decided. A clear brief helps independent businesses understand whether their experience fits the work and gives you a more useful basis for comparing replies.`
  },
  {
    title: "Choose an origin market that fits the product",
    description: `The right sourcing location depends on the product category, supplier capability, order size, required materials, lead time, and target cost. The marketplace lists providers across ${sourcingMarkets}. Treat country as a starting filter rather than a guarantee that every provider can handle every product. Ask where a provider and its proposed suppliers operate, what they make or coordinate, and whether they have experience with your specifications and destination. Comparing more than one origin can help you understand differences in capability, minimum order quantities, customization, and delivery assumptions before you commit.`
  },
  {
    title: "Find the right type of independent provider",
    description: `Different projects call for different expertise. A sourcing agent may research suppliers and coordinate communication; an inspection provider may gather evidence against agreed quality criteria; a freight or logistics business may plan transport and handoffs. Some companies offer several of these services, while others focus on one stage. Read each profile and ask who will perform the work, what is handled by partners, and which deliverables are included. ChinaIndiaSourcing is a directory and introduction platform, so the independent business you choose remains responsible for its own services and commitments.`
  },
  {
    title: "Make provider offers easier to compare",
    description: `Send the same brief to each provider you are considering. Compare the proposed scope, relevant experience, fees, minimums, lead time, communication plan, and assumptions behind the offer. Ask providers to separate included work from optional services and third-party costs. For example, supplier discovery may not include factory visits, product testing, sample fees, freight, customs brokerage, duties, or final delivery. A comparison table can capture these differences and unanswered questions. This makes it easier to evaluate total project fit instead of choosing from a headline price that may cover a different service.`
  },
  {
    title: "Turn product expectations into written checkpoints",
    description: `Describe the features that matter before samples, production, or inspection begins. Share drawings, dimensions, materials, performance needs, packaging, labelling, and reference photos when available. Agree which items must be approved and what evidence the provider will return, such as supplier details, sample photos, measurements, test records, or inspection findings. Decide who reviews that evidence and how changes are recorded. A written checklist helps prevent different interpretations of “good quality” and gives the provider a practical way to raise specification gaps before they become costly corrections.`
  },
  {
    title: "Confirm the schedule, responsibilities, and handoffs",
    description: `Ask for a sequence of milestones, estimated dates, and the person responsible for each step. Depending on the project, this may include supplier responses, quotation review, sample approval, order confirmation, production updates, inspection, document preparation, dispatch, and delivery. Identify what information or decision is needed from you at each milestone. When more than one company is involved, clarify where one provider’s scope ends and the next partner’s work begins. Build review time into the schedule, and ask how delays or changed estimates will be communicated so your team can plan around them.`
  },
  {
    title: "Review commercial terms before authorizing work",
    description: `Before making payment or approving a project, verify the provider’s business identity, contact details, payment recipient, service agreement, fees, cancellation terms, and process for handling disputes or changes. Check whether quoted costs are fixed, estimated, or dependent on later measurements and third-party charges. Keep proposals, invoices, approvals, and scope changes together in a dated record. Ask which payment methods and platform safeguards apply to your specific transaction; do not assume every service or off-platform payment is covered. The provider you select should confirm the final scope and terms directly with you in writing.`
  },
  {
    title: "Use the marketplace to organize your next step",
    description: `The platform brings provider discovery, buyer requirements, and service information into one place so you can begin a focused conversation. Review the available profiles, share the details relevant to your project, and use provider responses to decide what needs further validation. You remain in control of which independent business to contact and whether to proceed. Save the agreed brief and milestones so that a future order starts with accurate information. Whether you are exploring a first product or coordinating repeat purchasing, a documented process makes it easier to compare options, communicate changes, and keep your sourcing decisions understandable to your team.`
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
              From your requirement to a sourcing partner you choose
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
                Explore active sourcing enquiries
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

      <section
        id="sourcing-guide"
        className="border-b border-border/50 bg-sky-50/25 py-12 dark:bg-sky-950/10 sm:py-16"
      >
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary">A practical sourcing guide</Badge>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            How to find and work with a sourcing partner
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            Use this guide to prepare your brief, compare independent providers,
            and organize the important decisions in a sourcing project.
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
        marketName="your market"
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
                  Find the right independent sourcing partner
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Share your product, destination, and service needs to start
                  comparing providers.
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
