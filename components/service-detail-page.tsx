import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  ClipboardList,
  FileCheck2,
  MessagesSquare,
  Ship,
} from "lucide-react";

import { InquiryCarousel } from "@/components/inquiry-carousel";
import { PlatformFeatures } from "@/components/platform-features";
import { SiteFooter } from "@/components/site-footer";
import { SourcePageIntro } from "@/components/source-page-intro";
import { TopSellersListing } from "@/components/top-sellers-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuyerMarket } from "@/lib/markets";
import {
  getSourceCountry,
  serviceDisplayName,
  services,
  type SourcingService,
} from "@/lib/services";
import { routePath } from "@/url";

type ServiceDetailPageProps = {
  market: BuyerMarket;
  service: SourcingService;
  regionName?: string;
};

type ContentProfile = {
  label: string;
  intro: string;
  outcomes: { title: string; description: string }[];
  checkpoints: { title: string; description: string }[];
  idealFor: { title: string; description: string }[];
};

function localizeServiceText(text: string, market: BuyerMarket) {
  return text
    .replaceAll("US buyers", `buyers in ${market.locationName}`)
    .replaceAll("US businesses", `businesses in ${market.locationName}`)
    .replaceAll("the United States", market.locationName)
    .replaceAll("US delivery location", `delivery location in ${market.locationName}`)
    .replaceAll("US delivery destination", `delivery destination in ${market.locationName}`)
    .replaceAll("US delivery handoff", `${market.name} delivery handoff`)
    .replaceAll("US destination", `destination in ${market.locationName}`);
}

function countryFlagAsset(countryName: string) {
  const flags: Record<string, string> = {
    china: "china",
    india: "india",
    vietnam: "vietnam",
    taiwan: "taiwan",
    "south africa": "south-africa",
    "united states": "united-states",
    usa: "united-states",
    "united kingdom": "uk",
    uk: "uk",
    australia: "australia",
    canada: "canada",
    "new zealand": "new-zealand",
    germany: "germany",
    nigeria: "nigeria",
    pakistan: "pakistan",
    bangladesh: "bangladesh",
    brazil: "brazil",
    uae: "uae",
    "united arab emirates": "uae",
  };
  const flag = flags[countryName.trim().toLowerCase()];
  if (flag) return `/flags/${flag}.svg`;
  const sourceCountryCodes: Record<string, string> = {
    "south korea": "kr",
    mexico: "mx",
    netherlands: "nl",
    turkey: "tr",
    malaysia: "my",
    indonesia: "id",
    spain: "es",
    thailand: "th",
    poland: "pl",
    philippines: "ph",
  };
  const code = sourceCountryCodes[countryName.trim().toLowerCase()];
  return code ? `https://flagcdn.com/w40/${code}.png` : null;
}

function getServiceKind(name: string) {
  const value = name.toLowerCase();
  if (value.includes("custom clearance")) return "customs";
  if (value.includes("ddp") || value.includes("door to door")) return "ddp";
  if (value.includes("freight") || value.includes("logistics")) return "freight";
  if (value.includes("inspection") || value.includes("factory visit") || value.includes("factory research")) return "inspection";
  if (value.includes("product research") || value.includes("trending")) return "research";
  if (value.includes("import") || value.includes("export")) return "import";
  if (value.includes("alibaba") || value.includes("1688") || value.includes("indiamart")) return "marketplace";
  return "sourcing";
}

