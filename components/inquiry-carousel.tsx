"use client";

import * as React from "react";
import {
  Building2,
  CalendarClock,
  Eye,
  Globe2,
  Mail,
  PackageSearch,
  Phone,
  BadgeCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import inquiryData from "@/data/inquiries.json";

export type Inquiry = {
  id: number | string;
  timestamp: string;
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  address: string;
  product: string;
  quantity: string;
  budget: string;
  importedBefore: string;
  company: string;
  dealingStatus: string;
  website: string;
  importFrom: string;
  country?: string;
  paymentSuccessful?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
};

const cardTones = [
  "bg-blue-100/75 dark:bg-blue-950/35",
  "bg-cyan-100/75 dark:bg-cyan-950/35",
  "bg-violet-100/75 dark:bg-violet-950/35",
  "bg-emerald-100/70 dark:bg-emerald-950/30",
  "bg-amber-100/70 dark:bg-amber-950/30",
  "bg-rose-100/70 dark:bg-rose-950/30",
];

function maskName(value: string) {
  const clean = value.trim();
  if (!clean) return "Not provided";
  return `${clean.slice(0, Math.min(3, clean.length))}xxx`;
}

function maskPhone(value: string) {
  const clean = value.trim();
  if (!clean) return "Not provided";
  const visible = clean.startsWith("+") ? 6 : 4;
  return `${clean.slice(0, Math.min(visible, clean.length))}xxxxxx`;
}

function maskEmail(value: string, name: string) {
  const clean = value.trim();
  if (!clean) {
    const nameLetters = name
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .slice(0, 3) || "buy";
    return `${nameLetters}xxxx@gmail.com`;
  }
  const atIndex = clean.indexOf("@");
  if (atIndex > 1) {
    return `${clean.slice(0, 2)}xxxxxx${clean.slice(atIndex)}`;
  }
  const nameLetters = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 3) || "buy";
  return `${nameLetters}xxxx@gmail.com`;
}

function hasUsefulValue(value: string) {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !["na", "n/a", "none", "not provided", "-"].includes(normalized);
}

function companyName(inquiry: Inquiry) {
  return hasUsefulValue(inquiry.company) ? inquiry.company.trim() : "Company profile";
}

function companyWebsiteHost(value: string) {
  if (!hasUsefulValue(value)) return null;

  const hostname = value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#\s(]/, 1)[0]
    .toLowerCase();

  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(hostname)
    ? hostname
    : null;
}

const companyFallbackImages = [
  "/images/sourcing/import-agent.svg",
  "/images/sourcing/product-sourcing-agent.svg",
  "/images/sourcing/dropshipping-agent.svg",
  "/images/sourcing/dropshipping-sourcing-agent.svg",
  "/images/sourcing/india-sourcing-agent.svg",
];

function CompanyMark({ inquiry }: { inquiry: Inquiry }) {
  const name = companyName(inquiry);
  const isLiveRegistration = typeof inquiry.id === "string";
  if (isLiveRegistration) {
    return (
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-blue-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-blue-300">
        <Building2 className="size-6" aria-hidden="true" />
        <span className="sr-only">No company logo provided</span>
      </span>
    );
  }
  const hostname = companyWebsiteHost(inquiry.website);
  const fallbackIndex = typeof inquiry.id === "number"
    ? Math.max(0, inquiry.id - 1)
    : inquiry.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const fallbackSrc = companyFallbackImages[fallbackIndex % companyFallbackImages.length];
  const logoSrc = hostname
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
    : fallbackSrc;

  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
      <img
        src={logoSrc}
        alt={hostname ? `${name} logo` : `${name} business illustration`}
        width={48}
        height={48}
        className={`size-full bg-white ${hostname ? "object-contain p-1.5" : "object-cover"}`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackSrc;
          event.currentTarget.className = "size-full bg-white object-cover";
        }}
      />
    </span>
  );
}

function maskAddress(value: string) {
  const clean = value.trim();
  if (!clean) return "Not provided";
  const parts = clean
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 3) {
    const publicArea = parts.slice(-2).join(", ");
    return `xxxx, xxxx, ${publicArea}`;
  }
  if (parts.length === 2) {
    return `xxxx, ${parts[1]}`;
  }
  return `${clean.slice(0, Math.min(4, clean.length))}xxxxxx`;
}

