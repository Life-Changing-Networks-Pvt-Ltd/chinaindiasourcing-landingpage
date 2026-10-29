"use client";

import { useEffect, useState, useId, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileCheck2,
  FileText,
  Globe,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Package,
  Paperclip,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
  UploadCloud,
  Users,
  X,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OtpVerificationButton } from "@/components/otp-verification-button";
import { MarketVerificationPayment } from "@/components/market-verification-payment";
import { routePath } from "@/url";
import {
  buildWhatsappNumber,
  getMarketDraft,
  type MarketDraftCredentials,
  type MarketPaymentDetails,
  saveMarketDraft,
  submitMarketForm,
} from "@/lib/api";

// Destination & Origin Countries (Identical to /buyers)
const destinationCountries = [
  { name: "India", flag: "/flags/india.svg" },
  { name: "United States", flag: "/flags/united-states.svg" },
  { name: "China", flag: "/flags/china.svg" },
  { name: "United Kingdom", flag: "/flags/uk.svg" },
  { name: "Canada", flag: "/flags/canada.svg" },
  { name: "Australia", flag: "/flags/australia.svg" },
  { name: "United Arab Emirates", flag: "/flags/uae.svg" },
  { name: "Vietnam", flag: "/flags/vietnam.svg" },
  { name: "Germany", flag: "/flags/germany.svg" },
  { name: "Taiwan", flag: "/flags/taiwan.svg" },
  { name: "New Zealand", flag: "/flags/new-zealand.svg" },
  { name: "Pakistan", flag: "/flags/pakistan.svg" },
  { name: "Bangladesh", flag: "/flags/bangladesh.svg" },
  { name: "South Africa", flag: "/flags/south-africa.svg" },
  { name: "Nigeria", flag: "/flags/nigeria.svg" },
  { name: "Other Country", flag: null },
];

const countryCodes = [
  { code: "+91", country: "India", flag: "/flags/india.svg" },
  { code: "+1", country: "USA", flag: "/flags/united-states.svg" },
  { code: "+86", country: "China", flag: "/flags/china.svg" },
  { code: "+84", country: "Vietnam", flag: "/flags/vietnam.svg" },
  { code: "+886", country: "Taiwan", flag: "/flags/taiwan.svg" },
  { code: "+44", country: "UK", flag: "/flags/uk.svg" },
  { code: "+971", country: "UAE", flag: "/flags/uae.svg" },
  { code: "+61", country: "Australia", flag: "/flags/australia.svg" },
  { code: "+49", country: "Germany", flag: "/flags/germany.svg" },
  { code: "+1-CA", country: "Canada", flag: "/flags/canada.svg" },
  { code: "+64", country: "New Zealand", flag: "/flags/new-zealand.svg" },
  { code: "+92", country: "Pakistan", flag: "/flags/pakistan.svg" },
  { code: "+880", country: "Bangladesh", flag: "/flags/bangladesh.svg" },
  { code: "+27", country: "South Africa", flag: "/flags/south-africa.svg" },
  { code: "+234", country: "Nigeria", flag: "/flags/nigeria.svg" },
  { code: "custom", country: "Other (+...)", flag: null },
];

const countryStates: Record<string, string[]> = {
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi (NCT)", "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry",
  ],
  "United States": [
    "California", "Texas", "Florida", "New York", "Illinois", "Pennsylvania", "Ohio", "Georgia",
    "North Carolina", "Michigan", "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts",
    "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin", "Colorado", "Minnesota",
  ],
  China: [
    "Guangdong", "Zhejiang", "Jiangsu", "Shandong", "Fujian", "Hebei", "Henan", "Hubei", "Hunan",
    "Sichuan", "Anhui", "Liaoning", "Jiangxi", "Shaanxi", "Beijing", "Shanghai", "Tianjin", "Chongqing",
  ],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland", "Greater London", "West Midlands", "Greater Manchester"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
  Vietnam: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hai Phong", "Can Tho", "Binh Duong", "Dong Nai", "Bac Ninh"],
  Germany: ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Lower Saxony", "Hesse", "Berlin", "Saxony"],
  Taiwan: ["Taipei City", "New Taipei City", "Taichung City", "Kaohsiung City", "Tainan City", "Taoyuan City", "Hsinchu City"],
};

// Seller and sourcing-partner roles
export const PRIMARY_ROLES: string[] = [
  "Manufacturer",
  "Supplier / Trader",
  "Exporter",
  "Sourcing Agent",
  "Service Provider",
];

// 25 Sourcing Agent Specializations (from live web.sellerslogin.com/sellers)
export interface SourcingAgentType {
  id: string;
  name: string;
  image: string;
}

export const SOURCING_AGENT_TYPES: SourcingAgentType[] = [
  { id: "import-sourcing-agent", name: "Import Sourcing Agent", image: "/images/sourcing/import-agent.svg" },
  { id: "dropshipping-agent", name: "Dropshipping Agent", image: "/images/sourcing/dropshipping-agent.svg" },
  { id: "alibaba-sourcing-agent", name: "Alibaba Sourcing Agent", image: "/images/sourcing/alibaba-agent.svg" },
  { id: "product-sourcing-agent", name: "Product Sourcing Agent", image: "/images/sourcing/product-sourcing-agent.svg" },
  { id: "1688-sourcing-agent", name: "1688 Sourcing Agent", image: "/images/sourcing/1688-agent.svg" },
  { id: "dropshipping-sourcing-agent", name: "Dropshipping Sourcing Agent", image: "/images/sourcing/dropshipping-sourcing-agent.svg" },
  { id: "indiamart-sourcing-agent", name: "IndiaMART Sourcing Agent", image: "/images/sourcing/indiamart-agent.svg" },
  { id: "wholesale-trading-agent", name: "Wholesale Trading Agent", image: "/images/sourcing/wholesale-trading-agent.svg" },
  { id: "asia-sourcing-agent", name: "Asia Sourcing Agent", image: "/images/sourcing/asia-sourcing-agent.svg" },
  { id: "india-sourcing-agent", name: "India Sourcing Agent", image: "/images/sourcing/india-sourcing-agent.svg" },
  { id: "china-sourcing-agent", name: "China Sourcing Agent", image: "/images/sourcing/china-sourcing-agent.svg" },
  { id: "fba-sourcing-agent", name: "FBA Sourcing Agent", image: "/images/sourcing/fba-sourcing-agent.svg" },
  { id: "china-buying-agent", name: "China Buying Agent", image: "/images/sourcing/china-sourcing-agent.svg" },
  { id: "china-import-agent", name: "China Import Agent", image: "/images/sourcing/import-agent.svg" },
  { id: "trending-chinese-products-research", name: "Trending Chinese Products Research", image: "/images/sourcing/product-sourcing-agent.svg" },
  { id: "chinese-product-inspection", name: "Chinese Product Inspection", image: "/images/sourcing/asia-sourcing-agent.svg" },
  { id: "chinese-factory-visit", name: "Chinese Factory Visit", image: "/images/sourcing/wholesale-trading-agent.svg" },
  { id: "door-to-door-service", name: "Door-to-Door Service", image: "/images/sourcing/dropshipping-sourcing-agent.svg" },
  { id: "china-freight-forwarder", name: "China Freight Forwarder", image: "/images/sourcing/dropshipping-agent.svg" },
  { id: "indian-buying-agent", name: "Indian Buying Agent", image: "/images/sourcing/india-sourcing-agent.svg" },
  { id: "india-import-agent", name: "India Import Agent", image: "/images/sourcing/import-agent.svg" },
  { id: "trending-indian-product-research", name: "Trending Indian Product Research", image: "/images/sourcing/product-sourcing-agent.svg" },
  { id: "india-factory-visit", name: "India Factory Visit", image: "/images/sourcing/wholesale-trading-agent.svg" },
  { id: "indian-product-inspection", name: "Indian Product Inspection", image: "/images/sourcing/indiamart-agent.svg" },
  { id: "indian-freight-forwarder", name: "Indian Freight Forwarder", image: "/images/sourcing/dropshipping-agent.svg" },
];

const hourlyRateOptions = ["$ 5 to $ 15 / hr", "$ 15 to $ 30 / hr", "$ 30 to $ 50 / hr", "$ 50 to $ 100 / hr", "$ 100 to $ 150 / hr", "Custom Hourly"];
const fixedRateOptions = ["$ 50 to $ 200", "$ 200 to $ 500", "$ 500 to $ 1,500", "$ 1,500 to $ 3,000", "$ 3,000 to $ 5,000", "Custom Fixed"];
const businessRoles = ["Manufacturer", "Supplier", "Sourcing Agent", "Service Provider"];
const incotermsOptions = ["FOB", "CIF", "EXW", "DDP", "CFR", "DAP"];
const targetRegionOptions = [
  { name: "North America", flag: "/flags/united-states.svg" },
  { name: "European Union", flag: "/flags/european-union.svg" },
  { name: "India", flag: "/flags/india.svg" },
  { name: "Southeast Asia", flag: "/flags/vietnam.svg" },
  { name: "Middle East / UAE", flag: "/flags/uae.svg" },
  { name: "United Kingdom", flag: "/flags/uk.svg" },
  { name: "Australia & NZ", flag: "/flags/australia.svg" },
  { name: "Latin America", flag: "/flags/brazil.svg" },
  { name: "China & East Asia", flag: "/flags/china.svg" },
  { name: "Africa", flag: "/flags/south-africa.svg" },
];
const moqOptions = ["No MOQ", "10 to 50 Units", "50 to 200 Units", "200 to 500 Units", "500 to 2,000 Units", "Above 2,000 Units", "Custom MOQ"];
const turnaroundTimeOptions = ["Ready Stock (24-48 hrs)", "3 to 7 Days", "1 to 2 Weeks", "2 to 4 Weeks", "1 to 2 Months", "Custom TAT"];
const teamSizeOptions = ["1 to 10", "11 to 50", "51 to 200", "201 to 500", "500+"];
const certificationGroups = [
  {
    group: "International Quality Certifications",
    items: [
      "ISO 9001 (Quality Management)",
      "CE Marking (European Conformity)",
      "RoHS Compliance (Hazardous Substances)",
      "FDA Registered (US Food & Drug)",
      "GMP Certification (Good Manufacturing)",
    ],
  },
  {
    group: "Regional Compliance Certifications",
    items: [
      "BIS for India (Bureau of Indian Standards)",
      "UL / FCC for US (Safety & Compliance)",
      "CE for EU (European Market Access)",
    ],
  },
  {
    group: "Third-Party Inspection Partner Approvals",
    items: [
      "SGS Audited Facility",
      "Intertek Clean Compliance",
      "TÜV Rheinland Inspected",
    ],
  },
  {
    group: "Custom & Other Standards",
    items: [
      "Custom Certificate",
    ],
  },
];

const presetCertifications = certificationGroups.flatMap((g) => g.items);

const currentYear = new Date().getFullYear();
const establishmentYears = Array.from({ length: currentYear - 1949 }, (_, i) => String(currentYear - i));