function buildContent(service: SourcingService, market: BuyerMarket): ContentProfile {
  const origin = service.origin;
  const destination = market.locationName;
  const kind = getServiceKind(service.name);

  if (kind === "customs") {
    return {
      label: "Customs-clearance coordination",
      intro: `Prepare the information and handoffs needed to clear goods moving from ${origin} into ${destination}, with the importer, customs broker, logistics partner, and supplier working from a consistent shipment file.`,
      outcomes: [
        { title: "Shipment-file readiness", description: "Bring product descriptions, values, quantities, origin, consignee, and transport details into one reviewable file." },
        { title: "Classification inputs", description: "Organize material, use, and technical information that supports broker-led HS classification and duty review." },
        { title: "Document consistency", description: "Check that invoices, packing lists, shipment records, and party details do not conflict." },
        { title: "Release coordination", description: `Track customs queries, document updates, cargo release, and onward delivery in ${destination}.` },
      ],
      checkpoints: [
        { title: "Importer and product details", description: "Importer-of-record, consignee, commodity, composition, use, origin, value, and available compliance records." },
        { title: "Broker-ready documents", description: "Commercial invoice, packing list, transport document, purchase details, and supporting certificates where relevant." },
        { title: "Clearance and delivery", description: "Duty and tax inputs, customs queries, release status, storage exposure, and final handoff." },
      ],
      idealFor: [
        { title: "First-time importers", description: "Buyers who need a clearer view of the parties, documents, and decisions involved in clearance." },
        { title: "Repeat commercial shipments", description: "Teams that want consistent shipment files and broker handoffs across regular imports." },
        { title: "Complex product categories", description: "Goods that require precise descriptions, supporting records, or early compliance questions." },
      ],
    };
  }

  if (kind === "freight") {
    return {
      label: "Freight and logistics planning",
      intro: `Plan the movement of goods from ${origin} to ${destination} around cargo size, urgency, handling needs, and landed-cost priorities, not around a one-size-fits-all shipping quote.`,
      outcomes: [
        { title: "Mode and route fit", description: "Compare suitable air, ocean, rail, road, or multimodal options against time, volume, and budget." },
        { title: "Consolidation planning", description: "Coordinate cargo from one or several suppliers and identify practical handover points." },
        { title: "Document readiness", description: "Organize the commercial and shipping information needed by logistics and customs partners." },
        { title: "Destination handoff", description: `Align arrival, clearance responsibilities, and onward delivery in ${destination}.` },
      ],
      checkpoints: [
        { title: "Cargo profile", description: "Cartons, dimensions, weight, value, commodity, and special handling." },
        { title: "Quote comparison", description: "Freight basis, local charges, transit assumptions, and validity period." },
        { title: "Shipment milestones", description: "Pickup, departure, transit, arrival, clearance, and delivery updates." },
      ],
      idealFor: [
        { title: "Growing importers", description: "Teams moving repeat orders that need a more predictable logistics workflow." },
        { title: "Multi-supplier orders", description: "Buyers coordinating several factories or products in one sourcing cycle." },
        { title: "Time-sensitive cargo", description: "Projects that need a clear trade-off between delivery speed and cost." },
      ],
    };
  }

  if (kind === "ddp") {
    return {
      label: "Delivered-duty-paid coordination",
      intro: `Build a door-to-door plan from ${origin} to ${destination} with clearer ownership of freight, export handling, import clearance, duties, and final delivery.`,
      outcomes: [
        { title: "Landed-cost visibility", description: "Review which transport, customs, duty, and destination charges are included or excluded." },
        { title: "Responsibility mapping", description: "Make the handoffs between supplier, forwarder, broker, and final receiver easier to understand." },
        { title: "Delivery planning", description: "Confirm address type, appointment needs, unloading limits, and final-mile expectations." },
        { title: "Exception control", description: "Surface document gaps, restricted items, and shipment assumptions before dispatch." },
      ],
      checkpoints: [
        { title: "Shipment facts", description: "Commodity, value, HS-code input, dimensions, weight, and destination." },
        { title: "Scope confirmation", description: "Written inclusion of duties, taxes, clearance, storage, and final delivery." },
        { title: "Door delivery", description: "Milestone tracking through pickup, border clearance, and consignee handoff." },
      ],
      idealFor: [
        { title: "First-time importers", description: "Buyers who want fewer fragmented logistics arrangements." },
        { title: "E-commerce inventory", description: "Brands shipping stock to a warehouse, fulfilment centre, or commercial address." },
        { title: "Landed-cost buyers", description: "Teams comparing sourcing options on total delivered cost rather than unit price alone." },
      ],
    };
  }

  if (kind === "inspection") {
    return {
      label: "Supplier and quality verification",
      intro: `Create independent evidence around a ${origin} supplier, factory, or production order before the goods reach ${destination}.`,
      outcomes: [
        { title: "Supplier identity", description: "Review business details, operating location, product focus, and the claimed role in the supply chain." },
        { title: "Production capability", description: "Assess relevant equipment, capacity signals, workflow, and quality-control practices." },
        { title: "Specification checks", description: "Translate drawings, samples, tolerances, packaging, and workmanship into an inspection checklist." },
        { title: "Evidence-led decisions", description: "Use photos, measurements, findings, and corrective actions before approving the next milestone." },
      ],
      checkpoints: [
        { title: "Inspection standard", description: "Define the sample plan, defect classes, tests, and acceptance criteria." },
        { title: "On-site evidence", description: "Record quantities, workmanship, dimensions, function, labelling, and packaging." },
        { title: "Release decision", description: "Review findings and corrective actions before balance payment or shipment." },
      ],
      idealFor: [
        { title: "Private-label brands", description: "Products where finish, packaging, labelling, and consistency protect the brand." },
        { title: "Technical buyers", description: "Components or equipment with measurable specifications and tolerances." },
        { title: "New supplier orders", description: "Purchases where the buyer needs stronger evidence before scaling volume." },
      ],
    };
  }

  if (kind === "research") {
    return {
      label: "Product and market research",
      intro: `Turn a product idea into a sourcing-ready opportunity by connecting demand signals in ${destination} with supplier, cost, and customization realities in ${origin}.`,
      outcomes: [
        { title: "Demand signals", description: "Review use cases, buyer expectations, visible trends, seasonality, and market positioning." },
        { title: "Competitive benchmark", description: "Compare common features, price bands, pack sizes, claims, and customer pain points." },
        { title: "Supply depth", description: `Explore whether ${origin} has enough relevant manufacturers and viable alternatives.` },
        { title: "Unit-economics input", description: "Estimate the cost factors that influence product, packaging, freight, duty, and selling margin." },
      ],
      checkpoints: [
        { title: "Opportunity brief", description: "Target buyer, problem, channel, price point, and differentiation hypothesis." },
        { title: "Supply validation", description: "Supplier availability, MOQ, customization scope, sample cost, and lead time." },
        { title: "Go/no-go review", description: "Summarize evidence, assumptions, risks, and the next validation step." },
      ],
      idealFor: [
        { title: "Marketplace sellers", description: "Teams evaluating products for online channels before committing inventory." },
        { title: "Retail brands", description: "Businesses planning a new range, variation, bundle, or private-label concept." },
        { title: "Category expansion", description: "Established importers testing an adjacent product or customer segment." },
      ],
    };
  }

  if (kind === "import") {
    return {
      label: "Import and export coordination",
      intro: `Connect the commercial, documentation, and logistics steps needed to move goods from ${origin} into ${destination} with fewer last-minute surprises.`,
      outcomes: [
        { title: "Trade-term clarity", description: "Define responsibilities under the chosen Incoterm and align the commercial quotation." },
        { title: "Document coordination", description: "Prepare the invoice, packing list, transport documents, and product information for partner review." },
        { title: "Compliance handoff", description: "Identify product-specific questions that need confirmation from qualified customs or compliance partners." },
        { title: "Shipment continuity", description: "Keep supplier readiness, booking, export steps, clearance, and delivery connected." },
      ],
      checkpoints: [
        { title: "Product classification", description: "Detailed product description, material, use, origin, value, and HS-code input." },
        { title: "Commercial file", description: "Consistent quantities, pricing, Incoterms, consignee details, and supporting documents." },
        { title: "Border-to-door plan", description: "Broker, forwarder, importer-of-record, and destination responsibilities." },
      ],
      idealFor: [
        { title: "New trade lanes", description: `Buyers importing from ${origin} into ${destination} for the first time.` },
        { title: "Regulated categories", description: "Products requiring early document, labelling, testing, or compliance questions." },
        { title: "Repeat importers", description: "Teams looking to standardize files and handoffs across regular shipments." },
      ],
    };
  }

  if (kind === "marketplace") {
    return {
      label: "Marketplace-assisted sourcing",
      intro: `Use ${service.name} to move beyond search results and build a structured shortlist of ${origin} suppliers for buyers in ${destination}.`,
      outcomes: [
        { title: "Factory or trader context", description: "Check what the seller appears to manufacture, outsource, or distribute before comparing offers." },
        { title: "Normalized quotations", description: "Compare the same specification, quantity, Incoterm, packaging, and payment assumptions." },
        { title: "Sample and customization", description: "Coordinate samples, branding, materials, packaging, and approval points." },
        { title: "Order follow-through", description: "Carry confirmed terms into production, quality checks, and shipment planning." },
      ],
      checkpoints: [
        { title: "Search criteria", description: "Product keywords, supplier type, region, capability, certification, and export experience." },
        { title: "Supplier comparison", description: "Quote, MOQ, tooling, sample, capacity, lead time, and communication quality." },
        { title: "Verified next step", description: "Select candidates for deeper checks, samples, negotiation, or an order." },
      ],
      idealFor: [
        { title: "Online sellers", description: "Buyers who need a better filter than listings and headline prices." },
        { title: "Custom product teams", description: "Projects involving logo, packaging, tooling, colours, or specification changes." },
        { title: "Small and mid-size importers", description: "Teams that want comparison support without building a local sourcing office." },
      ],
    };
  }

  return {
    label: "End-to-end sourcing coordination",
    intro: `Find, compare, and coordinate suitable ${origin} suppliers while keeping commercial terms, product quality, and delivery to ${destination} connected.`,
    outcomes: [
      { title: "Relevant supplier shortlist", description: "Search around product capability, order size, customization, certifications, and export fit." },
      { title: "Comparable commercial terms", description: "Review quotations on the same specification, MOQ, tooling, packaging, payment, and Incoterm basis." },
      { title: "Sample and quality control", description: "Turn product expectations into approvals, production checkpoints, and inspection criteria." },
      { title: "Delivery coordination", description: `Connect supplier readiness with export documents, freight planning, and delivery in ${destination}.` },
    ],
    checkpoints: [
      { title: "Supplier fit", description: "Capability, identity, relevant experience, capacity, MOQ, and communication." },
      { title: "Product approval", description: "Specification, samples, materials, branding, packaging, and acceptance criteria." },
      { title: "Order control", description: "Final terms, production updates, inspection, shipment documents, and handoff." },
    ],
    idealFor: [
      { title: "E-commerce and private label", description: "Products requiring differentiation, packaging, and repeatable quality." },
      { title: "Wholesale and distribution", description: "Buyers comparing larger orders, supplier depth, and landed cost." },
      { title: "Industrial procurement", description: "Components, equipment, and made-to-spec requirements with measurable criteria." },
    ],
  };
}