function sourceCountry(value: string) {
  if (value.trim().toLowerCase().includes("any")) return "Any listed country";
  return value.trim() || "Not specified";
}

function buyerCountry(inquiry: Inquiry) {
  if (inquiry.country?.trim()) return inquiry.country.trim();
  const address = inquiry.address.toLowerCase();
  const contact = `${inquiry.mobile} ${inquiry.whatsapp}`.replace(/[^0-9+]/g, "");

  const addressCountries: Array<[RegExp, string]> = [
    [/\b(pakistan|karachi)\b/, "Pakistan"],
    [/\b(bangladesh|dhaka)\b/, "Bangladesh"],
    [/\b(nigeria|lagos)\b/, "Nigeria"],
    [/\b(south africa|drummond)\b/, "South Africa"],
    [/\b(usa|united states|philadelphia|pennsylvania|myrtle beach|yonkers|new york|roswell)\b|\broswell,?\s+ga\b/, "United States"],
    [/\b(india|delhi|mumbai|maharashtra|kerala|karnataka|bengaluru|bangalore|hyderabad|telangana|rajasthan|gujarat|tamil nadu|uttar pradesh|west bengal|punjab|haryana|odisha|assam|bihar|jharkhand|noida|surat|ranchi|ernakulam|himatnagar|jamnagar|gurgaon|faridabad|ghaziabad|pune|chennai|kolkata|ahmedabad|jaipur|lucknow|indore|bhopal|patna|vadodara|ludhiana|agra|nashik|varanasi|meerut)\b/, "India"],
  ];

  const addressMatch = addressCountries.find(([pattern]) => pattern.test(address));
  if (addressMatch) return addressMatch[1];
  if (/\b[1-9][0-9]{5}\b/.test(address)) return "India";
  if (/^\+?880/.test(contact)) return "Bangladesh";
  if (/^\+?92/.test(contact)) return "Pakistan";
  if (/^\+?234/.test(contact)) return "Nigeria";
  if (/^\+?27/.test(contact)) return "South Africa";
  if (/^\+?1\b/.test(contact) || contact.startsWith("1")) {
    if (contact.length >= 10 && !contact.startsWith("91")) return "United States";
  }
  return "India";
}

function getCountryFlag(countryName: string): string | null {
  const normalized = countryName.trim().toLowerCase();
  if (normalized.includes("india")) return "/flags/india.svg";
  if (normalized.includes("china")) return "/flags/china.svg";
  if (
    normalized.includes("united states") ||
    normalized.includes("usa") ||
    normalized === "us"
  )
    return "/flags/united-states.svg";
  if (normalized.includes("pakistan")) return "/flags/pakistan.svg";
  if (normalized.includes("bangladesh")) return "/flags/bangladesh.svg";
  if (normalized.includes("south africa")) return "/flags/south-africa.svg";
  if (normalized.includes("nigeria")) return "/flags/nigeria.svg";
  if (normalized.includes("vietnam")) return "/flags/vietnam.svg";
  if (normalized.includes("germany")) return "/flags/germany.svg";
  if (normalized.includes("united kingdom") || normalized === "uk")
    return "/flags/uk.svg";
  if (normalized.includes("australia")) return "/flags/australia.svg";
  if (normalized.includes("canada")) return "/flags/canada.svg";
  if (normalized.includes("emirates") || normalized === "uae")
    return "/flags/uae.svg";
  if (normalized.includes("new zealand")) return "/flags/new-zealand.svg";
  return null;
}

function CountryFlagMark({ countryName }: { countryName: string }) {
  const flagSrc = getCountryFlag(countryName);
  if (!flagSrc) {
    return (
      <Globe2
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    );
  }
  return (
    <img
      src={flagSrc}
      alt=""
      width={18}
      height={12}
      className="inline-block h-3 w-4.5 shrink-0 rounded-[2px] border border-black/15 object-cover shadow-2xs dark:border-white/20"
      aria-hidden="true"
    />
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/80 p-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-base leading-6">
        {value.trim() || "Not provided"}
      </dd>
    </div>
  );
}

