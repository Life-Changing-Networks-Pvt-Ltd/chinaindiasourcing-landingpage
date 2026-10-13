import Link from "next/link";

import { cn } from "@/lib/utils";
import { routePath } from "@/url";

type BrandLogoProps = {
  className?: string;
  compactOnMobile?: boolean;
  inverted?: boolean;
};

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="ChinaIndia Sourcing"
      className={cn("size-9 shrink-0", className)}
    >
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#f0f9ff" stroke="#bfdbfe" strokeWidth="2" />
      <path d="M9.5 18.5C13.5 9.5 27 7.5 37 14" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="4" />
      <path d="M38.5 29.5C34.5 38.5 21 40.5 11 34" fill="none" stroke="#0ea5e9" strokeLinecap="round" strokeWidth="4" />
      <path d="m30.5 11.5 6.7 2.3-2.3 6.7M17.5 36.5l-6.7-2.3 2.3-6.7" fill="none" stroke="#1e40af" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.7" />
      <circle cx="11" cy="18" r="3" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
      <circle cx="37" cy="30" r="3" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

export function BrandLogo({ className, compactOnMobile = false, inverted = false }: BrandLogoProps) {
  return (
    <Link href={routePath.home} className={cn("group inline-flex items-center gap-2.5", className)} aria-label="ChinaIndia Sourcing home">
      <BrandMark className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
      <span
        className={cn(
          "font-brand whitespace-nowrap text-[1.45rem] leading-none tracking-[0.025em] sm:text-[1.6rem]",
          compactOnMobile && "hidden sm:inline",
          inverted ? "text-white" : "text-slate-950 dark:text-white",
        )}
      >
        ChinaIndia<span className={inverted ? "text-sky-300" : "text-blue-700 dark:text-sky-300"}> Sourcing</span>
      </span>
    </Link>
  );
}
