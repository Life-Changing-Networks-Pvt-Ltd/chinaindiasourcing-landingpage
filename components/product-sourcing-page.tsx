import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Boxes,
  ChevronRight,
  ClipboardCheck,
  Factory,
  PackageCheck,
  Search,
  ShieldCheck,
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
  getProductPage,
  productCategories,
  productDirectoryPath,
  productItemPath,
  productPagePath,
  type ProductCard,
  type ProductSourcingPage as ProductPageData,
} from "@/lib/products";
import { routePath } from "@/url";

function formatPrice(product: ProductCard) {
  if (!product.price || !product.currency) return "Request quote";
  return `${product.currency}${product.price.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

function ProductImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-900 ${className || ""}`}>
        <Boxes className="size-14 text-blue-500/45" aria-hidden="true" />
      </div>
    );
  }
  return <Image src={src} alt={alt} width={960} height={720} className={className} />;
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

export function ProductSourcingPage({
  market,
  page,
  country,
}: {
  market: BuyerMarket;
  page: ProductPageData;
  country: string;
}) {
  const isTitleMarketSpecific =
    page.heroTitle.toLowerCase().includes(market.name.toLowerCase()) ||
    page.heroTitle.toLowerCase().includes("usa") ||
    page.heroTitle.toLowerCase().includes("us");

  const pageTitle = isTitleMarketSpecific
    ? page.heroTitle
    : `${page.heroTitle} for ${market.name} Buyers`;

  const destinationFlag = countryFlagAsset(market.name);
  const siblingSlugs =
    productCategories.find((category) => category.slug === page.categorySlug)?.products || [];
  const siblingPages = siblingSlugs
    .map((slug) => getProductPage(country, slug))
    .filter((item): item is ProductPageData => Boolean(item));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pageTitle,
      description: page.heroIntro || page.seoDescription,
      about: {
        "@type": "Product",
        name: page.name,
        areaServed: { "@type": "Place", name: market.locationName },
      },
      audience: {
        "@type": "BusinessAudience",
        audienceType: `${market.name} buyers and importers`,
      },
      publisher: { "@type": "Organization", name: "ChinaIndiaSourcing" },
    },
    ...(page.faqs && page.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <SourcePageIntro title={pageTitle} />
      <TopSellersListing countryName="China" />

      <section
        id="requests"
        className="scroll-mt-20 border-b border-border/50 bg-slate-50/55 py-10 dark:bg-slate-950/20 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Recent Buyers Leads for Sourcing
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Worldwide buyers who want to source {page.name.toLowerCase()} from China
              </p>
            </div>
            <Badge variant="secondary" className="w-fit px-3 py-1.5 text-sm">
              Live requests
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

      {page.products && page.products.length > 0 && (
        <section
          id="products"
          className="scroll-mt-20 border-b border-border/50 bg-background py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <Badge variant="secondary">Product options</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Explore {page.name.toLowerCase()} sourcing options
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Product details, MOQs, customization, certifications, and quotations are confirmed with the selected independent supplier.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href={productDirectoryPath(country)}>
                  View all products <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.products.map((product) => (
                <Card
                  key={product.slug}
                  className="group overflow-hidden border-border/50 bg-white shadow-none transition-all hover:shadow-md dark:bg-slate-950"
                >
                  <Link
                    href={productItemPath(country, page.slug, product.slug)}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold leading-snug group-hover:text-blue-700 dark:group-hover:text-cyan-300">
                          {product.name}
                        </h3>
                        <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-end justify-between gap-4 border-t border-border/40 pt-3">
                        <div>
                          <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                            Indicative price
                          </span>
                          <strong className="mt-0.5 block text-base font-semibold">
                            {formatPrice(product)}
                          </strong>
                        </div>
                        <span className="text-xs font-semibold text-blue-700 dark:text-cyan-300">
                          View details →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.sections && page.sections.length > 0 && (
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
                Sourcing in China
              </Badge>
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              <Badge variant="outline" className="gap-2 bg-background/70">
                {destinationFlag ? (
                  <Image
                    src={destinationFlag}
                    alt={`${market.name} flag`}
                    width={24}
                    height={16}
                    className="h-4 w-6 rounded-[2px] border border-black/10 object-cover"
                  />
                ) : null}
                Buyers in {market.locationName}
              </Badge>
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              What to know before sourcing {page.name.toLowerCase()} from China
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              {page.heroIntro ||
                `Use this practical guide to prepare for sourcing ${page.name.toLowerCase()}, compare independent Chinese manufacturers, and coordinate delivery to ${market.locationName}.`}
            </p>
            <ol className="mt-10 divide-y divide-blue-100 border-y border-blue-100 dark:divide-blue-950 dark:border-blue-950">
              {page.sections.map((section, index) => (
                <li
                  key={`${section.title}-${index}`}
                  className="grid gap-4 py-7 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                    <div className="mt-2 space-y-3 leading-7 text-foreground/75">
                      {section.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}
                    </div>
                    {section.highlights && section.highlights.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {section.highlights.map((highlight, hIndex) => (
                          <Badge
                            key={hIndex}
                            variant="outline"
                            className="gap-1.5 border-blue-200 bg-white/80 px-3 py-1 text-xs font-medium text-foreground dark:border-blue-900 dark:bg-slate-900"
                          >
                            <PackageCheck
                              className="size-3.5 text-blue-600 dark:text-cyan-400"
                              aria-hidden="true"
                            />
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </section>
      )}

      <section
        id="process"
        className="scroll-mt-20 border-b border-border/50 bg-background py-12 sm:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">How it works</h2>
            <p className="mt-3 text-base font-medium text-foreground/80 sm:text-lg">
              From a clear requirement to verified manufacturers
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Factory,
                title: "Supplier discovery",
                description: `Compare capable ${page.name.toLowerCase()} factories in China matching your requirements.`,
              },
              {
                icon: ClipboardCheck,
                title: "Specification review",
                description: "Align product specifications, materials, packaging, MOQ, and target landed cost.",
              },
              {
                icon: ShieldCheck,
                title: "Quality checkpoints",
                description: "Plan pre-production samples, factory audits, and pre-shipment inspections.",
              },
              {
                icon: Ship,
                title: "Shipping coordination",
                description: `Coordinate freight forwarding, customs clearance, and delivery to ${market.locationName}.`,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="h-full border-border/50 bg-blue-50/45 shadow-none dark:bg-blue-950/15"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-lg leading-6">{step.title}</CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <PlatformFeatures
        serviceName={`${page.name} Sourcing`}
        marketName={market.locationName}
      />

      {page.faqs && page.faqs.length > 0 && (
        <section className="border-b border-blue-100 bg-blue-50/45 py-12 dark:border-blue-950 dark:bg-blue-950/10 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <div>
              <Badge variant="secondary">Frequently asked questions</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Common {page.name.toLowerCase()} questions
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Use these answers to prepare before discussing your requirement with verified suppliers.
              </p>
            </div>
            <div className="divide-y divide-blue-100 rounded-2xl border border-blue-100 bg-white px-5 shadow-sm dark:divide-blue-950 dark:border-blue-950 dark:bg-slate-950 sm:px-6">
              {page.faqs.map((faq) => (
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
                  <p className="mt-3 pr-8 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {siblingPages.length > 0 && (
        <section className="bg-background py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Continue building your sourcing plan
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  More sourcing categories in {page.category}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href={productDirectoryPath(country)}>
                  View all products <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblingPages
                .filter((item) => item.slug !== page.slug)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={productPagePath(country, item.slug)}
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
                      <span className="truncate">{item.name}</span>
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
      )}

      <section className="pb-10 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/50 bg-blue-100/70 p-6 dark:bg-blue-950/30 sm:p-7">
            <Badge variant="secondary">Start with your requirement</Badge>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Find verified {page.name.toLowerCase()} suppliers in China
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Share your product or service needs, order details, target budget, and delivery destination in {market.locationName}.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href={routePath.buyers}>
                  <Search aria-hidden="true" /> Post a requirement
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter marketName={market.locationName} marketSlug={market.slug} />
    </main>
  );
}

export { ProductImage, formatPrice };