export function ServiceDetailPage({ market, service, regionName }: ServiceDetailPageProps) {
  const displayMarket = regionName
    ? { ...market, name: regionName, locationName: `${regionName}, ${market.locationName}` }
    : market;
  const sourceCountry = getSourceCountry(service.origin);
  const sourceFlag = countryFlagAsset(sourceCountry.name);
  const destinationFlag = countryFlagAsset(market.name);
  const overview = localizeServiceText(service.overview, displayMarket);
  const content = buildContent(service, displayMarket);
  const displayServiceName = serviceDisplayName(service.name);
  const relatedServices = services.filter((item) => item.origin === service.origin && item.slug !== service.slug).slice(0, 6);
  const pageTitle = regionName
    ? `${displayServiceName} for Buyers in ${regionName}`
    : `${displayServiceName} for ${displayMarket.name} Buyers`;
  const faqs = [
    {
      question: `What does ${displayServiceName} include?`,
      answer: `${displayServiceName} can cover the relevant stages shown on this page, from requirement clarification and partner comparison to documentation, quality, and delivery coordination. The final scope depends on your product, order size, origin, destination, and selected partner.`,
    },
    {
      question: `How are suppliers or service partners in ${service.origin} assessed?`,
      answer: "Assessment can review identity, product relevance, capability, quotation detail, communication, sample performance, available documents, and on-site evidence where appropriate. The checks should be agreed before an order is placed.",
    },
    {
      question: "Can the platform connect me with help for samples, MOQ, and price negotiation?",
      answer: "Yes. ChinaIndiaSourcing can introduce independent providers whose scope may include sample coordination, MOQ discussions, customization, packaging, target cost, and payment terms. Confirm the exact deliverables with the provider you select.",
    },
    {
      question: `How long does sourcing from ${service.origin} take?`,
      answer: "Timing varies by product complexity, supplier availability, sample rounds, tooling, production lead time, inspection, and shipping method. A realistic schedule is created after the requirement and supplier options are reviewed.",
    },
    {
      question: `Can quality checks and shipping to ${displayMarket.locationName} be coordinated?`,
      answer: "They can be included in the sourcing plan. Inspection criteria, release decisions, documents, freight responsibilities, customs handoffs, and final delivery requirements should be confirmed as separate milestones.",
    },
  ];
  const guideSections = [
    {
      title: "Start with a complete requirement",
      description: `Explain what you need from ${displayServiceName} and why the service is required for your order or project. Include the product or shipment type, specifications, quantity, current status, preferred schedule, and delivery location in ${displayMarket.locationName}. If you are still deciding, share the information you have and clearly mark estimates or unanswered questions. A useful first brief also describes the result you expect, such as a comparable supplier shortlist, a verified inspection report, a customs handoff, or a delivered shipment. This context helps independent providers in ${service.origin} judge whether their experience and service scope fit your request.`
    },
    {
      title: "Make the service scope specific",
      description: `${content.outcomes[0].description} Before accepting a proposal, ask the provider to turn that outcome into a written list of tasks, deliverables, exclusions, and decision points. The listed service may include ${service.includes[0]?.toLowerCase() || "the agreed service activities"}, but the exact commitment depends on the provider and your requirement. Confirm who will contact suppliers or partners, who prepares records, which parties must approve each step, and what evidence you will receive. Specific scope language makes it easier to compare offers and reduces the chance that you and the provider assume different work is included.`
    },
    {
      title: "Compare providers on the same basis",
      description: `${content.outcomes[1].description} Share the same brief with each provider and request answers in a consistent format. Compare relevant experience, location coverage, team responsibilities, communication method, availability, and the assumptions behind any price or timeline. For ${displayServiceName}, ask each candidate to identify what depends on information that is not yet confirmed. A lower starting quote may cover fewer tasks or rely on different volumes, service levels, or delivery terms. Record the differences, ask follow-up questions, and shortlist providers based on fit and clarity as well as price.`
    },
    {
      title: "Check information and documents early",
      description: `${content.checkpoints[0].description} Gather the records that support those checks before the relevant milestone, and make sure names, addresses, product descriptions, quantities, and dates agree across files. Ask which documents the provider needs from you, the supplier, or another partner, who will review them, and how corrections will be handled. Keep a dated copy of the version used for each approval. If a detail is unknown, identify its owner and the date it must be confirmed. Early document review gives the team time to resolve gaps before they affect booking, production, inspection, customs processing, or delivery.`
    },
    {
      title: "Agree how quality, compliance, or acceptance is decided",
      description: `${content.checkpoints[1].description} Convert expectations into checks that can be observed or documented. Depending on the service, that may mean confirming supplier identity, verifying a specification, defining inspection criteria, agreeing sample acceptance, or arranging a broker or qualified specialist to review compliance questions. Decide what evidence will be shared, who can approve a result, and what happens when a check identifies an issue. Do not rely on a broad promise such as “quality assured” without asking what will be inspected and what standard will be used. Clear acceptance rules help both sides resolve questions against the agreed requirement.`
    },
    {
      title: "Map timing, costs, and dependencies",
      description: `${content.checkpoints[2].description} Ask for a sequence of milestones with target dates, the person responsible for each handoff, and the information needed to keep work moving. Identify costs that may change with quantity, route, scope, storage, rework, or third-party charges, and ask how those changes will be approved. For work involving goods moving to ${displayMarket.locationName}, clarify where a provider's responsibility ends and another partner's begins. Treat estimates as estimates until their assumptions are confirmed. A practical timeline includes review and approval time, not only the days spent on the core service.`
    },
    {
      title: "Put commercial terms and responsibilities in writing",
      description: `Before making a payment or authorizing work, confirm the provider's legal or trading name, contact details, payment recipient, deliverables, fees, refund or cancellation terms, and process for resolving delays or disputes. Confirm whether third-party charges are included, estimated, or billed separately. The provider you select remains responsible for the work and terms agreed directly with you; ChinaIndiaSourcing helps buyers discover and contact independent businesses. Keep quotations, messages that change the scope, approvals, receipts, and final records together. A written record protects the shared understanding and gives you a clear reference if the requirement changes during the project.`
    },
    {
      title: "Set a clear handoff and update routine",
      description: `${content.outcomes[3].description} Agree who your day-to-day contact is, how often progress updates will arrive, and which events should trigger an immediate message. Useful updates explain what is complete, what is waiting, what decision is needed, and whether the forecast has changed. Before closing the engagement, ask for the final documents, reports, contact handoffs, tracking details, or next-step recommendations that belong to the agreed scope. Save these with your order records so repeat work can start from accurate information. A simple update routine helps buyers in ${displayMarket.locationName} coordinate their own team, inventory, and customers.`
    },
  ];
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      description: `${content.intro} ${overview}`,
      about: { "@type": "Service", name: displayServiceName, areaServed: { "@type": "Place", name: displayMarket.locationName } },
      audience: { "@type": "BusinessAudience", audienceType: `${displayMarket.name} buyers and importers` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <SourcePageIntro title={pageTitle} />
      <TopSellersListing countryName={service.origin} />

      <section id="requests" className="scroll-mt-20 border-b border-border/50 bg-slate-50/55 py-10 dark:bg-slate-950/20 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Recent Buyers Leads for Sourcing</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">Worldwide buyers who want to source from the {service.origin} market</p>
            </div>
            <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm">Live requests</Badge>
          </div>
          <InquiryCarousel layout="grid" limit={12} />
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild><Link href={routePath.buyers}>View more <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-sky-50/25 py-12 dark:bg-sky-950/10 sm:py-16">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-2">
              {sourceFlag ? <Image src={sourceFlag} alt={`${sourceCountry.name} flag`} width={24} height={16} unoptimized className="h-4 w-6 rounded-[2px] border border-black/10 object-cover" /> : null}
              Sourcing in {sourceCountry.name}
            </Badge>
            <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
            <Badge variant="outline" className="gap-2 bg-background/70">
              {destinationFlag ? <Image src={destinationFlag} alt={`${market.name} flag`} width={24} height={16} className="h-4 w-6 rounded-[2px] border border-black/10 object-cover" /> : null}
              Buyers in {displayMarket.locationName}
            </Badge>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">What to check before choosing {displayServiceName}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">Use this practical guide to prepare for {displayServiceName}, compare independent providers in {service.origin}, and coordinate the work for buyers in {displayMarket.locationName}.</p>
          <ol className="mt-10 divide-y divide-blue-100 border-y border-blue-100 dark:divide-blue-950 dark:border-blue-950">
            {guideSections.map((item, index) => (
              <li key={item.title} className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]">
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">{String(index + 1).padStart(2, "0")}</span>
                <div><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-2 leading-7 text-foreground/75">{item.description}</p></div>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section id="process" className="scroll-mt-20 border-b border-border/50 bg-background py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">How it works</h2>
            <p className="mt-3 text-base font-medium text-foreground/80 sm:text-lg">From a clear requirement to a provider you choose</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.slice(0, 4).map((step, index) => {
              const icons = [ClipboardList, MessagesSquare, FileCheck2, Ship];
              const Icon = icons[index] || FileCheck2;
              return (
                <Card key={step.title} className="h-full border-border/50 bg-blue-50/45 shadow-none dark:bg-blue-950/15">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white"><Icon className="size-5" aria-hidden="true" /></span>
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <CardTitle className="mt-4 text-lg leading-6">{step.title}</CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">{localizeServiceText(step.description, displayMarket)}</p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <PlatformFeatures serviceName={displayServiceName} marketName={displayMarket.locationName} />

      <section className="border-b border-blue-100 bg-blue-50/45 py-12 dark:border-blue-950 dark:bg-blue-950/10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <Badge variant="secondary">Frequently asked questions</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Common {displayServiceName.toLowerCase()} questions</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Use these answers to prepare before discussing your requirement with an independent provider.</p>
          </div>
          <div className="divide-y divide-blue-100 rounded-2xl border border-blue-100 bg-white px-5 shadow-sm dark:divide-blue-950 dark:border-blue-950 dark:bg-slate-950 sm:px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  <span>{faq.question}</span><span className="text-xl font-normal text-blue-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="bg-background py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Continue building your sourcing plan</h2>
              <Button variant="outline" asChild><Link href={routePath.services}>View all services <ArrowRight aria-hidden="true" /></Link></Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((item) => (
                <Link key={item.slug} href={routePath.marketService(market.slug, item.slug)} className="group flex items-center justify-between rounded-xl border border-border/60 bg-blue-50/40 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:bg-blue-950/10 dark:hover:border-blue-800">
                  <span className="flex min-w-0 items-center gap-3 font-medium">
                    {sourceFlag ? <Image src={sourceFlag} alt={`${sourceCountry.name} flag`} width={24} height={16} unoptimized className="h-4 w-6 shrink-0 rounded-[2px] border border-black/10 object-cover" /> : null}
                    <span>{serviceDisplayName(item.name)}</span>
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/50 bg-blue-100/70 p-6 dark:bg-blue-950/30 sm:p-7">
            <Badge variant="secondary">Start with your requirement</Badge>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Find providers offering {displayServiceName} in {service.origin}</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">Share your product or service needs, order details, target budget, and delivery destination in {displayMarket.locationName}.</p>
              </div>
              <Button size="lg" asChild><Link href={routePath.buyers}><Search aria-hidden="true" /> Post a requirement</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter marketName={displayMarket.locationName} marketSlug={market.slug} />
    </main>
  );
}
