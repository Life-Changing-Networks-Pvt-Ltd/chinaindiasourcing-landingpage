import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
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
import { ProductImage, formatPrice } from "@/components/product-sourcing-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopSellersListing } from "@/components/top-sellers-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuyerMarket } from "@/lib/markets";
import {
  productDirectoryPath,
  productItemPath,
  productPagePath,
  type ProductCard,
  type ProductSourcingPage,
} from "@/lib/products";
import { routePath } from "@/url";

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

export function ProductSourcingItemPage({
  market,
  page,
  product,
  country,
}: {
  market: BuyerMarket;
  page: ProductSourcingPage;
  product: ProductCard;
  country: string;
}) {
  const destinationFlag = countryFlagAsset(market.name);
  const related = page.products.filter((item) => item.slug !== product.slug).slice(0, 3);

  const processSteps = [
    {
      icon: Factory,
      title: "Factory matching",
      description: "Compare verified Chinese factories against your product brief, specs, and volume requirements.",
    },
    {
      icon: ClipboardCheck,
      title: "Commercial checks",
      description: "Confirm target MOQ, tooling, sample schedules, price bands, and production lead times.",
    },
    {
      icon: ShieldCheck,
      title: "Quality planning",
      description: "Define inspection checkpoints, tolerance standards, and compliance certifications.",
    },
    {
      icon: PackageCheck,
      title: "Delivery readiness",
      description: `Coordinate export packaging, documentation, customs clearance, and shipping to ${market.name}.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        {/* Product Hero Section */}
        <section className="hero-ambient-flow border-b border-border/50 bg-blue-50/30 dark:bg-blue-950/10">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <Link href={routePath.home} className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="size-4" aria-hidden="true" />
              <Link href={productDirectoryPath(country)} className="hover:text-foreground">
                Products
              </Link>
              <ChevronRight className="size-4" aria-hidden="true" />
              <Link href={productPagePath(country, page.slug)} className="hover:text-foreground">
                {page.name}
              </Link>
              <ChevronRight className="size-4" aria-hidden="true" />
              <span className="min-w-0 font-medium text-foreground">{product.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <Card className="overflow-hidden border-border/50 bg-white p-4 shadow-sm dark:bg-slate-950">
                <ProductImage
                  src={product.image || page.heroImage}
                  alt={product.name}
                  className="aspect-[4/3] w-full rounded-xl object-contain p-4"
                />
              </Card>

              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <Image
                      src="/flags/china.svg"
                      alt="China flag"
                      width={20}
                      height={14}
                      className="rounded-[2px] border border-black/10 object-cover"
                    />
                    China sourcing
                  </Badge>
                  <Badge variant="outline" className="bg-background/70">
                    <BadgeCheck className="mr-1.5 size-3.5 text-blue-600 dark:text-cyan-400" />
                    {product.badge || "Verified option"}
                  </Badge>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                  {page.category}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {product.description}
                </p>

                {product.delivery && (
                  <p className="mt-4 flex items-start gap-3 rounded-xl border border-border/50 bg-background/70 p-3.5 text-sm leading-6">
                    <Ship className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-cyan-400" />
                    <span>{product.delivery}</span>
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-baseline gap-4 border-t border-border/50 pt-4">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Indicative source price
                    </span>
                    <strong className="mt-1 block text-2xl font-bold">
                      {formatPrice(product)}
                    </strong>
                  </div>
                  {product.compareAtPrice && product.currency && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.currency}
                      {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link href={routePath.buyers}>
                      Request supplier quotes <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href={productPagePath(country, page.slug)}>
                      <ArrowLeft aria-hidden="true" /> Back to {page.name}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="process" className="scroll-mt-20 border-b border-border/50 bg-background py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">How it works</h2>
              <p className="mt-3 text-base font-medium text-foreground/80 sm:text-lg">
                From specification review to delivery in {market.name}
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => {
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

        {/* Sourcing Guide / Overview Section */}
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
              Source {product.name} from China
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
              {page.seoDescription}
            </p>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-950 dark:bg-slate-950 sm:p-8">
              <h3 className="text-xl font-semibold">How to order & customize</h3>
              <p className="mt-3 text-base leading-7 text-foreground/75">
                Submit your required materials, dimensions, branding, packaging, certifications, order quantity, and delivery destination in {market.locationName}. ChinaIndiaSourcing connects buyers with verified independent sourcing partners, buying agents, and factories in China. Final specifications, sample approvals, and commercial terms are confirmed directly with the selected provider.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Custom branding & private label packaging",
                  "Direct factory negotiation & FOB pricing",
                  "Sample production & specification sign-off",
                  "Quality inspection before dispatch",
                  "Export documentation & customs clearance",
                  `Door-to-door freight to ${market.locationName}`,
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm font-medium text-foreground/85">
                    <CheckCircle2 className="size-4 shrink-0 text-blue-600 dark:text-cyan-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        {/* Top Verified Sellers */}
        <TopSellersListing countryName="China" />

        {/* Live Buyer Requests */}
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
                  Worldwide buyers who want to source from the China market
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

        {/* Platform Features */}
        <PlatformFeatures
          serviceName={`${product.name} Sourcing`}
          marketName={market.locationName}
        />

        {/* Related Options */}
        {related.length > 0 && (
          <section className="border-b border-border/50 bg-background py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Badge variant="secondary">Related options</Badge>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    More {page.name.toLowerCase()} options
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Compare other products in {page.name}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={productPagePath(country, page.slug)}>
                    View all {page.name.toLowerCase()} <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Card
                    key={item.slug}
                    className="group overflow-hidden border-border/50 bg-white shadow-none transition-all hover:shadow-md dark:bg-slate-950"
                  >
                    <Link
                      href={productItemPath(country, page.slug, item.slug)}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="aspect-[4/3] w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        />
                        {item.badge && (
                          <span className="absolute left-3 top-3 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-semibold leading-snug group-hover:text-blue-700 dark:group-hover:text-cyan-300">
                          {item.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="mt-4 flex items-end justify-between gap-4 border-t border-border/40 pt-3">
                          <div>
                            <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                              Indicative price
                            </span>
                            <strong className="mt-0.5 block text-base font-semibold">
                              {formatPrice(item)}
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

        {/* Bottom CTA Banner */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/50 bg-blue-100/70 p-6 dark:bg-blue-950/30 sm:p-7">
              <Badge variant="secondary">Start with your requirement</Badge>
              <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Ready to source {product.name}?
                  </h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    Share your product specifications, target volume, budget, and destination in {market.locationName} to compare verified manufacturers.
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
      </main>
      <SiteFooter marketName={market.locationName} marketSlug={market.slug} />
    </div>
  );
}
