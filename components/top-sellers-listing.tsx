"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BadgeCheck, CircleAlert, Eye, MapPin, Send, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { routePath } from "@/url";

type SellerProfile = {
  id: string;
  name: string;
  companyName: string;
  title: string;
  location: string;
  city: string;
  country: string;
  website?: string;
  verified: boolean;
  about?: string;
  services?: string[];
  turnaroundTime?: string;
  moq?: string;
};

type SellerResponse = { success: boolean; data?: SellerProfile[] };

const apiBaseUrl = String(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1",
).replace(/\/+$/, "");

const sellerFallbacks: SellerProfile[] = [
  { id: "curated-jingsourcing", name: "Marketplace team", companyName: "JingSourcing", title: "Product sourcing, development and shipping", location: "Yiwu, Zhejiang, China", city: "Yiwu", country: "China", website: "https://jingsourcing.com", verified: false, about: "Support for supplier sourcing, product development, quality checks, and order coordination.", services: ["Supplier sourcing", "Quality control", "Shipping"], turnaroundTime: "By project" },
  { id: "curated-guangzhou", name: "Marketplace team", companyName: "Guangzhou Sourcing", title: "Procurement and supply-chain support in China", location: "Guangzhou, Guangdong, China", city: "Guangzhou", country: "China", website: "https://guangzhousourcing.com", verified: false, about: "Procurement support for buyers working with manufacturers and suppliers in China.", services: ["Procurement", "Supplier management"], turnaroundTime: "By project" },
  { id: "curated-matchsourcing", name: "Marketplace team", companyName: "MatchSourcing", title: "China sourcing and import support", location: "Guangzhou, Guangdong, China", city: "Guangzhou", country: "China", website: "https://matchsourcing.com", verified: false, about: "Sourcing and import coordination for businesses buying products from China.", services: ["Product sourcing", "Import support"], turnaroundTime: "By project" },
  { id: "curated-imex", name: "Marketplace team", companyName: "IMEX Sourcing", title: "China sourcing and supply-chain management", location: "Guangzhou, China", city: "Guangzhou", country: "China", website: "https://imexsourcingservices.com", verified: false, about: "Supplier sourcing, quality control, product development, and supply-chain coordination.", services: ["Sourcing", "Quality control"], turnaroundTime: "By project" },
  { id: "curated-asiaction", name: "Marketplace team", companyName: "Asiaction", title: "Sourcing, quality and purchasing services", location: "China", city: "", country: "China", website: "https://asiaction.com", verified: false, about: "China-based support for sourcing, purchasing, inspection, and supplier coordination.", services: ["Purchasing", "Inspection"], turnaroundTime: "By project" },
  { id: "curated-dragon", name: "Marketplace team", companyName: "Dragon Sourcing", title: "Strategic sourcing and procurement services", location: "Shanghai, China", city: "Shanghai", country: "China", website: "https://dragonsourcing.com", verified: false, about: "Strategic sourcing support for companies building and managing international supply networks.", services: ["Strategic sourcing", "Procurement"], turnaroundTime: "By project" },
  { id: "curated-keen", name: "Marketplace team", companyName: "Keen Sourcing", title: "China supplier sourcing and order management", location: "Shanghai, China", city: "Shanghai", country: "China", website: "https://www.keensourcing.com", verified: false, about: "Product sourcing and supplier-management support for overseas buyers.", services: ["Supplier sourcing", "Order management"], turnaroundTime: "By project" },
  { id: "curated-cpa", name: "Marketplace team", companyName: "China Purchasing Agent", title: "Purchasing and supplier coordination in China", location: "Shenzhen, Guangdong, China", city: "Shenzhen", country: "China", website: "https://chinapurchasingagent.com", verified: false, about: "Local support for purchasing, supplier communication, and China order coordination.", services: ["Purchasing", "Supplier coordination"], turnaroundTime: "By project" },
  { id: "curated-owl", name: "Marketplace team", companyName: "OwlSourcing", title: "China product sourcing and quality support", location: "Shanghai, China", city: "Shanghai", country: "China", website: "https://owlsourcing.com", verified: false, about: "Sourcing assistance for product research, supplier contact, and quality follow-up.", services: ["Product sourcing", "Quality support"], turnaroundTime: "By project" },
  { id: "curated-justchina", name: "Marketplace team", companyName: "JustChinait", title: "China sourcing and order fulfilment", location: "Shenzhen, Guangdong, China", city: "Shenzhen", country: "China", website: "https://justchinait.com", verified: false, about: "Sourcing and fulfilment support for buyers ordering and shipping products from China.", services: ["Sourcing", "Fulfilment"], turnaroundTime: "By project" },
  { id: "curated-easyimex", name: "Marketplace team", companyName: "Easy Imex", title: "End-to-end China sourcing and quality management", location: "Shanghai, China", city: "Shanghai", country: "China", website: "https://easyimex.com", verified: false, about: "Supplier sourcing, negotiation, quality management, purchasing, and shipping support.", services: ["Sourcing", "Quality management", "Shipping"], turnaroundTime: "By project" },
  { id: "curated-guidedimports", name: "Marketplace team", companyName: "Guided Imports", title: "China sourcing and supplier management", location: "China", city: "", country: "China", website: "https://guidedimports.com", verified: false, about: "Resources and services for sourcing, supplier checks, and importing products from China.", services: ["Supplier sourcing", "Supplier verification"], turnaroundTime: "By project" },
];

