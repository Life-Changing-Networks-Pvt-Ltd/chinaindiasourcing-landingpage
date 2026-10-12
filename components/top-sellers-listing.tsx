"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BadgeCheck, CircleAlert, Eye, Mail, MapPin, Phone, Send, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { routePath } from "@/url";
import spreadsheetSellers from "@/data/sourcing-agents.json";

type SellerProfile = {
  id: string;
  name: string;
  companyName: string;
  title: string;
  location: string;
  city: string;
  country: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  countries?: string[];
  verified: boolean;
  about?: string;
  services?: string[];
  turnaroundTime?: string;
  moq?: string;
};

type SellerResponse = { success: boolean; data?: SellerProfile[] };

const sourcingDirectory = spreadsheetSellers as SellerProfile[];
const SELLERS_PER_PAGE = 12;

const apiBaseUrl = String(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1",
).replace(/\/+$/, "");

function spreadsheetSellersFor(countryName: string) {
  const country = countryName.trim().toLowerCase();
  if (country === "all") return sourcingDirectory;
  if (country === "china" || country === "india") {
    return sourcingDirectory.filter((seller) =>
      (seller.countries || [seller.country]).some((value) => value.toLowerCase() === country),
    );
  }
  return null;
}

function countryFlag(countryName: string) {
  const countryFlags: Record<string, string> = {
    china: "china",
    india: "india",
    vietnam: "vietnam",
    taiwan: "taiwan",
    "south africa": "south-africa",
    "united arab emirates": "uae",
    uae: "uae",
    "united states": "united-states",
    "united kingdom": "uk",
    uk: "uk",
    canada: "canada",
    australia: "australia",
    germany: "germany",
    "new zealand": "new-zealand",
    bangladesh: "bangladesh",
    brazil: "brazil",
    nigeria: "nigeria",
    pakistan: "pakistan",
  };
  const flag = countryFlags[countryName.trim().toLowerCase()];
  return flag ? `/flags/${flag}.svg` : null;
}

function countryFlagEmoji(countryName: string) {
  const flags: Record<string, string> = {
    "hong kong": "🇭🇰",
    "united states": "🇺🇸",
    "united kingdom": "🇬🇧",
    uk: "🇬🇧",
    canada: "🇨🇦",
    australia: "🇦🇺",
    ireland: "🇮🇪",
    singapore: "🇸🇬",
    germany: "🇩🇪",
    sweden: "🇸🇪",
    france: "🇫🇷",
    thailand: "🇹🇭",
    mexico: "🇲🇽",
    "south africa": "🇿🇦",
    italy: "🇮🇹",
    taiwan: "🇹🇼",
    vietnam: "🇻🇳",
    china: "🇨🇳",
    india: "🇮🇳",
    uae: "🇦🇪",
  };
  return flags[countryName.trim().toLowerCase()] || "🏳️";
}

function websiteUrl(value?: string) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).href;
  } catch {
    return null;
  }
}