const sampleAvailabilityOptions = [
  "Free Sample (Buyer Pays Freight)",
  "Free Sample & Freight Included",
  "Paid Sample at Production Cost",
  "Available on Request",
];

const withholdingTaxDocOptions = [
  "W-8BEN (Foreign Individuals / Sole Proprietors)",
  "W-8BEN-E (Foreign Entities / Corporations)",
  "W-9 (US Entities & Tax Residents)",
  "Certificate of Tax Residence (Local Jurisdiction)",
  "Local Tax Clearance Form",
  "Exempt / Not Applicable",
];

const kycJurisdictions = [
  { name: "India", flag: "/flags/india.svg" },
  { name: "United States", flag: "/flags/united-states.svg" },
  { name: "United Kingdom", flag: "/flags/uk.svg" },
  { name: "European Union (EU)", flag: "/flags/european-union.svg" },
  { name: "China", flag: "/flags/china.svg" },
  { name: "Other Global Regions", flag: "" },
];

const currencyOptions = [
  { code: "USD ($)", flag: "/flags/united-states.svg" },
  { code: "EUR (€)", flag: "/flags/european-union.svg" },
  { code: "INR (₹)", flag: "/flags/india.svg" },
  { code: "GBP (£)", flag: "/flags/uk.svg" },
  { code: "AED (د.إ)", flag: "/flags/uae.svg" },
  { code: "AUD (A$)", flag: "/flags/australia.svg" },
  { code: "CAD (C$)", flag: "/flags/canada.svg" },
  { code: "CNY (¥)", flag: "/flags/china.svg" },
];

function capitalizeFirst(val: string): string {
  if (!val) return "";
  const match = val.search(/[a-zA-Z]/);
  if (match === -1) return val;
  return val.slice(0, match) + val.charAt(match).toUpperCase() + val.slice(match + 1);
}

function capitalizeWords(val: string): string {
  if (!val) return "";
  return val.replace(/(^|\s|-)([a-z])/g, (_, boundary, char) => boundary + char.toUpperCase());
}