function fillSellerGrid(dashboardSellers: SellerProfile[], countryName: string) {
  const eligibleDashboardSellers = dashboardSellers.filter((seller) => {
    const website = String(seller.website || "").trim().toLowerCase();
    return website && !website.includes(".example");
  });
  const names = new Set(eligibleDashboardSellers.map((seller) => seller.companyName.trim().toLowerCase()));
  const countryFallbacks = sellerFallbacks.filter(
    (seller) => seller.country.toLowerCase() === countryName.trim().toLowerCase(),
  );
  return [
    ...eligibleDashboardSellers,
    ...countryFallbacks.filter((seller) => !names.has(seller.companyName.toLowerCase())),
  ].slice(0, 12);
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
  };
  const flag = countryFlags[countryName.trim().toLowerCase()];
  return flag ? `/flags/${flag}.svg` : null;
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

function SellerCard({ seller, onEnquire }: { seller: SellerProfile; onEnquire: (seller: SellerProfile) => void }) {
  const website = websiteUrl(seller.website);
  const tags = seller.services || [];
  const initials = (seller.companyName || seller.name || "S").slice(0, 1).toUpperCase();
  const flag = countryFlag(seller.country);

  return (
    <Card className="group relative h-full overflow-hidden border-border/70 bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/5 dark:hover:border-blue-800">
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

        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {flag ? <Image src={flag} alt="" width={20} height={14} className="h-3.5 w-5 rounded-[2px] border border-black/10 object-cover" aria-hidden="true" /> : null}
          <span>{seller.country || "China"}</span>
          {seller.city ? <><span aria-hidden="true">•</span><span className="truncate">{seller.city}</span></> : null}
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">Service</p>
          <h4 className="mt-1 line-clamp-2 min-h-12 text-lg font-bold leading-snug">{seller.title || "China sourcing and logistics support"}</h4>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
            {seller.about || "Review this seller’s services, location, and experience before sending an enquiry."}
          </p>
        </div>

        <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag) => <Badge key={tag} variant="secondary" className="max-w-36 truncate font-medium">{tag}</Badge>)}
          {tags.length > 2 ? <Badge variant="outline">+{tags.length - 2}</Badge> : null}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{seller.location || "China"}</span>
          <span className="ml-auto shrink-0 font-semibold text-foreground">{seller.turnaroundTime || seller.moq || "Flexible"}</span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          {website ? (
            <Button asChild variant="outline">
              <a href={website} target="_blank" rel="noreferrer"><Eye className="size-4" aria-hidden="true" /> Details</a>
            </Button>
          ) : (
            <Button variant="outline" disabled title="Website not added by this seller"><Eye className="size-4" aria-hidden="true" /> Details</Button>
          )}
          <Button onClick={() => onEnquire(seller)}><Send className="size-4" aria-hidden="true" /> Enquire</Button>
        </div>
      </CardContent>
    </Card>
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
  const [sellers, setSellers] = React.useState<SellerProfile[]>([]);
  const [selected, setSelected] = React.useState<SellerProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ country: countryName, limit: "12" });
    void fetch(`${apiBaseUrl}/market/directory/sellers?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as SellerResponse;
        if (!response.ok || !result.success) throw new Error("Unable to load sellers");
        setSellers(fillSellerGrid((result.data || []).slice(0, 12), countryName));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSellers(fillSellerGrid([], countryName));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [countryName]);

  return (
    <section className="border-y border-border/50 bg-slate-50/70 py-12 dark:bg-slate-950/25 sm:py-16" aria-labelledby="top-sellers-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            {countryFlag(countryName) ? <Image src={countryFlag(countryName)!} alt={`${countryName} flag`} width={24} height={16} className="h-4 w-6 rounded-[2px] border border-black/10 object-cover" /> : null}
            <span>Marketplace seller directory</span>
          </div>
          <h2 id="top-sellers-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Top Sourcing Sellers in {countryName}</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">Compare seller profiles from our dashboard and public directory, visit a company website, or send a focused enquiry through ChinaIndiaSourcing.</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 12 }, (_, index) => <div key={index} className="h-[25rem] animate-pulse rounded-xl border bg-muted/50" />)
            : sellers.map((seller) => <SellerCard key={seller.id} seller={seller} onEnquire={setSelected} />)}
        </div>

        {!loading && sellers.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">No active seller profiles are available for {countryName} right now.</div>
        ) : null}
      </div>
      <EnquiryForm key={selected?.id || "closed"} seller={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