function SellerCard({ seller, onEnquire, onSelect }: { seller: SellerProfile; onEnquire: (seller: SellerProfile) => void; onSelect: (seller: SellerProfile) => void }) {
  const website = websiteUrl(seller.website);
  const tags = seller.services || [];
  const initials = (seller.companyName || seller.name || "S").slice(0, 1).toUpperCase();
  const countries = seller.countries?.length ? seller.countries : [seller.country];

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`View details for ${seller.companyName}`}
      onClick={() => onSelect(seller)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(seller);
        }
      }}
      className="group relative h-full cursor-pointer overflow-hidden border-border/70 bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:border-blue-800"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />
      <CardContent className="flex h-full flex-col p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">{initials}</div>
            <div className="min-w-0">
              <h3 className="truncate font-bold" title={seller.companyName}>{seller.companyName || "Independent seller"}</h3>
              <p className="truncate text-xs text-muted-foreground">{seller.name || "Company representative"}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1" aria-label={`Sourcing country${countries.length > 1 ? "ies" : ""}: ${countries.join(", ")}`}>
            {countries.map((country) => {
              const flag = countryFlag(country);
              return flag
                ? <Image key={country} src={flag} alt={`${country} flag`} title={country} width={20} height={14} className="h-3.5 w-5 rounded-[2px] border border-black/10 object-cover" />
                : <span key={country} role="img" aria-label={`${country} flag`} title={country} className="text-base leading-none">{countryFlagEmoji(country)}</span>;
            })}
          </div>
          {seller.verified ? (
            <Badge className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              <BadgeCheck className="size-3.5" aria-hidden="true" /> Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 text-amber-700 dark:text-amber-300">
              <CircleAlert className="size-3.5" aria-hidden="true" /> Listed
            </Badge>
          )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>{countries.join(" / ") || "China"}</span>
          {seller.city ? <><span aria-hidden="true">•</span><span className="truncate">{seller.city}</span></> : null}
        </div>

        <div className="mt-4">
          {seller.title ? <h4 className="line-clamp-2 min-h-12 text-lg font-bold leading-snug">{seller.title}</h4> : null}
          <p className={`${seller.title ? "mt-2" : ""} line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground`}>
            {seller.about || "Review this seller’s services, location, and experience before sending an enquiry."}
          </p>
        </div>

        {tags.length ? (
          <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => <Badge key={tag} variant="secondary" className="max-w-36 truncate font-medium">{tag}</Badge>)}
            {tags.length > 2 ? <Badge variant="outline">+{tags.length - 2}</Badge> : null}
          </div>
        ) : null}

        {(seller.email || seller.phone) ? (
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            {seller.email ? <a onClick={(event) => event.stopPropagation()} className="flex min-w-0 items-center gap-2 hover:text-foreground" href={`mailto:${seller.email}`} title={seller.email}><Mail className="size-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{seller.email}</span></a> : null}
            {seller.phone ? <a onClick={(event) => event.stopPropagation()} className="flex min-w-0 items-center gap-2 hover:text-foreground" href={`tel:${seller.phone.replace(/[^+\d]/g, "")}`} title={seller.phone}><Phone className="size-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{seller.phone}</span></a> : null}
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{seller.location || "China"}</span>
          <span className="ml-auto shrink-0 font-semibold text-foreground">{seller.turnaroundTime || seller.moq || "Flexible"}</span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          {website ? (
            <Button asChild variant="outline">
              <a onClick={(event) => event.stopPropagation()} href={website} target="_blank" rel="noreferrer"><Eye className="size-4" aria-hidden="true" /> Details</a>
            </Button>
          ) : (
            <Button variant="outline" disabled title="Website not added by this seller"><Eye className="size-4" aria-hidden="true" /> Details</Button>
          )}
          <Button onClick={(event) => { event.stopPropagation(); onEnquire(seller); }}><Send className="size-4" aria-hidden="true" /> Enquire</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SellerDetailsDialog({
  seller,
  onClose,
  onEnquire,
}: {
  seller: SellerProfile | null;
  onClose: () => void;
  onEnquire: (seller: SellerProfile) => void;
}) {
  const website = websiteUrl(seller?.website);
  const countries = seller?.countries?.length ? seller.countries : seller ? [seller.country] : [];

  return (
    <Dialog open={seller !== null} onOpenChange={(open) => !open && onClose()}>
      {seller ? (
        <DialogContent
          overlayClassName="bg-slate-950/35 backdrop-blur-sm"
          className="max-h-[88vh] overflow-y-auto rounded-2xl p-6 shadow-2xl duration-300 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 sm:max-w-3xl lg:max-w-4xl sm:p-8"
        >
          <DialogHeader className="pr-8">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
              {countries.map((country) => {
                const flag = countryFlag(country);
                return flag
                  ? <Image key={country} src={flag} alt={`${country} flag`} width={20} height={14} className="h-3.5 w-5 rounded-[2px] border border-black/10 object-cover" />
                  : <span key={country} role="img" aria-label={`${country} flag`}>{countryFlagEmoji(country)}</span>;
              })}
              <span>{countries.join(" / ") || "Location unavailable"}</span>
              {seller.verified ? <Badge variant="secondary"><BadgeCheck className="mr-1 size-3.5" />Verified</Badge> : <Badge variant="outline"><CircleAlert className="mr-1 size-3.5" />Listed</Badge>}
            </div>
            <DialogTitle className="pt-2 text-2xl sm:text-3xl">{seller.companyName}</DialogTitle>
            <p className="text-base text-muted-foreground">{seller.title || seller.name || "Sourcing company profile"}</p>
          </DialogHeader>

          <div className="grid gap-6 pt-2 md:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Company overview</h3>
                <p className="mt-2 whitespace-normal text-sm leading-6">{seller.about || "Contact this company to learn more about its sourcing services and operating locations."}</p>
              </div>
              {seller.services?.length ? (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Services</h3>
                  <div className="mt-2 flex flex-wrap gap-2">{seller.services.map((service) => <Badge key={service} variant="secondary">{service}</Badge>)}</div>
                </div>
              ) : null}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Address</h3>
                <p className="mt-2 text-sm leading-6">{seller.address || seller.location || "Address not provided"}</p>
              </div>
            </section>

            <aside className="h-fit rounded-xl border bg-muted/30 p-4 sm:p-5">
              <h3 className="font-semibold">Contact information</h3>
              <div className="mt-4 space-y-4 text-sm">
                {seller.email ? <div className="flex min-w-0 items-start gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><a className="break-all hover:underline" href={`mailto:${seller.email}`}>{seller.email}</a></div> : null}
                {seller.phone ? <div className="flex items-start gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><a className="hover:underline" href={`tel:${seller.phone.replace(/[^+\d]/g, "")}`}>{seller.phone}</a></div> : null}
                {website ? <div className="flex items-start gap-3"><Eye className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><a className="break-all hover:underline" href={website} target="_blank" rel="noreferrer">{seller.website}</a></div> : null}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                {website ? <Button asChild variant="outline"><a href={website} target="_blank" rel="noreferrer"><Eye className="size-4" />Visit website</a></Button> : null}
                <Button onClick={() => onEnquire(seller)}><Send className="size-4" />Enquire</Button>
              </div>
            </aside>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

function EnquiryForm({ seller, onClose }: { seller: SellerProfile | null; onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [requirement, setRequirement] = React.useState(() => seller ? `I would like to discuss ${seller.title || "sourcing support"} with ${seller.companyName}.` : "");

  function continueToBuyerForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!seller) return;
    sessionStorage.setItem("market-seller-enquiry-prefill", JSON.stringify({
      fullName: name.trim(),
      email: email.trim(),
      lookingFor: seller.title,
      detailedRequirement: requirement.trim(),
      provider: seller.companyName,
    }));
    router.push(`${routePath.buyers}?provider=${encodeURIComponent(seller.companyName)}`);
  }

  return (
    <Dialog open={seller !== null} onOpenChange={(open) => !open && onClose()}>
      {seller ? (
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="pr-8 text-2xl">Enquire with {seller.companyName}</DialogTitle>
            <p className="text-sm leading-6 text-muted-foreground">Add a short requirement now. We’ll carry these details into the buyer form so our team can connect you with the right provider.</p>
          </DialogHeader>
          <form className="mt-2 space-y-4" onSubmit={continueToBuyerForm}>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>Your name</span>
              <input required value={name} onChange={(event) => setName(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" placeholder="Enter your full name" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>Work email</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" placeholder="name@company.com" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium">
              <span>What do you need?</span>
              <textarea required minLength={20} rows={5} value={requirement} onChange={(event) => setRequirement(event.target.value)} className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" placeholder="Product, quantity, pickup city, destination, and preferred timeline" />
            </label>
            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose}><X className="size-4" aria-hidden="true" /> Cancel</Button>
              <Button type="submit"><Send className="size-4" aria-hidden="true" /> Continue to buyer form</Button>
            </div>
          </form>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export function TopSellersListing({ countryName }: { countryName: string }) {
  const localSellers = spreadsheetSellersFor(countryName);
  const isCombinedDirectory = countryName.trim().toLowerCase() === "all";
  const [sellers, setSellers] = React.useState<SellerProfile[]>(() => localSellers || []);
  const [selected, setSelected] = React.useState<SellerProfile | null>(null);
  const [selectedDetails, setSelectedDetails] = React.useState<SellerProfile | null>(null);
  const [loading, setLoading] = React.useState(localSellers === null);
  const [visibleSellerCount, setVisibleSellerCount] = React.useState(SELLERS_PER_PAGE);

  React.useEffect(() => {
    setVisibleSellerCount(SELLERS_PER_PAGE);
  }, [countryName]);

  React.useEffect(() => {
    const spreadsheetResults = spreadsheetSellersFor(countryName);
    if (spreadsheetResults) {
      setSellers(spreadsheetResults);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({ country: countryName, limit: "12" });
    void fetch(`${apiBaseUrl}/market/directory/sellers?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as SellerResponse;
        if (!response.ok || !result.success) throw new Error("Unable to load sellers");
        setSellers((result.data || []).filter((seller) => {
          const website = String(seller.website || "").trim().toLowerCase();
          return website && !website.includes(".example");
        }).slice(0, 12));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSellers([]);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [countryName]);

  return (
    <section className="border-y border-border/50 bg-slate-50/70 py-12 dark:bg-slate-950/25 sm:py-16" aria-labelledby="top-sellers-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            {(isCombinedDirectory ? ["China", "India"] : [countryName]).map((country) => {
              const flag = countryFlag(country);
              return flag ? <Image key={country} src={flag} alt={`${country} flag`} width={24} height={16} className="h-4 w-6 rounded-[2px] border border-black/10 object-cover" /> : null;
            })}
            <span>Sourcing agents directory</span>
          </div>
          <h2 id="top-sellers-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{isCombinedDirectory ? "Sourcing Agents in China and India" : `Top Sourcing Sellers in ${countryName}`}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{isCombinedDirectory ? "Browse sourcing companies from the supplied China and India directories. Country flags identify each company’s sourcing markets; use the listed contacts or company website to learn more." : `Browse sourcing companies and contact details for ${countryName}. Review each provider’s services, location, and website before sending an enquiry.`}</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: SELLERS_PER_PAGE }, (_, index) => <div key={index} className="h-[25rem] animate-pulse rounded-xl border bg-muted/50" />)
            : sellers.slice(0, visibleSellerCount).map((seller) => <SellerCard key={seller.id} seller={seller} onEnquire={setSelected} onSelect={setSelectedDetails} />)}
        </div>

        {!loading && sellers.length > visibleSellerCount ? (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => setVisibleSellerCount((count) => count + SELLERS_PER_PAGE)}>
              Show More
            </Button>
          </div>
        ) : null}

        {!loading && sellers.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">No active seller profiles are available for {countryName} right now.</div>
        ) : null}
      </div>
      <SellerDetailsDialog
        seller={selectedDetails}
        onClose={() => setSelectedDetails(null)}
        onEnquire={(seller) => {
          setSelectedDetails(null);
          setSelected(seller);
        }}
      />
      <EnquiryForm key={selected?.id || "closed"} seller={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
