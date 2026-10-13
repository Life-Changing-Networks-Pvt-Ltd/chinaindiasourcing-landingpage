"use client";

import { useEffect, useState } from "react";
import { Search, Store } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { routePath } from "@/url";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        isScrolled
          ? "border-b border-border/40 bg-background/85 shadow-xs backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <BrandLogo compactOnMobile />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            className="h-9 rounded-lg bg-gradient-to-r from-black via-zinc-900 to-neutral-700 px-2 text-xs font-semibold text-white shadow-sm hover:from-neutral-900 hover:via-black hover:to-zinc-800 sm:px-3 sm:text-sm"
            asChild
          >
            <Link href={routePath.buyers}>I&apos;m a Buyer<Search aria-hidden="true" /></Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 rounded-lg border-neutral-800 bg-gradient-to-r from-white via-zinc-50 to-neutral-200 px-2 text-xs font-semibold text-neutral-950 shadow-sm hover:from-neutral-100 hover:via-white hover:to-zinc-200 sm:px-3 sm:text-sm"
            asChild
          >
            <Link href={routePath.sellers}>I&apos;m a Seller<Store aria-hidden="true" /></Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
