"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, PackageSearch, Search, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { productNavigation } from "@/lib/product-navigation";
import { routePath } from "@/url";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const marketSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  const productMarket = ["us", "uk", "india", "in"].includes(marketSegment)
    ? marketSegment
    : "us";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!productsMenuRef.current?.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProductsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        isScrolled
          ? "border-b border-border/40 bg-background/85 shadow-xs backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8">
        <BrandLogo compactOnMobile />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative" ref={productsMenuRef}>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 rounded-lg px-2 text-xs font-semibold sm:px-3 sm:text-sm"
              aria-controls="products-dropdown"
              aria-expanded={isProductsOpen}
              aria-haspopup="menu"
              onClick={() => setIsProductsOpen((open) => !open)}
            >
              <span className="hidden sm:inline">Products</span>
              <span className="sr-only sm:hidden">Products</span>
              <PackageSearch aria-hidden="true" />
              <ChevronDown
                aria-hidden="true"
                className={`hidden size-3.5 transition-transform sm:block ${
                  isProductsOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {isProductsOpen ? (
              <div
                id="products-dropdown"
                role="menu"
                aria-label="Product categories"
                className="fixed inset-x-3 top-[4.5rem] z-[60] max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-border bg-white p-4 text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-zinc-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.75rem)] sm:w-[min(48rem,calc(100vw-3rem))] sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-border/60 pb-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Browse products
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Select a sourcing category
                    </p>
                  </div>
                  <Link
                    href={routePath.productDirectory(productMarket)}
                    role="menuitem"
                    className="rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    View all
                  </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {productNavigation.map((category) => (
                    <section
                      key={category.name}
                      aria-labelledby={`product-category-${category.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                    >
                      <h2
                        id={`product-category-${category.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                        className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {category.name}
                      </h2>
                      <div className="flex flex-col gap-0.5">
                        {category.products.map((product) => (
                          <Link
                            key={product.slug}
                            href={routePath.product(
                              productMarket,
                              product.slug,
                            )}
                            role="menuitem"
                            className="rounded-lg px-2 py-1.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => setIsProductsOpen(false)}
                          >
                            {product.label}
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Button
            size="sm"
            className="h-9 rounded-lg bg-gradient-to-r from-black via-zinc-900 to-neutral-700 px-2 text-xs font-semibold text-white shadow-sm hover:from-neutral-900 hover:via-black hover:to-zinc-800 sm:px-3 sm:text-sm"
            asChild
          >
            <Link href={routePath.buyers}>
              <span className="hidden sm:inline">I&apos;m a Buyer</span>
              <span className="sr-only sm:hidden">I&apos;m a Buyer</span>
              <Search aria-hidden="true" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 rounded-lg border-neutral-800 bg-gradient-to-r from-white via-zinc-50 to-neutral-200 px-2 text-xs font-semibold text-neutral-950 shadow-sm hover:from-neutral-100 hover:via-white hover:to-zinc-200 sm:px-3 sm:text-sm"
            asChild
          >
            <Link href={routePath.sellers}>
              <span className="hidden sm:inline">I&apos;m a Seller</span>
              <span className="sr-only sm:hidden">I&apos;m a Seller</span>
              <Store aria-hidden="true" />
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