function InquirySummaryCard({
  inquiry,
  index,
  onSelect,
}: {
  inquiry: Inquiry;
  index: number;
  onSelect: (inquiry: Inquiry) => void;
}) {
  const buyerFrom = buyerCountry(inquiry);
  const sourceFrom = sourceCountry(inquiry.importFrom);

  return (
    <Card className={`h-full min-h-[23rem] border-white/60 shadow-none ${cardTones[index % cardTones.length]}`}>
      <CardContent className="flex h-full flex-col px-5">
        <div className="mb-4 flex items-start justify-between gap-2 border-b border-black/5 pb-3 dark:border-white/10">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs leading-tight text-muted-foreground">
              <span>Buyers From :</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <CountryFlagMark countryName={buyerFrom} />
                <span className="truncate">{buyerFrom}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs leading-tight text-muted-foreground">
              <span>Source From :</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <CountryFlagMark countryName={sourceFrom} />
                <span className="truncate">{sourceFrom}</span>
              </span>
            </div>
          </div>
          {typeof inquiry.id === "number" && (
            <span className="shrink-0 text-sm font-medium text-muted-foreground">
              #{String(inquiry.id).padStart(3, "0")}
            </span>
          )}
        </div>

        <div className="mb-4 flex min-w-0 items-center gap-3">
          <CompanyMark inquiry={inquiry} />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Company</p>
            <p className="truncate font-semibold" title={companyName(inquiry)}>{companyName(inquiry)}</p>
          </div>
        </div>

        {(inquiry.paymentSuccessful || inquiry.emailVerified || inquiry.phoneVerified) && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {inquiry.paymentSuccessful && <Badge className="bg-emerald-600 text-white hover:bg-emerald-600"><BadgeCheck /> Payment Verified</Badge>}
            {inquiry.emailVerified && <Badge variant="secondary"><Mail /> Email Verified</Badge>}
            {inquiry.phoneVerified && <Badge variant="secondary"><Phone /> Phone Verified</Badge>}
          </div>
        )}

        <dl className="space-y-3">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0"><dt className="text-sm text-muted-foreground">Name</dt><dd className="mt-0.5 truncate font-medium">{maskName(inquiry.name)}</dd></div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0"><dt className="text-sm text-muted-foreground">Email</dt><dd className="mt-0.5 truncate font-medium">{maskEmail(inquiry.email, inquiry.name)}</dd></div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0"><dt className="text-sm text-muted-foreground">Phone</dt><dd className="mt-0.5 truncate font-medium">{maskPhone(inquiry.mobile)}</dd></div>
          </div>
        </dl>

        <Button variant="outline" className="mt-auto w-full bg-white/70 hover:bg-white dark:bg-black/15 dark:hover:bg-black/25" onClick={() => onSelect(inquiry)} aria-label={`View complete details for ${inquiry.name}`}>
          <Eye aria-hidden="true" /> View details
        </Button>
      </CardContent>
    </Card>
  );
}

