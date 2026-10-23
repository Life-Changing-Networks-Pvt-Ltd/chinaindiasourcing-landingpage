import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Boxes, Factory, Search, SearchCheck } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BuyerMarket } from "@/lib/markets";
import { getProductPage, productCategories, productPagePath } from "@/lib/products";
import { routePath } from "@/url";

export function ProductDirectoryPage({
  market,
  country,
}: {
  market: BuyerMarket;
  country: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border/50 bg-blue-50/45 py-12 dark:bg-blue-950/10 sm:py-16">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-24 -top-28 size-96 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-700/10" />
            <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-700/10" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Badge variant="outline" className="rounded-full bg-background/60">
              <Factory className="mr-2 size-4 text-blue-600 dark:text-cyan-400" />
              China product sourcing directory
            </Badge>
            <h1 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Source Products from China for {market.name} Buyers
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Browse verified product sourcing categories and connect with capable manufacturers, buying agents, and inspection partners in China.
            </p>
            <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-xl border border-border/50 bg-background/70 px-4 py-2 text-sm shadow-xs">
              <SearchCheck className="size-4 text-blue-600 dark:text-cyan-400" />
              <span>35 product categories across 9 major sourcing industries</span>
            </div>
          </div>
        </section>

        <section className="bg-slate-50/45 py-12 dark:bg-slate-950/20 sm:py-16">
          <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
            {productCategories.map((category) => (
              <section key={category.slug} aria-labelledby={`category-${category.slug}`}>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    <Boxes className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                      Sourcing Category
                    </p>
                    <h2 id={`category-${category.slug}`} className="text-2xl font-bold">
                      {category.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.products.map((slug) => {
                    const page = getProductPage(country, slug);
                    if (!page) return null;
                    return (
                      <Card
                        key={slug}
                        className="group overflow-hidden border-border/50 bg-white p-0 shadow-none transition-all hover:shadow-md dark:bg-slate-950"
                      >
                        <Link
                          href={productPagePath(country, slug)}
                          className="flex h-full items-center gap-4 p-4"
                        >
                          <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
                            {page.heroImage ? (
                              <Image
                                src={page.heroImage}
                                alt={page.name}
                                width={160}
                                height={160}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <Boxes className="m-6 size-8 text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold leading-snug group-hover:text-blue-700 dark:group-hover:text-cyan-300">
                              {page.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                              {page.seoDescription}
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-cyan-300">
                              Explore category <ArrowRight className="size-3" />
                            </span>
                          </div>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-border/50 py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/50 bg-blue-100/70 p-6 dark:bg-blue-950/30 sm:p-7">
              <Badge variant="secondary">Start with your requirement</Badge>
              <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Not sure which China factory fits your needs?
                  </h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">
                    Share the product, required quantity, target budget, and delivery destination in {market.locationName} so relevant independent manufacturers and agents can respond.
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
