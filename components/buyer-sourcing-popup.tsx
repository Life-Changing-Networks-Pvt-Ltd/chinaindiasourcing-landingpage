"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Check, MapPin, PackageSearch, X } from "lucide-react";

import { BrandMark } from "@/components/brand-logo";
import { routePath } from "@/url";

const POPUP_DELAY_MS = 2000;

const sourcingSteps = [
  "Share your product requirement",
  "Connect with relevant providers",
  "Compare and choose your partner",
];

export function BuyerSourcingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-slate-950/65 p-3 fade-in duration-300 backdrop-blur-[3px] sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="buyer-popup-title"
        aria-describedby="buyer-popup-description"
        className="relative max-h-[calc(100vh-1.5rem)] w-full max-w-4xl animate-in overflow-y-auto rounded-3xl border border-slate-200/80 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.38)] duration-500 zoom-in-95 slide-in-from-bottom-3 dark:border-slate-700 dark:bg-slate-950 sm:max-h-[calc(100vh-3rem)]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close sourcing buyer popup"
          className="absolute right-4 top-4 z-30 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-slate-950/75 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 sm:right-5 sm:top-5"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <Link
          href={routePath.buyers}
          className="group grid text-inherit no-underline md:min-h-[520px] md:grid-cols-[1.08fr_0.92fr]"
          aria-label="Open the sourcing buyer requirement form"
        >
          <div className="order-2 flex flex-col justify-center bg-gradient-to-br from-white via-white to-sky-50/70 p-6 sm:p-9 md:order-1 md:p-11 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/30">
            <div className="mb-7 flex items-center gap-3">
              <BrandMark className="size-10" />
              <div>
                <p className="font-brand text-lg leading-none tracking-wide text-slate-950 dark:text-white">
                  ChinaIndia <span className="text-blue-700 dark:text-sky-300">Sourcing</span>
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Global sourcing marketplace
                </p>
              </div>
            </div>

            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              <PackageSearch className="size-3.5" aria-hidden="true" />
              For sourcing buyers
            </span>

            <h2
              id="buyer-popup-title"
              className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white"
            >
              Find the right sourcing partner for your next product
            </h2>
            <p
              id="buyer-popup-description"
              className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base dark:text-slate-300"
            >
              Share one clear requirement and discover independent sourcing
              agents, inspectors, and logistics providers across global markets.
            </p>

            <div className="mt-5 grid gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                Supplier search and quotation support
              </span>
              <span className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                Quality inspection and factory coordination
              </span>
            </div>

            <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-700 px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-950/20 transition group-hover:-translate-y-0.5 group-hover:shadow-xl dark:from-blue-700 dark:via-blue-600 dark:to-sky-600">
              Post your sourcing requirement
              <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
              Click anywhere on this popup to continue to the buyer form.
            </span>
          </div>

          <div className="relative order-1 min-h-56 overflow-hidden bg-slate-900 md:order-2 md:min-h-full">
            <Image
              src="/images/product-sourcing/Machines.jpg"
              alt="Automated manufacturing equipment available through global sourcing providers"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/15 via-blue-950/20 to-slate-950/90 md:bg-gradient-to-t" />

            <div className="absolute left-4 top-4 flex items-center gap-3 rounded-2xl border border-white/25 bg-white/90 px-3.5 py-3 text-slate-950 shadow-xl backdrop-blur-md sm:left-5 sm:top-5 md:top-6">
              <div className="flex -space-x-2">
                <span className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-white">
                  <Image src="/flags/china.png" alt="China" fill sizes="32px" className="object-cover" />
                </span>
                <span className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-white">
                  <Image src="/flags/india.png" alt="India" fill sizes="32px" className="object-cover" />
                </span>
              </div>
              <div>
                <p className="text-xs font-bold">China, India &amp; beyond</p>
                <p className="text-[10px] text-slate-600">Multiple sourcing markets</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/70 p-4 text-white shadow-2xl backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-sky-200">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  Your sourcing journey
                </span>
                <BadgeCheck className="size-5 text-emerald-300" aria-hidden="true" />
              </div>
              <div className="grid gap-2.5">
                {sourcingSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[10px] font-bold text-sky-100">
                      {index + 1}
                    </span>
                    <span className="text-slate-100">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