export function InquiryCarousel({
  inquiries = inquiryData as Inquiry[],
  layout = "carousel",
  limit,
  includeLive = false,
}: {
  inquiries?: Inquiry[];
  layout?: "carousel" | "grid";
  limit?: number;
  includeLive?: boolean;
}) {
  const [selected, setSelected] = React.useState<Inquiry | null>(null);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const carouselRoot = React.useRef<HTMLDivElement>(null);
  const wheelLocked = React.useRef(false);
  const [liveInquiries, setLiveInquiries] = React.useState<Inquiry[]>([]);
  const mergedInquiries = includeLive ? [...liveInquiries, ...inquiries] : inquiries;
  const visibleInquiries = typeof limit === "number" ? mergedInquiries.slice(0, limit) : mergedInquiries;

  React.useEffect(() => {
    if (!includeLive) return;
    let cancelled = false;
    const apiBase = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1").replace(/\/+$/, "");
    void fetch(`${apiBase}/market/directory/buyers?limit=${limit || 12}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to load buyers")))
      .then((result) => { if (!cancelled && Array.isArray(result?.data)) setLiveInquiries(result.data); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [includeLive, limit]);

  React.useEffect(() => {
    const viewport = carouselRoot.current?.querySelector<HTMLElement>(
      '[data-slot="carousel-content"]',
    );
    if (!viewport || !carouselApi) return;

    const handleWheel = (event: WheelEvent) => {
      const horizontalMovement =
        Math.abs(event.deltaX) > 4
          ? event.deltaX
          : event.shiftKey && Math.abs(event.deltaY) > 4
            ? event.deltaY
            : 0;

      if (!horizontalMovement) return;
      event.preventDefault();
      if (wheelLocked.current) return;

      wheelLocked.current = true;
      if (horizontalMovement > 0) carouselApi.scrollNext();
      else carouselApi.scrollPrev();

      window.setTimeout(() => {
        wheelLocked.current = false;
      }, 240);
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [carouselApi]);

  return (
    <>
      {layout === "grid" ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Buyer requirements">
          {visibleInquiries.map((inquiry, index) => <InquirySummaryCard key={inquiry.id} inquiry={inquiry} index={index} onSelect={setSelected} />)}
        </div>
      ) : (
        <Carousel ref={carouselRoot} setApi={setCarouselApi} opts={{ align: "start", loop: true }} className="mt-7" aria-label="Buyer requirements">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex shrink-0 gap-2">
              <CarouselPrevious className="static size-10 translate-y-0 bg-background/90 shadow-sm" />
              <CarouselNext className="static size-10 translate-y-0 bg-background/90 shadow-sm" />
            </div>
          </div>
          <CarouselContent className="-ml-3 md:-ml-4">
            {visibleInquiries.map((inquiry, index) => (
              <CarouselItem key={inquiry.id} className="basis-[88%] pl-3 sm:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/5">
                <InquirySummaryCard inquiry={inquiry} index={index} onSelect={setSelected} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="grid max-h-[92dvh] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden border-border/60 p-0 sm:max-w-3xl">
            <DialogHeader className="border-b border-border/60 bg-blue-100/70 p-6 pr-14 dark:bg-blue-950/40">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="flex items-center gap-1.5">
                  <span>Buyers From :</span>
                  <CountryFlagMark countryName={buyerCountry(selected)} />
                  <span>{buyerCountry(selected)}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1.5">
                  <span>Source From :</span>
                  <CountryFlagMark countryName={sourceCountry(selected.importFrom)} />
                  <span>{sourceCountry(selected.importFrom)}</span>
                </Badge>
                <Badge variant="outline" className="bg-background/60">
                  Request #{String(selected.id).padStart(3, "0")}
                </Badge>
              </div>
              <DialogTitle className="mt-2 text-2xl leading-tight">{maskName(selected.name)}</DialogTitle>
          
            </DialogHeader>

            <div className="scrollbar-thin min-h-0 overscroll-contain overflow-y-scroll p-6">
              <section>
                <h3 className="flex items-center gap-2 font-semibold">
                  <CalendarClock className="size-4" aria-hidden="true" /> Submission
                </h3>
                <dl className="mt-3 grid gap-3">
                  <Field label="Timestamp" value={selected.timestamp} />
                </dl>
              </section>

              <section className="mt-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <UserRound className="size-4" aria-hidden="true" /> Contact details
                </h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Full name" value={maskName(selected.name)} />
                  <Field label="Email" value={maskEmail(selected.email, selected.name)} />
                  <Field label="Mobile number with country code" value={maskPhone(selected.mobile)} />
                  <Field label="WhatsApp number with country code" value={maskPhone(selected.whatsapp)} />
                  <div className="sm:col-span-2">
                    <Field label="Full address with pin code" value={maskAddress(selected.address)} />
                  </div>
                </dl>
              </section>

              <section className="mt-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <PackageSearch className="size-4" aria-hidden="true" /> Requirement
                </h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Field label="Product and specifications" value={selected.product} /></div>
                  <Field label="Product quantity" value={selected.quantity} />
                  <Field label="Budget for importing" value={selected.budget} />
                  <Field label="Have you imported from China before?" value={selected.importedBefore} />
                  <Field label="Where would you like to import from?" value={selected.importFrom} />
                </dl>
              </section>

              <section className="mt-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Building2 className="size-4" aria-hidden="true" /> Business details
                </h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Company name" value={selected.company} />
                  <Field label="Company website" value={selected.website} />
                  <div className="sm:col-span-2"><Field label="Are you currently dealing in these products?" value={selected.dealingStatus} /></div>
                </dl>
              </section>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