// CountrySelect Component matching /buyers
function CountrySelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = destinationCountries.find((c) => c.name === value) || destinationCountries[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors hover:bg-accent/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center gap-2 truncate">
          {selected.flag ? (
            <img src={selected.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover border border-black/10 shrink-0" />
          ) : (
            <Globe className="size-4 text-cyan-500 shrink-0" />
          )}
          <span className="truncate font-medium">{selected.name}</span>
        </div>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-56 w-full min-w-[200px] overflow-y-auto rounded-lg border border-border/80 bg-white dark:bg-[#18181b] p-1 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
          {destinationCountries.map((c) => {
            const isChosen = c.name === value;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  onChange(c.name);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                  isChosen ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted/80"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {c.flag ? (
                    <img src={c.flag} alt="" className="h-3 w-4.5 rounded-[2px] object-cover border border-black/10 shrink-0" />
                  ) : (
                    <Globe className="size-3.5 text-cyan-500 shrink-0" />
                  )}
                  <span className="truncate">{c.name}</span>
                </div>
                {isChosen && <Check className="size-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// CountryCodeSelect Component with Flag
function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = countryCodes.find((c) => c.code === value) || countryCodes[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[38px] items-center justify-between gap-1.5 rounded-md border border-input bg-background px-2.5 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-accent/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
      >
        <div className="flex items-center gap-1.5 truncate">
          {selected.flag ? (
            <img
              src={selected.flag}
              alt=""
              className="h-3.5 w-5 rounded-[2px] object-cover border border-black/10 shrink-0"
            />
          ) : (
            <Globe className="size-3.5 text-cyan-500 shrink-0" />
          )}
          <span>{selected.code === "custom" ? "+..." : selected.code}</span>
        </div>
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-56 overflow-y-auto rounded-lg border border-border/80 bg-white dark:bg-[#18181b] p-1 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
          {countryCodes.map((c) => {
            const isChosen = c.code === value;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                  isChosen
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted/80"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {c.flag ? (
                    <img
                      src={c.flag}
                      alt=""
                      className="h-3 w-4.5 rounded-[2px] object-cover border border-black/10 shrink-0"
                    />
                  ) : (
                    <Globe className="size-3.5 text-cyan-500 shrink-0" />
                  )}
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-muted-foreground truncate">({c.country})</span>
                </div>
                {isChosen && <Check className="size-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// StateSelect Component matching /buyers
function StateSelect({
  country,
  value,
  onChange,
}: {
  country: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const stateList = countryStates[country] || [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = stateList.filter((s) => s.toLowerCase().includes(search.toLowerCase().trim()));

  if (stateList.length === 0) {
    return (
      <input
        type="text"
        required
        placeholder="Enter State / Province"
        value={value}
        onChange={(e) => onChange(capitalizeWords(e.target.value))}
        className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    );
  }

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors hover:bg-accent/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className={`truncate ${!value ? "text-muted-foreground" : "font-medium text-foreground"}`}>
          {value || `Select ${country} State...`}
        </span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full min-w-[220px] overflow-y-auto rounded-lg border border-border/80 bg-white dark:bg-[#18181b] p-1.5 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
          <div className="relative mb-1.5 px-1 pt-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search state..."
              value={search}
              autoFocus
              onChange={(e) => setSearch(capitalizeWords(e.target.value))}
              className="w-full rounded-md border border-input bg-muted/30 dark:bg-zinc-800/80 pl-8 pr-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-0.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
            {filtered.map((s) => {
              const isChosen = s.toLowerCase() === value.toLowerCase();
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                    isChosen ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{s}</span>
                  {isChosen && <Check className="size-3.5 text-primary shrink-0" />}
                </button>
              );
            })}

            {filtered.length === 0 && search.trim() && (
              <button
                type="button"
                onClick={() => {
                  onChange(capitalizeWords(search.trim()));
                  setIsOpen(false);
                  setSearch("");
                }}
                className="w-full rounded-md bg-primary/10 px-2 py-1.5 text-left text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                Use custom: &quot;{capitalizeWords(search.trim())}&quot;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 5 Steps Definition matching User Specification exactly
const formSteps = [
  { id: 1, title: "Basic Information", icon: Building2, desc: "Global standards, address & contact" },
  { id: 2, title: "Operational Capabilities", icon: Package, desc: "Products catalog, MOQs & shipping" },
  { id: 3, title: "Catalog & Portfolio", icon: Layers, desc: "Sourcing network, services & case studies" },
  { id: 4, title: "Infrastructure & Team", icon: Award, desc: "Team capacity, facilities & certificates" },
  { id: 5, title: "Legal, Tax & Banking", icon: CreditCard, desc: "Country KYC & international payouts" },
];

const SELLER_SESSION_DRAFT_KEY = "market-sellers-session-draft-v1";

interface SellerSessionDraft {
  version: 1;
  formData: Record<string, unknown>;
  currentStep: number;
  hasChosenRoles: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  specs: string;
  moq: string;
  sampleAvailability: string;
  imageName?: string;
}

interface CertificateItem {
  id: string;
  name: string;
  issuingBody: string;
  fileName?: string;
}

export default function SellersPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Opening Question State (Role & Sourcing Specialization)
  const [hasChosenRoles, setHasChosenRoles] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedSourcingTypes, setSelectedSourcingTypes] = useState<string[]>([]);
  const [isSourcingDropdownOpen, setIsSourcingDropdownOpen] = useState(false);
  const [sourcingSearch, setSourcingSearch] = useState("");

  const filteredSourcingTypes = SOURCING_AGENT_TYPES.filter((agent) =>
    agent.name.toLowerCase().includes(sourcingSearch.toLowerCase().trim())
  );

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const sourcingDropdownRef = useRef<HTMLDivElement>(null);

  // Registration Stepper State
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<MarketPaymentDetails | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const draftCredentials = useRef<MarketDraftCredentials | null>(null);
  const draftQueue = useRef<Promise<void>>(Promise.resolve());
  const pendingDraftSaves = useRef(0);

  // Step 1: Basic Info
  const [titleOfServices, setTitleOfServices] = useState("");
  const [chargeType, setChargeType] = useState<"hourly" | "fixed">("hourly");
  const [hourlyCharge, setHourlyCharge] = useState(hourlyRateOptions[2]);
  const [customHourlyCharge, setCustomHourlyCharge] = useState("");
  const [fixedCharge, setFixedCharge] = useState(fixedRateOptions[1]);
  const [customFixedCharge, setCustomFixedCharge] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [businessRole, setBusinessRole] = useState("Manufacturer");
  const [aboutCompany, setAboutCompany] = useState("");
  const [yearOfEstablishment, setYearOfEstablishment] = useState("");

  // Step 2: Contact & Address
  const [contactName, setContactName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationToken, setEmailVerificationToken] = useState("");
  const [emailRegistrationWarning, setEmailRegistrationWarning] = useState("");
  const [marketApplicationId, setMarketApplicationId] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [whatsappVerificationToken, setWhatsappVerificationToken] = useState("");
  const [whatsappRegistrationWarning, setWhatsappRegistrationWarning] = useState("");
  const [website, setWebsite] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [locationLandmark, setLocationLandmark] = useState("");
  const [country, setCountry] = useState("India");
  const [customCountry, setCustomCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const requiresWhatsappVerification =
    countryCode === "+91" ||
    (countryCode === "custom" && customCountryCode.replace(/\D/g, "") === "91");

  // Step 2: Operational & Sourcing Capabilities
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [targetRegions, setTargetRegions] = useState<string[]>([]);
  const [customRegion, setCustomRegion] = useState("");
  const [moqCapability, setMoqCapability] = useState(moqOptions[0]);
  const [customMoq, setCustomMoq] = useState("");
  const [turnaroundTime, setTurnaroundTime] = useState(turnaroundTimeOptions[0]);
  const [customTurnaroundTime, setCustomTurnaroundTime] = useState("");
  const [selectedIncoterms, setSelectedIncoterms] = useState<string[]>([]);

  // Step 3: Catalog & Portfolio
  const [samplePolicy, setSamplePolicy] = useState("Free Sample (Buyer Pays Freight)");
  const [sourcingRegions, setSourcingRegions] = useState("");
  const [auditingExpertise, setAuditingExpertise] = useState<string[]>([]);
  const [networkSize, setNetworkSize] = useState("10 to 50 Verified Factories");
  const [serviceScope, setServiceScope] = useState("");
  const [techStack, setTechStack] = useState("");
  const [servicePackages, setServicePackages] = useState("");
  const [caseStudies, setCaseStudies] = useState("");

  // Step 4: Infrastructure & Certifications
  const [teamSize, setTeamSize] = useState(teamSizeOptions[0]);
  const [qcCount, setQcCount] = useState("");
  const [sourcingStaffCount, setSourcingStaffCount] = useState("");
  const [facilityDetails, setFacilityDetails] = useState("");
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [certDropdown, setCertDropdown] = useState(presetCertifications[0]);
  const [certCustomName, setCertCustomName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certFileName, setCertFileName] = useState<string | null>(null);

  // Step 6: Legal & Tax (KYC)
  const [kycJurisdictionTab, setKycJurisdictionTab] = useState<string>("");
  // India
  const [panNumber, setPanNumber] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [msmeUdyam, setMsmeUdyam] = useState("");
  const [cinNumber, setCinNumber] = useState("");
  const [iecCode, setIecCode] = useState("");
  // United States
  const [einNumber, setEinNumber] = useState("");
  const [stateLicense, setStateLicense] = useState("");
  const [usResaleCert, setUsResaleCert] = useState("");
  // United Kingdom
  const [ukCompaniesHouse, setUkCompaniesHouse] = useState("");
  const [ukVatNumber, setUkVatNumber] = useState("");
  const [ukUtr, setUkUtr] = useState("");
  // European Union (EU)
  const [euVatNumber, setEuVatNumber] = useState("");
  const [euEoriNumber, setEuEoriNumber] = useState("");
  const [euCommercialRegister, setEuCommercialRegister] = useState("");
  // China
  const [chinaUscc, setChinaUscc] = useState("");
  const [chinaBusinessLicense, setChinaBusinessLicense] = useState("");
  const [chinaCustomsCode, setChinaCustomsCode] = useState("");
  // Other Global Regions
  const [localTaxId, setLocalTaxId] = useState("");
  const [otherBusinessReg, setOtherBusinessReg] = useState("");
  const [uploadedKycDoc, setUploadedKycDoc] = useState<string | null>(null);

  // Step 7: Banking & Payouts
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountOrIban, setAccountOrIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [settlementCurrencies, setSettlementCurrencies] = useState<string[]>([]);
  const [withholdingTaxType, setWithholdingTaxType] = useState(withholdingTaxDocOptions[0]);
  const [taxResidencyDocName, setTaxResidencyDocName] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedLeadSharing, setAgreedLeadSharing] = useState(false);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const restoreDraft = (
      data: Record<string, unknown>,
      restoredStep: number,
      restoredHasChosenRoles?: boolean,
      restoreVerification = false,
    ) => {
      if (!isMounted) return;

      const str = (key: string) => typeof data[key] === "string" ? data[key] as string : "";
      const arr = (key: string) => Array.isArray(data[key]) ? data[key] as string[] : [];
      setSelectedRoles(arr("selectedRoles")); setSelectedSourcingTypes(arr("selectedSourcingTypes"));
      setTitleOfServices(str("titleOfServices")); setChargeType(data.chargeType === "fixed" ? "fixed" : "hourly");
      setHourlyCharge(str("hourlyCharge") || hourlyRateOptions[2]); setCustomHourlyCharge(str("customHourlyCharge"));
      setFixedCharge(str("fixedCharge") || fixedRateOptions[1]); setCustomFixedCharge(str("customFixedCharge"));
      setCompanyName(str("companyName")); setLegalBusinessName(str("legalBusinessName"));
      setBusinessRole(str("businessRole") || "Manufacturer"); setAboutCompany(str("aboutCompany"));
      setYearOfEstablishment(str("yearOfEstablishment")); setContactName(str("contactName"));
      setJobTitle(str("jobTitle")); setEmail(str("email")); setCountryCode(str("countryCode") || "+91");
      setCustomCountryCode(str("customCountryCode")); setWhatsapp(str("whatsapp")); setWebsite(str("website"));
      setStreetAddress(str("streetAddress")); setLocationLandmark(str("locationLandmark"));
      setCountry(str("country") || "India"); setCustomCountry(str("customCountry")); setState(str("state"));
      setCity(str("city")); setPincode(str("pincode"));
      setProducts(Array.isArray(data.products) ? data.products as ProductItem[] : []);
      setTargetRegions(arr("targetRegions")); setCustomRegion(str("customRegion"));
      setMoqCapability(str("moqCapability") || moqOptions[0]); setCustomMoq(str("customMoq"));
      setTurnaroundTime(str("turnaroundTime") || turnaroundTimeOptions[0]);
      setCustomTurnaroundTime(str("customTurnaroundTime")); setSelectedIncoterms(arr("selectedIncoterms"));
      setSamplePolicy(str("samplePolicy") || "Free Sample (Buyer Pays Freight)");
      setSourcingRegions(str("sourcingRegions")); setAuditingExpertise(arr("auditingExpertise"));
      setNetworkSize(str("networkSize") || "10 to 50 Verified Factories"); setServiceScope(str("serviceScope"));
      setTechStack(str("techStack")); setServicePackages(str("servicePackages")); setCaseStudies(str("caseStudies"));
      setTeamSize(str("teamSize") || teamSizeOptions[0]); setQcCount(str("qcCount"));
      setSourcingStaffCount(str("sourcingStaffCount")); setFacilityDetails(str("facilityDetails"));
      setCertificates(Array.isArray(data.certificates) ? data.certificates as CertificateItem[] : []);
      setCertDropdown(str("certDropdown") || presetCertifications[0]);
      setCertCustomName(str("certCustomName")); setCertIssuer(str("certIssuer"));
      setCertFileName(str("certFileName") || null);
      setKycJurisdictionTab(str("kycJurisdictionTab")); setPanNumber(str("panNumber"));
      setGstinNumber(str("gstinNumber")); setMsmeUdyam(str("msmeUdyam")); setCinNumber(str("cinNumber"));
      setIecCode(str("iecCode")); setEinNumber(str("einNumber")); setStateLicense(str("stateLicense"));
      setUsResaleCert(str("usResaleCert")); setUkCompaniesHouse(str("ukCompaniesHouse"));
      setUkVatNumber(str("ukVatNumber")); setUkUtr(str("ukUtr")); setEuVatNumber(str("euVatNumber"));
      setEuEoriNumber(str("euEoriNumber")); setEuCommercialRegister(str("euCommercialRegister"));
      setChinaUscc(str("chinaUscc")); setChinaBusinessLicense(str("chinaBusinessLicense"));
      setChinaCustomsCode(str("chinaCustomsCode")); setLocalTaxId(str("localTaxId"));
      setOtherBusinessReg(str("otherBusinessReg")); setUploadedKycDoc(str("uploadedKycDoc") || null);
      setAccountHolder(str("accountHolder")); setBankName(str("bankName"));
      setAccountOrIban(str("accountOrIban")); setSwiftCode(str("swiftCode"));
      setSettlementCurrencies(arr("settlementCurrencies"));
      setWithholdingTaxType(str("withholdingTaxType") || withholdingTaxDocOptions[0]);
      setTaxResidencyDocName(str("taxResidencyDocName") || null);
      setAgreedTerms(Boolean(data.agreedTerms)); setAgreedLeadSharing(Boolean(data.agreedLeadSharing));

      if (restoreVerification) {
        setEmailVerified(Boolean(data.emailVerified));
        setEmailVerificationToken(str("emailVerificationToken"));
        setWhatsappVerified(Boolean(data.whatsappVerified));
        setWhatsappVerificationToken(str("whatsappVerificationToken"));
      }

      setHasChosenRoles(restoredHasChosenRoles ?? arr("selectedRoles").length > 0);
      setCurrentStep(Math.min(Math.max(restoredStep || 1, 1), formSteps.length));
    };

    const hydrateDraft = async () => {
      // Defer hydration so React can finish the initial client render first.
      await Promise.resolve();

      try {
        const saved = JSON.parse(sessionStorage.getItem("market-sellers-draft") || "null") as MarketDraftCredentials | null;
        draftCredentials.current = saved;

        const sessionDraft = JSON.parse(
          sessionStorage.getItem(SELLER_SESSION_DRAFT_KEY) || "null",
        ) as SellerSessionDraft | null;

        if (sessionDraft?.version === 1 && sessionDraft.formData) {
          restoreDraft(
            sessionDraft.formData,
            sessionDraft.currentStep,
            sessionDraft.hasChosenRoles,
            true,
          );
          if (isMounted) {
            setDraftMessage("");
          }
          return;
        }

        if (saved?.draftId && saved?.draftToken) {
          try {
            const result = await getMarketDraft("sellers", saved);
            const data = result.data?.formData;
            if (data) {
              restoreDraft(data, result.data?.currentStep || 1);
              if (isMounted) {
                setDraftMessage("Saved draft restored. Please verify your email and WhatsApp again before payment.");
              }
            }
          } catch {
            sessionStorage.removeItem("market-sellers-draft");
            draftCredentials.current = null;
          }
        }
      } catch {
        sessionStorage.removeItem("market-sellers-draft");
        sessionStorage.removeItem(SELLER_SESSION_DRAFT_KEY);
      } finally {
        if (isMounted) setIsDraftHydrated(true);
      }
    };

    void hydrateDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dropdown outside click handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (sourcingDropdownRef.current && !sourcingDropdownRef.current.contains(event.target as Node)) {
        setIsSourcingDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRole = (role: string) => {
    setSelectedRoles((currentRoles) => {
      const updated = currentRoles.includes(role)
        ? currentRoles.filter((r) => r !== role)
        : [...currentRoles, role];
      if (role === "Sourcing Agent" && currentRoles.includes(role)) {
        setSelectedSourcingTypes([]);
      }
      return updated;
    });
  };

  const handleClearRole = () => {
    setSelectedRoles([]);
    setSelectedSourcingTypes([]);
  };

  const handleSelectSourcingType = (name: string) => {
    setSelectedSourcingTypes((currentTypes) =>
      currentTypes.includes(name)
        ? currentTypes.filter((t) => t !== name)
        : [...currentTypes, name]
    );
  };

  const handleClearSourcingType = () => {
    setSelectedSourcingTypes([]);
  };

  const handleContinueFromRoles = async () => {
    if (selectedRoles.length === 0) return;
    if (selectedRoles.includes("Sourcing Agent") && selectedSourcingTypes.length === 0) return;

    // Pre-populate business role in Step 1
    const nextBusinessRole = selectedRoles.includes("Manufacturer")
      ? "Manufacturer"
      : selectedRoles.includes("Sourcing Agent")
        ? "Sourcing Agent"
        : selectedRoles.includes("Supplier / Trader") || selectedRoles.includes("Exporter")
          ? "Supplier"
          : "Service Provider";
    setBusinessRole(nextBusinessRole);

    await saveDraft(1, true, { ...buildPayload(), businessRole: nextBusinessRole });
    setHasChosenRoles(true);
    setCurrentStep(1);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const newStates = countryStates[newCountry] || [];
    if (state && !newStates.some((s) => s.toLowerCase() === state.toLowerCase())) {
      setState("");
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: "",
        category: "",
        specs: "",
        moq: "50 Units",
        sampleAvailability: sampleAvailabilityOptions[0],
        imageName: "",
      },
    ]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof ProductItem, val: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const addCertificate = () => {
    const name = certDropdown === "Custom Certificate" ? certCustomName.trim() : certDropdown;
    if (!name) return;
    setCertificates([
      ...certificates,
      {
        id: Date.now().toString(),
        name,
        issuingBody: certIssuer.trim() || "Accredited Body",
        fileName: certFileName || undefined,
      },
    ]);
    setCertCustomName("");
    setCertIssuer("");
    setCertFileName(null);
  };

  const removeCertificate = (id: string) => {
    setCertificates(certificates.filter((c) => c.id !== id));
  };

  const toggleTargetRegion = (reg: string) => {
    setTargetRegions((prev) => (prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]));
  };

  const toggleIncoterm = (term: string) => {
    setSelectedIncoterms((prev) => (prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]));
  };

  const toggleAuditCapability = (item: string) => {
    setAuditingExpertise((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const toggleCurrency = (cur: string) => {
    setSettlementCurrencies((prev) => (prev.includes(cur) ? prev.filter((c) => c !== cur) : [...prev, cur]));
  };

  const buildPayload = (): Record<string, unknown> => ({
    selectedRoles, selectedSourcingTypes, titleOfServices, chargeType, hourlyCharge,
    customHourlyCharge, fixedCharge, customFixedCharge, companyName, legalBusinessName,
    businessRole, aboutCompany, yearOfEstablishment, contactName, jobTitle, email, marketApplicationId,
    emailVerified, emailVerificationToken, countryCode, customCountryCode, whatsapp,
    whatsappVerified, whatsappVerificationToken, website, streetAddress, locationLandmark,
    country, customCountry, state, city, pincode, products, targetRegions, customRegion,
    moqCapability, customMoq, turnaroundTime, customTurnaroundTime, selectedIncoterms,
    samplePolicy, sourcingRegions, auditingExpertise, networkSize, serviceScope, techStack,
    servicePackages, caseStudies, teamSize, qcCount, sourcingStaffCount, facilityDetails,
    certificates, certDropdown, certCustomName, certIssuer, certFileName, kycJurisdictionTab,
    panNumber, gstinNumber, msmeUdyam, cinNumber,
    iecCode, einNumber, stateLicense, usResaleCert, ukCompaniesHouse, ukVatNumber, ukUtr,
    euVatNumber, euEoriNumber, euCommercialRegister, chinaUscc, chinaBusinessLicense,
    chinaCustomsCode, localTaxId, otherBusinessReg, uploadedKycDoc, accountHolder, bankName,
    accountOrIban, swiftCode, settlementCurrencies, withholdingTaxType, taxResidencyDocName,
    agreedTerms, agreedLeadSharing,
  });

  const persistSessionDraft = (step = currentStep) => {
    if (!isDraftHydrated || submitted) return;

    const sessionDraft: SellerSessionDraft = {
      version: 1,
      formData: buildPayload(),
      currentStep: Math.min(Math.max(step, 1), formSteps.length),
      hasChosenRoles,
    };

    try {
      sessionStorage.setItem(SELLER_SESSION_DRAFT_KEY, JSON.stringify(sessionDraft));
    } catch {
      // Keep the form usable if storage is unavailable or full.
    }
  };

  useEffect(() => {
    persistSessionDraft();
  });

  const saveDraft = (
    step = currentStep,
    showLoader = false,
    payloadOverride?: Record<string, unknown>,
  ) => {
    persistSessionDraft(step);
    const payload = payloadOverride || buildPayload();
    if (showLoader) {
      pendingDraftSaves.current += 1;
      setIsSavingDraft(true);
    }
    draftQueue.current = draftQueue.current
      .catch(() => undefined)
      .then(async () => {
        try {
          const result = await saveMarketDraft("sellers", payload, step, draftCredentials.current);
          if (result.data) {
            draftCredentials.current = { draftId: result.data.draftId, draftToken: result.data.draftToken };
            sessionStorage.setItem("market-sellers-draft", JSON.stringify(draftCredentials.current));
            setDraftMessage("");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to save draft.";
          const requestError = error as Error & {
            code?: string;
            field?: "email" | "whatsapp";
          };
          if (requestError?.code === "MEMBER_EXISTS") {
            if (requestError.field === "whatsapp") {
              setWhatsappRegistrationWarning("This WhatsApp number is already registered. Please use a different number.");
            } else {
              setEmailRegistrationWarning("This email address is already registered. Please use a different email address.");
            }
            setDraftMessage("");
          } else {
            setDraftMessage(message);
          }
        } finally {
          if (showLoader) {
            pendingDraftSaves.current = Math.max(0, pendingDraftSaves.current - 1);
            if (pendingDraftSaves.current === 0) setIsSavingDraft(false);
          }
        }
      });
    return draftQueue.current;
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 120, behavior: "smooth" });
    void saveDraft(step, true);
  };

  const handleNextStep = () => {
    if (emailRegistrationWarning || whatsappRegistrationWarning) return;
    if (currentStep === 1) {
      if (!titleOfServices.trim()) {
        alert("Please enter a Title of Services (up to 70 characters).");
        return;
      }
      if (!companyName.trim()) {
        alert("Please enter your Company Name.");
        return;
      }
      if (!yearOfEstablishment) {
        alert("Please select the Year of Establishment.");
        return;
      }
      if (aboutCompany.trim().length < 100) {
        alert(`About content must be at least 100 characters (currently ${aboutCompany.trim().length} chars).`);
        return;
      }
      if (!contactName.trim() || !email.trim() || !whatsapp.trim()) {
        alert("Please provide Contact Person Name, Email, and WhatsApp number.");
        return;
      }
      if (!streetAddress.trim() || !city.trim() || !pincode.trim()) {
        alert("Please provide complete operating address details (Street address, City, Pincode).");
        return;
      }
    }
    if (currentStep === 2) {
      if (targetRegions.length === 0) {
        alert("Please select at least one Target Export & Sourcing Region.");
        return;
      }
    }
    const nextStep = Math.min(currentStep + 1, formSteps.length);
    setCurrentStep(nextStep);
    window.scrollTo({ top: 120, behavior: "smooth" });
    void saveDraft(nextStep, true);
  };

  const handlePrevStep = () => {
    const previousStep = Math.max(currentStep - 1, 1);
    setCurrentStep(previousStep);
    window.scrollTo({ top: 120, behavior: "smooth" });
    void saveDraft(previousStep, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRegistrationWarning || whatsappRegistrationWarning) return;
    if (!agreedTerms) {
      alert("Please accept the Platform Compliance Agreement to complete seller registration.");
      return;
    }
    if (
      !emailVerified ||
      !emailVerificationToken ||
      (requiresWhatsappVerification && (!whatsappVerified || !whatsappVerificationToken))
    ) {
      alert(requiresWhatsappVerification
        ? "Please verify your business email and WhatsApp number before submitting."
        : "Please verify your business email before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      await saveDraft(currentStep, true);
      const result = await submitMarketForm("sellers", {
        ...buildPayload(),
        ...draftCredentials.current,
      });
      if (!result.data) throw new Error("Payment details were not returned.");
      sessionStorage.setItem(
        "market_payment_data",
        JSON.stringify({ form: "sellers", payment: result.data }),
      );
      router.push(
        `/payments?form=sellers&id=${result.data.applicationId}&token=${encodeURIComponent(result.data.accessToken)}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit the form. Please try again.";
      const requestError = error as Error & {
        code?: string;
        field?: "email" | "whatsapp";
      };
      if (requestError?.code === "MEMBER_EXISTS") {
        if (requestError.field === "whatsapp") {
          setWhatsappRegistrationWarning("This WhatsApp number is already registered. Please use a different number.");
        } else {
          setEmailRegistrationWarning("This email address is already registered. Please use a different email address.");
        }
        setCurrentStep(1);
      } else {
        alert(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isContinueFromRolesDisabled =
    selectedRoles.length === 0 ||
    (selectedRoles.includes("Sourcing Agent") && selectedSourcingTypes.length === 0);

  return (
    <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      {isSavingDraft && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/35 backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Saving your progress"
        >
          <Loader2 className="size-9 animate-spin text-primary drop-shadow-sm" />
        </div>
      )}
      {/* Sticky Top Navbar - Exactly Matching /buyers */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 ${
          isScrolled
            ? "border-b border-border/40 bg-background/85 backdrop-blur-md shadow-xs"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo compactOnMobile />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex gap-2 hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                <span>Back to Market</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden md:inline-flex hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Link href="/terms">Terms</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Ambient Flow Section - In-flow expansion prevents dropdown clipping */}
      <section className="relative -mt-16 scroll-mt-24 hero-ambient-flow pt-24 pb-24 sm:pb-32 flex-1">
        {/* Floating Ambient Glow Orbs with their own isolated overflow-hidden */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="animate-float-slow absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-reverse absolute -right-20 top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-drift absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-600/15 sm:h-80 sm:w-80" />
          <div className="animate-float-slow absolute right-1/4 bottom-16 h-64 w-64 rounded-full bg-rose-200/25 blur-3xl dark:bg-rose-600/10 sm:h-72 sm:w-72" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="mb-8 text-center space-y-2">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              List Your Services for U.S. and Global Buyers
            </h1>

            {hasChosenRoles && selectedRoles.length > 0 && (
              <div className="flex items-center justify-center flex-wrap gap-2 pt-1 text-xs sm:text-sm text-muted-foreground">
                <span>Selected Roles:</span>
                <span className="font-semibold text-foreground">
                  {selectedRoles.join(", ")}
                  {selectedSourcingTypes.length > 0 && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      ({selectedSourcingTypes.length} sourcing specializations)
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHasChosenRoles(false)}
                  className="h-6 px-2.5 text-xs font-semibold rounded-full cursor-pointer hover:bg-muted"
                >
                  Change Roles
                </Button>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* SCREEN 1: OPENING ROLE QUESTION                              */}
          {/* ============================================================ */}
          {!hasChosenRoles ? (
            <div className="mx-auto max-w-2xl">
              <Card className="border-border/60 bg-card/95 shadow-lg backdrop-blur-md p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    What Type of Sourcing Partner Are You?
                  </h2>

                </div>

                {/* 1. Primary Role Dropdown */}
                <div ref={roleDropdownRef} className="space-y-1.5">
                  {/* Trigger Input matching standard design system */}
                  <div
                    onClick={() => {
                      setIsRoleDropdownOpen((prev) => !prev);
                      setIsSourcingDropdownOpen(false);
                    }}
                    className={`w-full min-h-[50px] p-3 bg-background border rounded-md transition-all cursor-pointer flex items-center justify-between gap-2.5 shadow-xs hover:bg-accent/20 ${
                      isRoleDropdownOpen
                        ? "border-primary ring-2 ring-primary/20"
                        : selectedRoles.length > 0
                        ? "border-primary/80 bg-primary/5"
                        : "border-input"
                    }`}
                  >
                    <div className="flex-1 flex items-center min-w-0">
                      {selectedRoles.length === 0 ? (
                        <span className="text-xs sm:text-sm text-muted-foreground font-normal truncate">
                          Click to choose your role (Manufacturer, Supplier, Exporter...)...
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          {selectedRoles.map((role) => (
                            <span
                              key={role}
                              className="inline-flex items-center gap-1 py-0.5 px-2 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-md"
                            >
                              <Check className="size-3 text-primary stroke-[3]" />
                              <span>{role}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedRoles.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearRole();
                          }}
                          className="text-[11px] uppercase font-semibold text-muted-foreground hover:text-rose-500 transition-colors pr-2 border-r border-border cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 text-muted-foreground ${
                          isRoleDropdownOpen ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Role Dropdown Menu Options Panel - Rendered in-flow so it expands the card */}
                  {isRoleDropdownOpen && (
                    <div className="mt-2 w-full rounded-lg border border-border/80 bg-background/95 shadow-md overflow-hidden divide-y divide-border/60 backdrop-blur-md">
                      {PRIMARY_ROLES.map((role) => {
                        const isSelected = selectedRoles.includes(role);
                        return (
                          <div
                            key={role}
                            onClick={() => handleSelectRole(role)}
                            className={`p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer transition-colors select-none ${
                              isSelected
                                ? "bg-primary/10 text-primary font-bold"
                                : "hover:bg-muted/60 text-foreground"
                            }`}
                          >
                            {/* Multi-select Checkbox */}
                            <div
                              className={`size-4.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-background"
                              }`}
                            >
                              {isSelected && <Check className="size-3 text-primary-foreground stroke-[3]" />}
                            </div>

                            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                              {role}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Sub-Dropdown: SOURCING AGENT SPECIALIZATION */}
                {selectedRoles.includes("Sourcing Agent") && (
                  <div
                    ref={sourcingDropdownRef}
                    className="space-y-2 pt-2 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-primary" />
                        SELECT SOURCING SPECIALIZATION
                      </span>
                      {selectedSourcingTypes.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {selectedSourcingTypes.length} selected
                        </Badge>
                      )}
                    </div>

                    {/* Sub-dropdown Trigger Input */}
                    <div
                      onClick={() => {
                        setIsSourcingDropdownOpen((prev) => !prev);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full min-h-[50px] p-3 bg-background border rounded-md transition-all cursor-pointer flex items-center justify-between gap-2.5 shadow-xs hover:bg-accent/20 ${
                        isSourcingDropdownOpen
                          ? "border-primary ring-2 ring-primary/20"
                          : selectedSourcingTypes.length > 0
                          ? "border-primary/80 bg-primary/5"
                          : "border-input"
                      }`}
                    >
                      <div className="flex-1 flex items-center min-w-0">
                        {selectedSourcingTypes.length === 0 ? (
                          <span className="text-xs sm:text-sm text-muted-foreground font-normal truncate">
                            Choose Sourcing Agent type (Alibaba, 1688, IndiaMART, FBA, Dropshipping...)...
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                            {selectedSourcingTypes.map((type) => (
                              <span
                                key={type}
                                className="inline-flex items-center gap-1 py-0.5 px-2 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold rounded-md"
                              >
                                <Check className="size-3 text-primary stroke-[3]" />
                                <span>{type}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {selectedSourcingTypes.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearSourcingType();
                            }}
                            className="text-[11px] uppercase font-semibold text-muted-foreground hover:text-rose-500 transition-colors pr-2 border-r border-border cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                        <ChevronDown
                          className={`size-4 transition-transform duration-200 text-muted-foreground ${
                            isSourcingDropdownOpen ? "rotate-180 text-foreground" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Sourcing Dropdown Menu Panel (25 Options with Search & Icons) - Rendered in-flow so it expands the card */}
                    {isSourcingDropdownOpen && (
                      <div className="mt-2 w-full bg-background/95 border border-border/80 shadow-md rounded-lg overflow-hidden flex flex-col backdrop-blur-md">
                        <div className="p-2.5 bg-muted/60 border-b border-border/60 flex items-center justify-between text-xs shrink-0">
                        
                          {selectedSourcingTypes.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearSourcingType}
                              className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                            >
                              Clear Selection
                            </button>
                          )}
                        </div>

                        {/* Search Filter */}
                        <div className="relative border-b border-border/40 p-2 bg-background/90">
                          <Search className="pointer-events-none absolute left-4 top-3.5 size-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Filter 25 sourcing specializations (e.g. Alibaba, India, Dropshipping, Inspection...)"
                            value={sourcingSearch}
                            onChange={(e) => setSourcingSearch(e.target.value)}
                            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                          />
                        </div>

                        <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-border/60 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
                          {filteredSourcingTypes.map((agent) => {
                            const isSelected = selectedSourcingTypes.includes(agent.name);
                            return (
                              <div
                                key={agent.id}
                                onClick={() => handleSelectSourcingType(agent.name)}
                                className={`p-2.5 sm:p-3 flex items-center gap-3 cursor-pointer transition-colors select-none ${
                                  isSelected
                                    ? "bg-primary/10 text-primary font-bold"
                                    : "hover:bg-muted/60 text-foreground"
                                }`}
                              >
                                {/* Checkbox */}
                                <div
                                  className={`size-4.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-input bg-background"
                                  }`}
                                >
                                  {isSelected && <Check className="size-3 text-primary-foreground stroke-[3]" />}
                                </div>

                                {/* Icon */}
                                <div className="size-8 sm:size-9 shrink-0 p-1 bg-background border border-border/80 rounded-md flex items-center justify-center shadow-2xs">
                                  <img src={agent.image} alt="" className="size-full object-contain" />
                                </div>

                                {/* Title */}
                                <span className="text-xs sm:text-sm font-medium flex-1">
                                  {agent.name}
                                </span>

                                {isSelected && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            );
                          })}

                          {filteredSourcingTypes.length === 0 && (
                            <div className="p-4 text-center text-xs text-muted-foreground">
                              No matching sourcing specializations for &quot;{sourcingSearch}&quot;.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Continue Button - Using standard Primary Button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => void handleContinueFromRoles()}
                    disabled={isContinueFromRolesDisabled || isSavingDraft}
                    className="w-full py-6 text-sm sm:text-base font-semibold shadow-md gap-2"
                  >
                    <span>Continue to Partner Registration</span>
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    You can modify your roles or add specialized services at any stage.
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            /* ============================================================ */
            /* SCREEN 2: 5-STEP REGISTRATION FORM (Connected Stepper)        */
            /* ============================================================ */
            <div>
              {/* Horizontal Stepper - Exactly matching user reference */}
              <div className="mb-10 w-full overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-2 scrollbar-none">
                <div className="flex items-start min-w-[620px] sm:min-w-full">
                  {formSteps.map((step, idx) => {
                    const isCurrent = step.id === currentStep;
                    const isDone = step.id < currentStep;
                    const isLast = idx === formSteps.length - 1;

                    return (
                      <div key={step.id} className="flex flex-1 items-start last:flex-none">
                        {/* Circle Node & Label Underneath */}
                        <button
                          type="button"
                          onClick={() => void goToStep(step.id)}
                          disabled={isSavingDraft || step.id === currentStep}
                          className="group flex flex-col items-center text-center focus:outline-none cursor-pointer"
                        >
                          {/* Circle */}
                          <div
                            className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                              isCurrent
                                ? "border-[3px] border-primary bg-background text-primary shadow-md ring-4 ring-primary/20 scale-105"
                                : isDone
                                ? "border-[3px] border-primary bg-primary text-primary-foreground shadow-xs"
                                : "border-2 border-primary/30 bg-background/80 text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                            }`}
                          >
                            {isDone ? (
                              <Check className="size-4 stroke-[3]" />
                            ) : (
                              <span>{step.id}</span>
                            )}
                          </div>

                          {/* Step Title Underneath */}
                          <span
                            className={`mt-2.5 max-w-[85px] sm:max-w-[95px] text-center text-xs leading-tight transition-colors ${
                              isCurrent
                                ? "font-bold text-foreground"
                                : isDone
                                ? "font-medium text-foreground/80"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {step.title}
                          </span>
                        </button>

                        {/* Connecting Line to next circle */}
                        {!isLast && (
                          <div className="relative flex-1 mt-5 px-1">
                            <div
                              className={`h-0.5 w-full rounded-full transition-colors duration-300 ${
                                step.id < currentStep
                                  ? "bg-primary"
                                  : "bg-primary/25 dark:bg-primary/25"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Content or Success Card */}
              {submitted ? (
                <Card className="border-emerald-200 bg-emerald-50/50 p-8 sm:p-10 text-center shadow-lg dark:border-emerald-900/50 dark:bg-emerald-950/20 backdrop-blur-sm">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-foreground">Registration Submitted Successfully!</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                    Your Partner ID: <strong className="text-foreground">VSP-2026-9931</strong>. Your seller profile and KYC credentials are now under priority review by our compliance team.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Your Basic B2B premium plan is active for one month. Use the dashboard credentials sent to your email.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button onClick={() => { setSubmitted(false); setCurrentStep(1); }}>
                      Review &amp; Edit Details
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">Back to Homepage</Link>
                    </Button>
                  </div>
                </Card>
              ) : paymentDetails ? (
                <MarketVerificationPayment
                  form="sellers"
                  payment={paymentDetails}
                  onPaid={() => {
                    sessionStorage.removeItem("market-sellers-draft");
                    sessionStorage.removeItem(SELLER_SESSION_DRAFT_KEY);
                    setPaymentDetails(null);
                    setSubmitted(true);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                />
              ) : (
                <form onSubmit={handleSubmit} onBlurCapture={() => void saveDraft(currentStep)} className="space-y-6">
                  {draftMessage && (
                    <p className={`text-center text-xs ${/already|unable|no longer/i.test(draftMessage) ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                      {draftMessage}
                    </p>
                  )}

                  {/* ============================================================ */}
                  {/* STEP 1: Basic Information, Address & Contact Details */}
                  {/* ============================================================ */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                      <CardHeader className="border-b border-border/40 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Building2 className="size-4" />
                          </span>
                          <div>
                            <CardTitle className="text-lg">Basic Information &amp; Identification</CardTitle>
                            
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                        {/* Title Of Services (within 70 characters - mandatory) */}
                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Title Of Services <span className="text-rose-500">*</span>
                            </label>
                            <span className={`text-[11px] font-medium ${titleOfServices.length > 70 ? "text-rose-500" : "text-muted-foreground"}`}>
                              {titleOfServices.length}/70 characters
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={70}
                            placeholder="e.g. Verified CNC Machining, Electronics & Sourcing Partner"
                            value={titleOfServices}
                            onChange={(e) => setTitleOfServices(capitalizeFirst(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Charges: Hourly $5 to $150 or Fixed $50 to $5000 */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Charges &amp; Pricing Model <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3 mb-2.5">
                            <button
                              type="button"
                              onClick={() => setChargeType("hourly")}
                              className={`rounded-md border py-2.5 text-xs font-semibold shadow-xs transition-all ${
                                chargeType === "hourly"
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-background text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              Hourly ($5 to $150)
                            </button>
                            <button
                              type="button"
                              onClick={() => setChargeType("fixed")}
                              className={`rounded-md border py-2.5 text-xs font-semibold shadow-xs transition-all ${
                                chargeType === "fixed"
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-input bg-background text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              Fixed Charges ($50 to $5,000)
                            </button>
                          </div>

                          {chargeType === "hourly" ? (
                            <div className="space-y-2">
                              <select
                                value={hourlyCharge}
                                onChange={(e) => setHourlyCharge(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                {hourlyRateOptions.map((h) => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                              {hourlyCharge === "Custom Hourly" && (
                                <input
                                  type="text"
                                  placeholder="Enter custom hourly rate (e.g. $ 45 / hr)"
                                  value={customHourlyCharge}
                                  onChange={(e) => setCustomHourlyCharge(capitalizeFirst(e.target.value))}
                                  className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <select
                                value={fixedCharge}
                                onChange={(e) => setFixedCharge(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                {fixedRateOptions.map((f) => (
                                  <option key={f} value={f}>{f}</option>
                                ))}
                              </select>
                              {fixedCharge === "Custom Fixed" && (
                                <input
                                  type="text"
                                  placeholder="Enter custom fixed fee (e.g. $ 750 / project)"
                                  value={customFixedCharge}
                                  onChange={(e) => setCustomFixedCharge(capitalizeFirst(e.target.value))}
                                  className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Company Name */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Company Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Apex Precision Ltd."
                            value={companyName}
                            onChange={(e) => setCompanyName(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Legal Business Name */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Legal Business Name
                            </label>
                            <span className="text-[11px] text-muted-foreground">Optional</span>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Apex Precision Technologies Pvt Ltd"
                            value={legalBusinessName}
                            onChange={(e) => setLegalBusinessName(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Business Role */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Primary Business Role <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {businessRoles.map((role) => (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setBusinessRole(role)}
                                className={`rounded-md border py-2 px-3 text-xs font-semibold text-center transition-all ${
                                  businessRole === role
                                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                    : "border-input bg-background text-foreground hover:bg-muted"
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Year of Establishment */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Year of Establishment <span className="text-rose-500">*</span>
                          </label>
                          <select
                            required
                            value={yearOfEstablishment}
                            onChange={(e) => setYearOfEstablishment(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                          >
                            <option value="">Select Year of Establishment...</option>
                            {establishmentYears.map((yr) => (
                              <option key={yr} value={yr}>
                                {yr}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* About Me / Company - Min 100 chars */}
                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              About Me / Company <span className="text-rose-500">*</span>
                            </label>
                            <span className={`text-[11px] font-medium ${aboutCompany.trim().length >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                              {aboutCompany.trim().length} / 100 chars minimum
                            </span>
                          </div>
                          <textarea
                            required
                            rows={4}
                            placeholder="Describe your manufacturing or sourcing strengths, engineering capabilities, machinery, and global client experience (minimum 100 characters)..."
                            value={aboutCompany}
                            onChange={(e) => setAboutCompany(capitalizeFirst(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                      <CardHeader className="border-b border-border/40 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Phone className="size-4" />
                          </span>
                          <div>
                            <CardTitle className="text-lg">Contact &amp; Operating Address Details</CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                        {/* Primary Contact Person */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Primary Contact Person <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. John Doe / Rajesh Patel"
                            value={contactName}
                            onChange={(e) => setContactName(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Job Title */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Job Title / Designation <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Managing Director / Sourcing Head"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Business Email Address with Verification */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Business Email <span className="text-rose-500">*</span>
                            </label>
                            <span className={`text-[11px] font-medium ${emailVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                              {emailVerified ? "Verified ✓" : "Verification Required"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Mail className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                              <input
                                type="email"
                                required
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  setEmailVerified(false);
                                  setEmailVerificationToken("");
                                  setEmailRegistrationWarning("");
                                }}
                                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            <OtpVerificationButton
                              channel="email"
                              marketForm="sellers"
                              marketApplicationId={marketApplicationId}
                              onMarketApplicationCreated={setMarketApplicationId}
                              relatedWhatsapp={buildWhatsappNumber(countryCode, customCountryCode, whatsapp)}
                              target={email.trim().toLowerCase()}
                              verified={emailVerified}
                              onVerified={(token) => {
                                setEmailVerificationToken(token);
                                setEmailVerified(true);
                              }}
                              onAvailabilityChange={(available, message) => {
                                setEmailRegistrationWarning(available ? "" : message || "This email address is already registered.");
                              }}
                              className="px-3"
                            />
                          </div>
                          {emailRegistrationWarning && (
                            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                              {emailRegistrationWarning}
                            </p>
                          )}
                        </div>

                        {/* WhatsApp Phone Number with Country Code Dropdown */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              WhatsApp Number <span className="text-rose-500">*</span>
                            </label>
                            <span className={`text-[11px] font-medium ${whatsappVerified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                              {requiresWhatsappVerification
                                ? whatsappVerified ? "Verified ✓" : "OTP Required for India"
                                : "Email verification only"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <CountryCodeSelect
                              value={countryCode}
                              onChange={(value) => {
                                setCountryCode(value);
                                setWhatsappVerified(false);
                                setWhatsappVerificationToken("");
                                setWhatsappRegistrationWarning("");
                              }}
                            />
                            {countryCode === "custom" && (
                              <input
                                type="text"
                                placeholder="+..."
                                value={customCountryCode}
                                onChange={(e) => {
                                  setCustomCountryCode(e.target.value);
                                  setWhatsappVerified(false);
                                  setWhatsappVerificationToken("");
                                  setWhatsappRegistrationWarning("");
                                }}
                                className="w-16 rounded-md border border-input bg-background px-2.5 py-2 text-xs text-foreground shadow-xs focus:border-primary focus:outline-none"
                              />
                            )}
                            <div className="relative flex-1">
                              <Phone className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                              <input
                                type="tel"
                                required
                                placeholder="98765 43210"
                                value={whatsapp}
                                onChange={(e) => {
                                  setWhatsapp(e.target.value);
                                  setWhatsappVerified(false);
                                  setWhatsappVerificationToken("");
                                  setWhatsappRegistrationWarning("");
                                }}
                                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                            {requiresWhatsappVerification ? (
                              <OtpVerificationButton
                                channel="whatsapp"
                                marketForm="sellers"
                                marketApplicationId={marketApplicationId}
                                onMarketApplicationCreated={setMarketApplicationId}
                                relatedEmail={email.trim().toLowerCase()}
                                target={buildWhatsappNumber(countryCode, customCountryCode, whatsapp)}
                                verified={whatsappVerified}
                                onVerified={(token) => {
                                  setWhatsappVerificationToken(token);
                                  setWhatsappVerified(true);
                                }}
                                onAvailabilityChange={(available, message) => {
                                  setWhatsappRegistrationWarning(available ? "" : message || "This WhatsApp number is already registered.");
                                }}
                                className="px-3"
                              />
                            ) : null}
                          </div>
                          {whatsappRegistrationWarning && (
                            <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                              {whatsappRegistrationWarning}
                            </p>
                          )}
                        </div>

                        {/* Official Website */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Official Website
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.company.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Street Address */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Street Address / Industrial Area <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Plot 42, GIDC Industrial Estate, Phase 2"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Location / Landmark */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Location / Landmark
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Near Central Logistics Hub"
                            value={locationLandmark}
                            onChange={(e) => setLocationLandmark(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Country with Flag Dropdown */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Country <span className="text-rose-500">*</span>
                          </label>
                          <CountrySelect value={country} onChange={handleCountryChange} />
                          {country === "Other Country" && (
                            <input
                              type="text"
                              required
                              placeholder="Enter country name..."
                              value={customCountry}
                              onChange={(e) => setCustomCountry(capitalizeWords(e.target.value))}
                              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-xs focus:border-primary focus:outline-none"
                            />
                          )}
                        </div>

                        {/* State (Dynamic searchable select) */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            State / Province <span className="text-rose-500">*</span>
                          </label>
                          <StateSelect country={country} value={state} onChange={setState} />
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            City <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ahmedabad / Shenzhen"
                            value={city}
                            onChange={(e) => setCity(capitalizeWords(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Pincode */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Pincode / Postal Code <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 382445 / 518000"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.toUpperCase())}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ============================================================ */}
                {/* STEP 2: Operational & Sourcing Capabilities */}
                {/* ============================================================ */}
                {currentStep === 2 && (
                    <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                      <CardHeader className="border-b border-border/40 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Package className="size-4" />
                          </span>
                          <div>
                            <CardTitle className="text-lg">Operational &amp; Sourcing Capabilities</CardTitle>
                            
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 pt-6">
                        {/* Target Export and Import Countries */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Target Export &amp; Sourcing Regions Served <span className="text-rose-500">*</span>
                            </label>
                            {targetRegions.length > 0 && (
                              <span className="text-[11px] font-semibold text-primary">
                                {targetRegions.length} selected
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {targetRegionOptions.map((region) => {
                              const isSelected = targetRegions.includes(region.name);
                              return (
                                <button
                                  key={region.name}
                                  type="button"
                                  onClick={() => toggleTargetRegion(region.name)}
                                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                                    isSelected
                                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
                                      : "border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                                  }`}
                                >
                                  {isSelected ? (
                                    <Check className="size-3.5 text-primary stroke-[3]" />
                                  ) : (
                                    <span className="text-muted-foreground/70 font-bold">+</span>
                                  )}
                                  {region.flag ? (
                                    <img
                                      src={region.flag}
                                      alt=""
                                      className="h-3.5 w-5 rounded-[2px] object-cover border border-black/10 shrink-0"
                                    />
                                  ) : (
                                    <Globe className="size-3.5 text-cyan-500 shrink-0" />
                                  )}
                                  <span>{region.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          {/* MOQ Capabilities */}
                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Minimum Order Quantity (MOQ) <span className="text-rose-500">*</span></span>
                            </label>
                            <select
                              value={moqCapability}
                              onChange={(e) => setMoqCapability(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                              {moqOptions.map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                            {moqCapability === "Custom MOQ" && (
                              <input
                                type="text"
                                placeholder="Enter custom MOQ (e.g. 5 Units prototype)"
                                value={customMoq}
                                onChange={(e) => setCustomMoq(capitalizeFirst(e.target.value))}
                                className="mt-2 w-full rounded-md border border-input bg-background px-3.5 py-1.5 text-xs text-foreground shadow-xs focus:border-primary focus:outline-none"
                              />
                            )}
                          </div>

                          {/* Turnaround Time */}
                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Average Turnaround Time (TAT) <span className="text-rose-500">*</span></span>
                            </label>
                            <select
                              value={turnaroundTime}
                              onChange={(e) => setTurnaroundTime(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                              {turnaroundTimeOptions.map((t) => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            {turnaroundTime === "Custom TAT" && (
                              <input
                                type="text"
                                placeholder="Enter custom TAT (e.g. 10 Days Express)"
                                value={customTurnaroundTime}
                                onChange={(e) => setCustomTurnaroundTime(capitalizeFirst(e.target.value))}
                                className="mt-2 w-full rounded-md border border-input bg-background px-3.5 py-1.5 text-xs text-foreground shadow-xs focus:border-primary focus:outline-none"
                              />
                            )}
                          </div>
                        </div>

                        {/* Logistics & Incoterms */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Logistics &amp; Incoterms Handled <span className="text-rose-500">*</span>
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {incotermsOptions.map((term) => {
                              const isSelected = selectedIncoterms.includes(term);
                              return (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => toggleIncoterm(term)}
                                  className={`rounded-md border py-2 text-xs font-semibold text-center transition-all ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                      : "border-input bg-background text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  {term}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* ============================================================ */}
                  {/* STEP 3: Catalog, Portfolio & Service Offerings */}
                  {/* ============================================================ */}
                  {currentStep === 3 && (
                    <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                      <CardHeader className="border-b border-border/40 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Layers className="size-4" />
                          </span>
                          <div>
                            <CardTitle className="text-lg">Catalog, Portfolio &amp; Service Offerings</CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 pt-6">
                        {/* Sample Availability Policy */}
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Sample Availability Terms <span className="text-rose-500">*</span></span>
                            </label>
                            <select
                              value={samplePolicy}
                              onChange={(e) => setSamplePolicy(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                              {sampleAvailabilityOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                              <option value="Custom Sample Terms">Custom Sample Terms</option>
                            </select>
                          </div>

                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Verified Manufacturer Network Size <span className="text-rose-500">*</span></span>
                            </label>
                            <select
                              value={networkSize}
                              onChange={(e) => setNetworkSize(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                              <option value="10 to 50 Verified Factories">10 to 50 Verified Factories</option>
                              <option value="50 to 100 Verified Factories">50 to 100 Verified Factories</option>
                              <option value="100 to 250 Verified Factories">100 to 250 Verified Factories</option>
                              <option value="250+ Verified Factories">250+ Verified Factories</option>
                              <option value="Sole In-House Manufacturing">Sole In-House Manufacturing Facility</option>
                            </select>
                          </div>
                        </div>

                        {/* Sourcing Agent Portfolio */}
                        <div className="space-y-4 rounded-lg border border-border/70 bg-background/50 p-4">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                            Sourcing Agent Portfolio
                          </h3>

                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Sourcing Regions Covered &amp; Industrial Hubs <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Shenzhen, Dongguan, Ningbo (China) | Delhi NCR, Gujarat, Tirupur (India)"
                              value={sourcingRegions}
                              onChange={(e) => setSourcingRegions(capitalizeFirst(e.target.value))}
                              className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Factory Auditing &amp; Quality Inspection Expertise <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "On-site Factory Audit",
                                "Pre-shipment Inspection",
                                "Production Monitoring",
                                "Social Compliance Audit",
                                "Container Loading Check",
                                "Lab Chemical Testing",
                              ].map((item) => {
                                const isSelected = auditingExpertise.includes(item);
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleAuditCapability(item)}
                                    className={`rounded-md border p-2 text-xs font-medium text-left transition-all cursor-pointer ${
                                      isSelected
                                        ? "border-primary bg-primary/10 text-primary font-semibold"
                                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                                    }`}
                                  >
                                    {isSelected ? "✓ " : "+ "} {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Service Provider Portfolio */}
                        <div className="space-y-4 rounded-lg border border-border/70 bg-background/50 p-4">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                            Service Provider Portfolio
                          </h3>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Scope of Work <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. End-to-end OEM/ODM Sourcing, Design &amp; Customs Brokerage"
                                value={serviceScope}
                                onChange={(e) => setServiceScope(capitalizeFirst(e.target.value))}
                                className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Technical Stack / Engineering Software
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. SolidWorks, AutoCAD, ERP, 3D Prototyping, PLM"
                                value={techStack}
                                onChange={(e) => setTechStack(capitalizeWords(e.target.value))}
                                className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Service Packages
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Basic Sourcing | Full Turnkey OEM/ODM | Quality Inspection Retainer"
                                value={servicePackages}
                                onChange={(e) => setServicePackages(capitalizeFirst(e.target.value))}
                                className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Past Project Case Studies
                              </label>
                              <textarea
                                rows={2}
                                placeholder="Describe notable past export or sourcing deliverables, volume handled, client satisfaction, or certifications achieved..."
                                value={caseStudies}
                                onChange={(e) => setCaseStudies(capitalizeFirst(e.target.value))}
                                className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* ============================================================ */}
                  {/* STEP 4: Infrastructure, Capacity & Team */}
                  {/* ============================================================ */}
                  {currentStep === 4 && (
                    <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                      <CardHeader className="border-b border-border/40 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Award className="size-4" />
                          </span>
                          <div>
                            <CardTitle className="text-lg">Infrastructure, Capacity &amp; Team Certifications</CardTitle>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 pt-6">
                        {/* Team & Workforce Counts */}
                        <div className="grid gap-5 sm:grid-cols-3">
                          {/* Total Team Size */}
                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Total Team Size &amp; Workforce <span className="text-rose-500">*</span></span>
                            </label>
                            <select
                              value={teamSize}
                              onChange={(e) => setTeamSize(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                              {teamSizeOptions.map((t) => (
                                <option key={t} value={t}>{t} Staff</option>
                              ))}
                            </select>
                          </div>

                          {/* Dedicated QC Staff Count */}
                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Dedicated Quality Control (QC) Count <span className="text-rose-500">*</span></span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              placeholder="e.g. 8"
                              value={qcCount}
                              onChange={(e) => setQcCount(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* Dedicated Sourcing Staff Count */}
                          <div className="flex flex-col justify-between h-full">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 min-h-[2rem] flex items-end">
                              <span>Dedicated Sourcing Staff Count <span className="text-rose-500">*</span></span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              required
                              placeholder="e.g. 12"
                              value={sourcingStaffCount}
                              onChange={(e) => setSourcingStaffCount(e.target.value)}
                              className="w-full h-10 rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        {/* Facility Details */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Facility Details (Warehouse Size, Plant Sq. Footage or Office Setup) <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="e.g. 35,000 Sq. Ft. manufacturing plant with CNC milling shop floor, 15,000 Sq. Ft. bonded warehouse, and cleanroom assembly area..."
                            value={facilityDetails}
                            onChange={(e) => setFacilityDetails(capitalizeFirst(e.target.value))}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {/* Certifications & Quality Standards */}
                        <div className="space-y-3 rounded-lg border border-border/70 bg-background/50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                                Certifications &amp; Quality Standards
                              </h3>
                              <p className="text-[11px] text-muted-foreground">
                                Select from international, regional, or third-party approvals, attach documentation, and add to your verified profile.
                              </p>
                            </div>
                          </div>

                          {/* Certificate Adder Row */}
                          <div className="flex flex-col sm:flex-row gap-2.5 p-3 rounded-lg border border-border/70 bg-card shadow-xs">
                            <select
                              value={certDropdown}
                              onChange={(e) => setCertDropdown(e.target.value)}
                              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
                            >
                              {certificationGroups.map((grp) => (
                                <optgroup key={grp.group} label={grp.group}>
                                  {grp.items.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>

                            {certDropdown === "Custom Certificate" && (
                              <input
                                type="text"
                                placeholder="Certificate Name..."
                                value={certCustomName}
                                onChange={(e) => setCertCustomName(capitalizeFirst(e.target.value))}
                                className="w-full sm:w-44 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                              />
                            )}

                            <input
                              type="text"
                              placeholder="Issuing Body (e.g. TÜV / SGS / BIS)"
                              value={certIssuer}
                              onChange={(e) => setCertIssuer(capitalizeWords(e.target.value))}
                              className="w-full sm:w-40 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                            />

                            {/* Certificate File Upload Option */}
                            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-dashed border-input bg-background text-xs text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors">
                              <Paperclip className="size-3.5 text-primary" />
                              <span className="truncate max-w-[120px]">
                                {certFileName ? certFileName : "Upload Cert"}
                              </span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setCertFileName(e.target.files[0].name);
                                  }
                                }}
                              />
                            </label>

                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={addCertificate}
                              className="h-8 gap-1 text-xs shrink-0 cursor-pointer"
                            >
                              <Plus className="size-3.5" /> Add Certificate
                            </Button>
                          </div>

                          {/* Render added certificates */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {certificates.map((cert) => (
                              <div
                                key={cert.id}
                                className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-foreground shadow-2xs"
                              >
                                <FileCheck2 className="size-4 text-primary shrink-0" />
                                <div>
                                  <span className="font-semibold text-primary">{cert.name}</span>
                                  <span className="text-muted-foreground ml-1.5">({cert.issuingBody})</span>
                                  {cert.fileName && (
                                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                      <Paperclip className="size-3" /> {cert.fileName}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCertificate(cert.id)}
                                  className="text-muted-foreground hover:text-rose-500 ml-2 cursor-pointer"
                                  title="Remove certificate"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* ============================================================ */}
                  {/* STEP 5: Country-Specific Legal, Tax & Banking Setup */}
                  {/* ============================================================ */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      {(() => {
                    const defaultJurisdiction =
                      country === "India"
                        ? "India"
                        : country === "United States"
                        ? "United States"
                        : country === "United Kingdom"
                        ? "United Kingdom"
                        : country === "China"
                        ? "China"
                        : country === "Germany"
                        ? "European Union (EU)"
                        : "Other Global Regions";
                    const activeJurisdiction = kycJurisdictionTab || defaultJurisdiction;

                    return (
                      <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                        <CardHeader className="border-b border-border/40 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <ShieldCheck className="size-4" />
                            </span>
                            <div>
                              <CardTitle className="text-lg">Country-Specific Legal, Tax &amp; Compliance (KYC)</CardTitle>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                          {/* Jurisdiction Selector Tabs */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Select Compliance Jurisdiction
                              </label>
                              <span className="text-[11px] text-muted-foreground">
                                Operating Country: <strong className="text-foreground">{country}</strong>
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {kycJurisdictions.map((jur) => {
                                const isSelected = activeJurisdiction === jur.name;
                                return (
                                  <button
                                    key={jur.name}
                                    type="button"
                                    onClick={() => setKycJurisdictionTab(jur.name)}
                                    className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-primary text-primary-foreground shadow-xs"
                                        : "border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                  >
                                    {jur.flag ? (
                                      <img
                                        src={jur.flag}
                                        alt=""
                                        className="h-3.5 w-5 rounded-[2px] object-cover border border-black/10 shrink-0"
                                      />
                                    ) : (
                                      <Globe className="size-3.5 text-cyan-500 shrink-0" />
                                    )}
                                    <span>{jur.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Country-Specific Compliance Fields */}
                          <div className="grid gap-5 sm:grid-cols-2">
                            {/* 1. INDIA */}
                            {activeJurisdiction === "India" && (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    PAN Number (Company / Individual) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={10}
                                    placeholder="e.g. ABCDE1234F"
                                    value={panNumber}
                                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    GSTIN Number <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={15}
                                    placeholder="e.g. 24ABCDE1234F1Z5"
                                    value={gstinNumber}
                                    onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    MSME / Udyam Registration Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. UDYAM-GJ-01-0012345"
                                    value={msmeUdyam}
                                    onChange={(e) => setMsmeUdyam(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    CIN / LLPIN (Corporate Identity No.)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. U72900GJ2020PTC114567"
                                    value={cinNumber}
                                    onChange={(e) => setCinNumber(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    IEC Code (Import Export Code)
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={10}
                                    placeholder="e.g. 0512345678"
                                    value={iecCode}
                                    onChange={(e) => setIecCode(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>
                              </>
                            )}

                            {/* 2. UNITED STATES */}
                            {activeJurisdiction === "United States" && (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    EIN (Employer Identification Number) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. 12-3456789"
                                    value={einNumber}
                                    onChange={(e) => setEinNumber(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    State Business License Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. CA-CORP-987654"
                                    value={stateLicense}
                                    onChange={(e) => setStateLicense(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Resale Certificate / Sales Tax ID
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. RES-99887766-TAX"
                                    value={usResaleCert}
                                    onChange={(e) => setUsResaleCert(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* 3. UNITED KINGDOM */}
                            {activeJurisdiction === "United Kingdom" && (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Companies House Registration Number <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. 01234567"
                                    value={ukCompaniesHouse}
                                    onChange={(e) => setUkCompaniesHouse(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    VAT Registration Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. GB 123 4567 89"
                                    value={ukVatNumber}
                                    onChange={(e) => setUkVatNumber(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Unique Taxpayer Reference (UTR)
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={10}
                                    placeholder="e.g. 10-digit UTR"
                                    value={ukUtr}
                                    onChange={(e) => setUkUtr(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* 4. EUROPEAN UNION (EU) */}
                            {activeJurisdiction === "European Union (EU)" && (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    VAT Identification Number <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. DE123456789"
                                    value={euVatNumber}
                                    onChange={(e) => setEuVatNumber(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    EORI Number (Economic Operators Reg &amp; ID) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. DE123456789012"
                                    value={euEoriNumber}
                                    onChange={(e) => setEuEoriNumber(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Commercial Register Extract Reference
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. HRB 12345 Amtsgericht Frankfurt"
                                    value={euCommercialRegister}
                                    onChange={(e) => setEuCommercialRegister(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* 5. CHINA */}
                            {activeJurisdiction === "China" && (
                              <>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Unified Social Credit Code (USCC) <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    maxLength={18}
                                    placeholder="e.g. 91330100MA2Bxxxxxx"
                                    value={chinaUscc}
                                    onChange={(e) => setChinaUscc(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Business License Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 330100000xxxxxx"
                                    value={chinaBusinessLicense}
                                    onChange={(e) => setChinaBusinessLicense(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Customs Registration Code (CR Code)
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={10}
                                    placeholder="e.g. 10-digit Customs Code"
                                    value={chinaCustomsCode}
                                    onChange={(e) => setChinaCustomsCode(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                  />
                                </div>
                              </>
                            )}

                            {/* 6. OTHER GLOBAL REGIONS */}
                            {activeJurisdiction === "Other Global Regions" && (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Local Tax ID / National Tax Number <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Official Tax / VAT Registration"
                                    value={localTaxId}
                                    onChange={(e) => setLocalTaxId(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Business Registration / Incorporation Certificate
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Commercial Registry / Legal Entity No"
                                    value={otherBusinessReg}
                                    onChange={(e) => setOtherBusinessReg(e.target.value.toUpperCase())}
                                    className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>
                              </>
                            )}

                            {/* Upload Certificate of Incorporation / Business License */}
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                Upload Certificate of Incorporation / Business License Document
                              </label>
                              <div className="rounded-lg border-2 border-dashed border-border/80 bg-background/50 p-5 text-center transition-colors hover:border-primary/50">
                                {uploadedKycDoc ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileCheck2 className="size-5 text-emerald-500" />
                                      <span className="text-xs font-semibold text-foreground">{uploadedKycDoc}</span>
                                      <Badge variant="outline" className="text-[10px] text-emerald-600">Attached</Badge>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setUploadedKycDoc(null)}
                                      className="text-rose-500 hover:text-rose-600 cursor-pointer"
                                    >
                                      <X className="size-4 mr-1" /> Remove
                                    </Button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer flex flex-col items-center justify-center">
                                    <UploadCloud className="size-8 text-muted-foreground mb-2" />
                                    <span className="text-sm font-medium text-foreground">
                                      Click to attach Certificate or Business License PDF / JPG
                                    </span>
                                    <span className="mt-1 text-xs text-muted-foreground">
                                      Official jurisdiction proof for verified partner badge • Max 5 MB
                                    </span>
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          setUploadedKycDoc(e.target.files[0].name);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}

                  <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                        <CardHeader className="border-b border-border/40 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <CreditCard className="size-4" />
                            </span>
                            <div>
                              <CardTitle className="text-lg">Banking &amp; International Payout Setup</CardTitle>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                          {/* Account Holder Name */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Bank Account Holder Name (Must match legal entity name) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Legal Entity Name or Official Account Holder"
                              value={accountHolder}
                              onChange={(e) => setAccountHolder(capitalizeWords(e.target.value))}
                              className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* Bank Name */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Bank Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. JPMorgan Chase / HDFC Bank / HSBC"
                              value={bankName}
                              onChange={(e) => setBankName(capitalizeWords(e.target.value))}
                              className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* Account Number / IBAN */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Account Number / IBAN <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Account Number or International IBAN"
                              value={accountOrIban}
                              onChange={(e) => setAccountOrIban(e.target.value.toUpperCase())}
                              className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* SWIFT / BIC */}
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Routing Number / SWIFT / BIC Code <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="8 or 11 Character SWIFT/BIC or Routing Code"
                              value={swiftCode}
                              onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
                              className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>

                          {/* Accepted Settlement Currencies */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Currency Support for Settlements <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {currencyOptions.map((cur) => {
                                const isSelected = settlementCurrencies.includes(cur.code);
                                return (
                                  <button
                                    key={cur.code}
                                    type="button"
                                    onClick={() => toggleCurrency(cur.code)}
                                    className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                      isSelected
                                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                        : "border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                  >
                                    {cur.flag ? (
                                      <img
                                        src={cur.flag}
                                        alt=""
                                        className="h-3.5 w-5 rounded-[2px] object-cover border border-black/10 shrink-0"
                                      />
                                    ) : null}
                                    <span>{cur.code}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Tax Residency & Withholding Tax Documents */}
                          <div className="sm:col-span-2 space-y-3 rounded-lg border border-border/70 bg-background/50 p-4">
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                                Tax Residency &amp; Withholding Tax Documents
                              </h3>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Required for cross-border settlements, international remittances, and tax treaty benefits (e.g. W-8BEN / W-9 for US, local tax forms).
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                  Withholding Tax Form Type <span className="text-rose-500">*</span>
                                </label>
                                <select
                                  value={withholdingTaxType}
                                  onChange={(e) => setWithholdingTaxType(e.target.value)}
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                >
                                  {withholdingTaxDocOptions.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                                  Attach Tax Residency / Withholding Document
                                </label>
                                {taxResidencyDocName ? (
                                  <div className="flex items-center justify-between h-[38px] px-3 rounded-md border border-border bg-background">
                                    <div className="flex items-center gap-1.5 truncate">
                                      <FileCheck2 className="size-4 text-emerald-500 shrink-0" />
                                      <span className="text-xs font-semibold text-foreground truncate">{taxResidencyDocName}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setTaxResidencyDocName(null)}
                                      className="text-rose-500 hover:text-rose-600 h-6 px-1.5 text-xs cursor-pointer"
                                    >
                                      <X className="size-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-between w-full h-[38px] px-3 rounded-md border border-dashed border-input bg-background hover:bg-muted/50 cursor-pointer text-xs transition-colors">
                                    <span className="truncate text-muted-foreground">
                                      Attach W-8BEN, W-9 or Local Tax Form (PDF / JPG)
                                    </span>
                                    <UploadCloud className="size-4 text-primary shrink-0 ml-1.5" />
                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          setTaxResidencyDocName(e.target.files[0].name);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Legal Platform Protection Card */}
                      <Card className="border-amber-300/80 bg-amber-50/50 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                            <ShieldAlert className="size-5 shrink-0 text-amber-700 dark:text-amber-400" />
                            <CardTitle className="text-base font-semibold">
                              Platform Protection &amp; Anti-Fraud Compliance Agreement
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-1 text-sm">
                          <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-amber-300/70 bg-white/80 p-4 dark:border-amber-900/40 dark:bg-black/20">
                            <input
                              type="checkbox"
                              required
                              checked={agreedTerms}
                              onChange={(e) => setAgreedTerms(e.target.checked)}
                              className="mt-0.5 size-4 rounded border-amber-400 text-primary focus:ring-primary"
                            />
                            <span className="text-xs sm:text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-100">
                              <strong>Partner Compliance Undertaking:</strong> I agree that all transaction quotes, escrow milestones, and communication with buyers sourced through Chinaindiasourcing will remain documented on-platform to ensure legal protection.
                            </span>
                          </label>

                          <label className="flex items-start gap-3 cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={agreedLeadSharing}
                              onChange={(e) => setAgreedLeadSharing(e.target.checked)}
                              className="mt-0.5 size-4 rounded border-input text-primary focus:ring-primary"
                            />
                            <span className="text-xs leading-relaxed text-muted-foreground">
                              I certify that all factory certifications, business registrations, and export authorizations provided above are authentic and valid under applicable jurisdictions.
                            </span>
                          </label>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Step Navigation Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1 || isSavingDraft}
                      className="gap-2 text-xs sm:text-sm"
                    >
                      <ArrowLeft className="size-4" /> Previous Step
                    </Button>

                    {currentStep < formSteps.length ? (
                      <Button
                        type="button"
                        size="default"
                        onClick={handleNextStep}
                        disabled={
                          isSavingDraft ||
                          Boolean(emailRegistrationWarning || whatsappRegistrationWarning) ||
                          (currentStep === 1 && (!emailVerified || (requiresWhatsappVerification && !whatsappVerified)))
                        }
                        className="gap-2 text-xs sm:text-sm font-semibold shadow-xs"
                      >
                        {isSavingDraft ? <Loader2 className="size-4 animate-spin" /> : null}
                        <span>{isSavingDraft ? "Saving..." : `Continue to ${formSteps[currentStep].title}`}</span>
                        {!isSavingDraft ? <ArrowRight className="size-4" /> : null}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        disabled={
                          isSubmitting ||
                          isSavingDraft ||
                          !emailVerified ||
                          (requiresWhatsappVerification && !whatsappVerified) ||
                          Boolean(emailRegistrationWarning || whatsappRegistrationWarning)
                        }
                        className="px-8 py-5 text-sm sm:text-base font-semibold shadow-md gap-2"
                      >
                        <CheckCircle2 className="size-5" /> {isSubmitting ? "Saving..." : "Continue"}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Matching Site Footer */}
      <SiteFooter />
    </main>
  );
}
