"use client";

import { useEffect, useState, useId, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  FileText,
  Globe,
  Image as ImageIcon,
  Info,
  Layers,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { sourceCountries } from "@/lib/services";

const sourceCountryOptions = [
  ...sourceCountries.map((country) => ({
    id: country.slug,
    label: country.name,
    flagImg: `https://flagcdn.com/w40/${country.flagCode}.png`,
  })),
  { id: "other", label: "Other", flagImg: null },
];

const orderPlaceTimes = [
  "Immediate",
  "In week time",
  "In month",
  "In 3 month",
  "More than 3 month",
  "Custom Timeline",
];

const orderVolumes = [
  "Under $ 1500",
  "$ 1500 to $ 3000",
  "$ 3000 to $ 5000",
  "$ 5000 to $ 7500",
  "$ 7500 to $ 12500",
  "$ 12500 to $ 20000",
  "$ 20000 to $ 30000",
  "$ 30000 to $ 50000",
  "Above $ 50000",
  "Custom Volume / Budget",
];

const hourlyBudgets = [
  "$ 5 to $ 15 / hour",
  "$ 15 to $ 30 / hour",
  "$ 30 to $ 50 / hour",
  "$ 50 to $ 100 / hour",
  "$ 100 to $ 200 / hour",
  "Custom Hourly Rate",
];

const fixedBudgets = [
  "$ 30 to $ 100",
  "$ 100 to $ 300",
  "$ 300 to $ 1000",
  "$ 1000 to $ 3000",
  "$ 3000 to $ 5000",
  "$ 5000 to $ 10000",
  "Custom Fixed Budget",
];

const quantityUnits = [
  "Piece",
  "Meter",
  "KG",
  "Ton",
  "Sets",
  "Carton",
  "Pairs",
  "Units",
  "Other (Custom Unit)",
];

const countryCodes = [
  { code: "+1", country: "USA", flag: "/flags/united-states.svg" },
  { code: "+91", country: "India", flag: "/flags/india.svg" },
  { code: "+86", country: "China", flag: "/flags/china.svg" },
  { code: "+84", country: "Vietnam", flag: "/flags/vietnam.svg" },
  { code: "+886", country: "Taiwan", flag: "/flags/taiwan.svg" },
  { code: "+44", country: "UK", flag: "/flags/uk.svg" },
  { code: "+971", country: "UAE", flag: "/flags/uae.svg" },
  { code: "+61", country: "Australia", flag: "/flags/australia.svg" },
  { code: "+49", country: "Germany", flag: "/flags/germany.svg" },
  { code: "+1-CA", country: "Canada", flag: "/flags/canada.svg" },
  { code: "custom", country: "Other (+...)", flag: null },
];

const destinationCountries = [
  { name: "United States", flag: "/flags/united-states.svg" },
  { name: "India", flag: "/flags/india.svg" },
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

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
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
        className="flex w-full items-center justify-between gap-2.5 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors hover:bg-accent/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="flex items-center gap-2.5 truncate">
          {selected.flag ? (
            <img
              src={selected.flag}
              alt=""
              width={22}
              height={15}
              className="h-3.5 w-5.5 rounded-[2px] object-cover shadow-xs border border-black/15 dark:border-white/20 shrink-0"
            />
          ) : (
            <Globe className="size-4 text-cyan-500 shrink-0" />
          )}
          <span className="truncate font-medium">{selected.name}</span>
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 max-h-64 min-w-[220px] w-full overflow-y-auto rounded-lg border border-border/80 bg-white dark:bg-[#18181b] p-1.5 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
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
                className={`flex w-full items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${isChosen
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground hover:bg-muted/80"
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {c.flag ? (
                    <img
                      src={c.flag}
                      alt=""
                      width={22}
                      height={15}
                      className="h-3.5 w-5.5 rounded-[2px] object-cover shadow-xs border border-black/15 dark:border-white/20 shrink-0"
                    />
                  ) : (
                    <Globe className="size-4 text-cyan-500 shrink-0" />
                  )}
                  <span className="truncate">{c.name}</span>
                </div>
                {isChosen && <Check className="size-4 text-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const countryStates: Record<string, string[]> = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi (NCT)",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "United States": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "Washington D.C.",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ],
  China: [
    "Anhui",
    "Beijing",
    "Chongqing",
    "Fujian",
    "Gansu",
    "Guangdong",
    "Guangxi",
    "Guizhou",
    "Hainan",
    "Hebei",
    "Heilongjiang",
    "Henan",
    "Hong Kong",
    "Hubei",
    "Hunan",
    "Inner Mongolia",
    "Jiangsu",
    "Jiangxi",
    "Jilin",
    "Liaoning",
    "Macau",
    "Ningxia",
    "Qinghai",
    "Shaanxi",
    "Shandong",
    "Shanghai",
    "Shanxi",
    "Sichuan",
    "Tianjin",
    "Tibet",
    "Xinjiang",
    "Yunnan",
    "Zhejiang",
  ],
  "United Kingdom": [
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "Greater London",
    "Greater Manchester",
    "West Midlands",
    "West Yorkshire",
    "South Yorkshire",
    "Merseyside",
    "Tyne and Wear",
  ],
  Canada: [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Nova Scotia",
    "Northwest Territories",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ],
  Australia: [
    "Australian Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
  ],
  "United Arab Emirates": [
    "Abu Dhabi",
    "Ajman",
    "Dubai",
    "Fujairah",
    "Ras Al Khaimah",
    "Sharjah",
    "Umm Al Quwain",
  ],
  Vietnam: [
    "Bac Ninh",
    "Binh Duong",
    "Can Tho",
    "Da Nang",
    "Dong Nai",
    "Hai Duong",
    "Hai Phong",
    "Hanoi",
    "Ho Chi Minh City",
    "Long An",
    "Quang Ninh",
    "Thua Thien Hue",
  ],
  Germany: [
    "Baden-Württemberg",
    "Bavaria (Bayern)",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hesse (Hessen)",
    "Lower Saxony (Niedersachsen)",
    "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia (NRW)",
    "Rhineland-Palatinate",
    "Saarland",
    "Saxony (Sachsen)",
    "Saxony-Anhalt",
    "Schleswig-Holstein",
    "Thuringia",
  ],
  Taiwan: [
    "Changhua County",
    "Chiayi City",
    "Chiayi County",
    "Hsinchu City",
    "Hsinchu County",
    "Hualien County",
    "Kaohsiung City",
    "Keelung City",
    "Kinmen County",
    "Miaoli County",
    "Nantou County",
    "New Taipei City",
    "Penghu County",
    "Pingtung County",
    "Taichung City",
    "Tainan City",
    "Taipei City",
    "Taitung County",
    "Taoyuan City",
    "Yilan County",
    "Yunlin County",
  ],
  "New Zealand": [
    "Auckland",
    "Bay of Plenty",
    "Canterbury",
    "Gisborne",
    "Hawke's Bay",
    "Manawatu-Wanganui",
    "Marlborough",
    "Nelson",
    "Northland",
    "Otago",
    "Southland",
    "Taranaki",
    "Tasman",
    "Waikato",
    "Wellington",
    "West Coast",
  ],
  Pakistan: [
    "Azad Kashmir",
    "Balochistan",
    "Gilgit-Baltistan",
    "Islamabad Capital Territory",
    "Khyber Pakhtunkhwa",
    "Punjab",
    "Sindh",
  ],
  Bangladesh: [
    "Barisal",
    "Chittagong",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
  ],
  "South Africa": [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape",
  ],
  Nigeria: [
    "Abia",
    "Abuja (FCT)",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Benue",
    "Delta",
    "Edo",
    "Enugu",
    "Imo",
    "Kaduna",
    "Kano",
    "Katsina",
    "Lagos",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
  ],
};

function capitalizeFirst(val: string): string {
  if (!val) return "";
  const match = val.search(/[a-zA-Z]/);
  if (match === -1) return val;
  return (
    val.slice(0, match) +
    val.charAt(match).toUpperCase() +
    val.slice(match + 1)
  );
}

function capitalizeWords(val: string): string {
  if (!val) return "";
  return val.replace(/(^|\s|-)([a-z])/g, (_, boundary, char) => boundary + char.toUpperCase());
}

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

  const filtered = stateList.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase().trim())
  );

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
        className="flex w-full items-center justify-between gap-2.5 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors hover:bg-accent/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className={`truncate ${!value ? "text-muted-foreground" : "font-medium text-foreground"}`}>
          {value || `Select ${country} State...`}
        </span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[240px] rounded-lg border border-border/80 bg-white dark:bg-[#18181b] p-1.5 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
          <div className="relative mb-1.5 px-1 pt-1">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search or type state..."
              value={search}
              autoFocus
              onChange={(e) => setSearch(capitalizeWords(e.target.value))}
              className="w-full rounded-md border border-input bg-background pl-8 pr-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-0.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/25">
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
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors ${
                    isChosen
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted/80"
                  }`}
                >
                  <span className="truncate">{s}</span>
                  {isChosen && <Check className="size-3.5 text-primary shrink-0 ml-1.5" />}
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
                className="w-full rounded-md bg-primary/10 px-2.5 py-2 text-left text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
              >
                Use custom: &quot;{capitalizeWords(search.trim())}&quot;
              </button>
            )}

            {filtered.length === 0 && !search.trim() && (
              <div className="p-2 text-center text-xs text-muted-foreground">
                No states found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyersPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationToken, setEmailVerificationToken] = useState("");
  const [emailRegistrationWarning, setEmailRegistrationWarning] = useState("");
  const [marketApplicationId, setMarketApplicationId] = useState("");

  const [countryCode, setCountryCode] = useState("+1");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [whatsappVerificationToken, setWhatsappVerificationToken] = useState("");
  const [whatsappRegistrationWarning, setWhatsappRegistrationWarning] = useState("");
  const [showVerificationErrors, setShowVerificationErrors] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");

  // Address
  const [streetAddress, setStreetAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("United States");
  const [pincode, setPincode] = useState("");

  // Sourcing Specs
  const [orderPlaceTime, setOrderPlaceTime] = useState(orderPlaceTimes[0]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [orderVolume, setOrderVolume] = useState(orderVolumes[2]);

  // Requirement Details
  const [lookingFor, setLookingFor] = useState("");
  const [detailedRequirement, setDetailedRequirement] = useState("");

  // Budget
  const [budgetType, setBudgetType] = useState<"hourly" | "fixed">("hourly");
  const [hourlyBudget, setHourlyBudget] = useState(hourlyBudgets[1]);
  const [fixedBudget, setFixedBudget] = useState(fixedBudgets[2]);

  // Quantity
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState(quantityUnits[0]);

  // Custom Options State
  const [customCountry, setCustomCountry] = useState("");
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [customSourceOther, setCustomSourceOther] = useState("");
  const [customOrderPlaceTime, setCustomOrderPlaceTime] = useState("");
  const [customOrderVolume, setCustomOrderVolume] = useState("");
  const [customQuantityUnit, setCustomQuantityUnit] = useState("");
  const [customHourlyBudget, setCustomHourlyBudget] = useState("");
  const [customFixedBudget, setCustomFixedBudget] = useState("");

  const requiresWhatsappVerification =
    countryCode === "+91" ||
    (countryCode === "custom" && customCountryCode.replace(/\D/g, "") === "91");

  // Image Upload
  const [sampleImage, setSampleImage] = useState<{
    name: string;
    originalSize: string;
    compressedSize: string;
    previewUrl: string;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Agrement Checkbox
  const [agreedOffPlatform, setAgreedOffPlatform] = useState(false);
  const [agreedLeadSharing, setAgreedLeadSharing] = useState(false);
  const [agreedPartnerAccess, setAgreedPartnerAccess] = useState(false);

  // Submission Status
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<MarketPaymentDetails | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const draftCredentials = useRef<MarketDraftCredentials | null>(null);
  const draftQueue = useRef<Promise<void>>(Promise.resolve());

  const lookingForId = useId();
  const detailedReqId = useId();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("market-buyers-draft") || "null") as MarketDraftCredentials | null;
      draftCredentials.current = saved;
      if (saved?.draftId && saved?.draftToken) {
        void getMarketDraft("buyers", saved).then((result) => {
          const data = result.data?.formData;
          if (!data) return;
          const text = (key: string) => typeof data[key] === "string" ? data[key] as string : "";
          setFullName(text("fullName")); setEmail(text("email")); setCountryCode(text("countryCode") || "+91");
          setWhatsapp(text("whatsapp")); setCompanyName(text("companyName")); setWebsite(text("website"));
          setStreetAddress(text("streetAddress")); setLandmark(text("landmark")); setCity(text("city"));
          setState(text("state")); setCountry(text("country") || "United States"); setPincode(text("pincode"));
          setOrderPlaceTime(text("orderPlaceTime") || orderPlaceTimes[0]);
          setSelectedSources(Array.isArray(data.selectedSources) ? data.selectedSources as string[] : []);
          setOrderVolume(text("orderVolume") || orderVolumes[2]); setLookingFor(text("lookingFor"));
          setDetailedRequirement(text("detailedRequirement"));
          setBudgetType(data.budgetType === "fixed" ? "fixed" : "hourly");
          setHourlyBudget(text("hourlyBudget") || hourlyBudgets[1]); setFixedBudget(text("fixedBudget") || fixedBudgets[2]);
          setQuantity(text("quantity")); setQuantityUnit(text("quantityUnit") || quantityUnits[0]);
          setCustomCountry(text("customCountry")); setCustomCountryCode(text("customCountryCode"));
          setCustomSourceOther(text("customSourceOther")); setCustomOrderPlaceTime(text("customOrderPlaceTime"));
          setCustomOrderVolume(text("customOrderVolume")); setCustomQuantityUnit(text("customQuantityUnit"));
          setCustomHourlyBudget(text("customHourlyBudget")); setCustomFixedBudget(text("customFixedBudget"));
          setAgreedOffPlatform(Boolean(data.agreedOffPlatform)); setAgreedLeadSharing(Boolean(data.agreedLeadSharing));
          setAgreedPartnerAccess(Boolean(data.agreedPartnerAccess));
          setDraftMessage("Saved draft restored. Please verify your email and WhatsApp again before payment.");
        }).catch(() => {
          sessionStorage.removeItem("market-buyers-draft");
          draftCredentials.current = null;
        });
      } else {
        const enquiry = JSON.parse(sessionStorage.getItem("market-seller-enquiry-prefill") || "null") as Record<string, unknown> | null;
        if (enquiry) {
          const text = (key: string) => typeof enquiry[key] === "string" ? enquiry[key] as string : "";
          window.setTimeout(() => {
            setFullName(text("fullName"));
            setEmail(text("email"));
            setLookingFor(text("lookingFor"));
            setDetailedRequirement(text("detailedRequirement"));
            setDraftMessage(text("provider") ? `Enquiry started for ${text("provider")}. Complete the details below.` : "Enquiry details added. Complete the form below.");
          }, 0);
          sessionStorage.removeItem("market-seller-enquiry-prefill");
        }
      }
    } catch {
      sessionStorage.removeItem("market-buyers-draft");
    }
  }, []);

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const newStates = countryStates[newCountry] || [];
    if (state && !newStates.some((s) => s.toLowerCase() === state.toLowerCase())) {
      setState("");
    }
  };

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((s) => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      const fakeOriginalKb = Math.round(file.size / 1024) || 280;
      setTimeout(() => {
        setIsCompressing(false);
        setSampleImage({
          name: file.name,
          originalSize: `${fakeOriginalKb} KB`,
          compressedSize: "118 KB",
          previewUrl: URL.createObjectURL(file),
        });
      }, 1000);
    }
  };

  const buildPayload = (): Record<string, unknown> => ({
    fullName, email, emailVerified, emailVerificationToken, marketApplicationId, countryCode, whatsapp,
    whatsappVerified, whatsappVerificationToken, companyName, website, streetAddress,
    landmark, city, state, country, pincode, orderPlaceTime, selectedSources, orderVolume,
    lookingFor, detailedRequirement, budgetType, hourlyBudget, fixedBudget, quantity,
    quantityUnit, customCountry, customCountryCode, customSourceOther, customOrderPlaceTime,
    customOrderVolume, customQuantityUnit, customHourlyBudget, customFixedBudget,
    sampleImage: sampleImage
      ? { name: sampleImage.name, originalSize: sampleImage.originalSize, compressedSize: sampleImage.compressedSize }
      : undefined,
    agreedOffPlatform, agreedLeadSharing, agreedPartnerAccess,
  });

  const saveDraft = () => {
    const payload = buildPayload();
    // Do not call the API just because select fields have default values.
    // Wait until the buyer has actually entered identifying/form information.
    const hasUserEnteredData = [
      fullName,
      email,
      whatsapp,
      companyName,
      website,
      streetAddress,
      landmark,
      city,
      state,
      pincode,
      lookingFor,
      detailedRequirement,
      quantity,
    ].some((value) => value.trim());
    if (!hasUserEnteredData) {
      setDraftMessage("");
      return draftQueue.current;
    }
    draftQueue.current = draftQueue.current
      .catch(() => undefined)
      .then(async () => {
        try {
          const result = await saveMarketDraft("buyers", payload, 1, draftCredentials.current);
          if (result.data) {
            draftCredentials.current = { draftId: result.data.draftId, draftToken: result.data.draftToken };
            sessionStorage.setItem("market-buyers-draft", JSON.stringify(draftCredentials.current));
            setDraftMessage("");
          }
        } catch (error) {
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
            setDraftMessage(
              error instanceof TypeError && /fetch/i.test(error.message)
                ? "Unable to connect to the server. Your form is still available on this page; please try again shortly."
                : error instanceof Error
                  ? error.message
                  : "Unable to save draft.",
            );
          }
        }
      });
    return draftQueue.current;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRegistrationWarning || whatsappRegistrationWarning) return;
    if (!agreedOffPlatform) {
      alert("Please acknowledge the Platform Payment & Fraud Disclaimer checkbox before submitting.");
      return;
    }
    if (
      !emailVerified ||
      !emailVerificationToken ||
      (requiresWhatsappVerification && (!whatsappVerified || !whatsappVerificationToken))
    ) {
      setShowVerificationErrors(true);
      window.setTimeout(() => {
        document.getElementById(
          !emailVerified || !emailVerificationToken
            ? "buyer-email-field"
            : "buyer-whatsapp-field",
        )?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      alert(requiresWhatsappVerification
        ? "Please verify your email address and WhatsApp number before submitting."
        : "Please verify your email address before submitting.");
      return;
    }
    setShowVerificationErrors(false);
    setIsSubmitting(true);
    try {
      await saveDraft();
      const result = await submitMarketForm("buyers", {
        ...buildPayload(),
        ...draftCredentials.current,
      });
      if (!result.data) throw new Error("Payment details were not returned.");
      sessionStorage.setItem(
        "market_payment_data",
        JSON.stringify({ form: "buyers", payment: result.data }),
      );
      router.push(
        `/payments?form=buyers&id=${result.data.applicationId}&token=${encodeURIComponent(result.data.accessToken)}`,
      );
    } catch (error) {
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
      } else {
        alert(error instanceof Error ? error.message : "Unable to submit the form. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Matching Sticky Top Navbar */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 ${isScrolled
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

      {/* Main Content: Form on Left, Top Header on Right */}
      <section className="relative -mt-16 overflow-hidden scroll-mt-24 hero-ambient-flow pt-24 pb-14 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="animate-float-slow absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-reverse absolute -right-20 top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-drift absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-600/15 sm:h-80 sm:w-80" />
          <div className="animate-float-slow absolute right-1/4 bottom-16 h-64 w-64 rounded-full bg-rose-200/25 blur-3xl dark:bg-rose-600/10 sm:h-72 sm:w-72" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header Centered at Top */}
          <div className="mb-8 text-center space-y-3">
       

            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Find a Sourcing Partner for Your U.S. Business
            </h1>

          </div>

          {/* FULL WIDTH FORM */}
          <div>
            {submitted ? (
              <Card className="border-emerald-200 bg-emerald-50/50 p-8 text-center shadow-lg dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-foreground">Requirement Submitted Successfully!</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your RFQ ID: <strong className="text-foreground">RFQ-2026-8842</strong>. Verified sourcing agents matching your exact category will reach out within 24 business hours.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Your Basic B2B premium plan is active for one month. Use the dashboard credentials sent to your email.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Button onClick={() => setSubmitted(false)}>Submit Another Requirement</Button>
                    <Button variant="outline" asChild>
                      <Link href="/">Back to Homepage</Link>
                    </Button>
                  </div>
                </Card>
              ) : paymentDetails ? (
                <MarketVerificationPayment
                  form="buyers"
                  payment={paymentDetails}
                  onPaid={() => {
                    sessionStorage.removeItem("market-buyers-draft");
                    setPaymentDetails(null);
                    setSubmitted(true);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                />
              ) : (
                <form onSubmit={handleSubmit} onBlurCapture={() => void saveDraft()} className="flex flex-col gap-6">
                  {draftMessage && (
                    <p className={`text-center text-xs ${/already|unable|no longer/i.test(draftMessage) ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                      {draftMessage}
                    </p>
                  )}
                  {/* Card 1: Contact & Company Profile */}
                  <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="size-4" />
                        </span>
                        <div>
                          <CardTitle className="text-lg">Contact &amp; Business Information</CardTitle>
                        
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                      {/* Full Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe / Rajesh Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(capitalizeWords(e.target.value))}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Email with Verification */}
                      <div id="buyer-email-field">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Email ID <span className="text-rose-500">*</span>
                          </label>
                          <span className={`text-[11px] font-medium ${emailVerified
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                            }`}>
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
                              className={`w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:outline-none focus:ring-2 ${showVerificationErrors && (!emailVerified || !emailVerificationToken)
                                  ? "border-rose-500 placeholder:text-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                                  : "border-input placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                                }`}
                            />
                          </div>
                          <OtpVerificationButton
                            channel="email"
                            marketForm="buyers"
                            marketApplicationId={marketApplicationId}
                            onMarketApplicationCreated={setMarketApplicationId}
                            target={email.trim().toLowerCase()}
                            verified={emailVerified}
                            onVerified={(token) => {
                              setEmailVerificationToken(token);
                              setEmailVerified(true);
                            }}
                            onAvailabilityChange={(available, message) => {
                              setEmailRegistrationWarning(available ? "" : message || "This email address is already registered.");
                            }}
                            label="Verify Email"
                            verifiedVariant="secondary"
                            className="shrink-0"
                          />
                        </div>
                        {emailRegistrationWarning && (
                          <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                            {emailRegistrationWarning}
                          </p>
                        )}
                        {showVerificationErrors && (!emailVerified || !emailVerificationToken) && !emailRegistrationWarning && (
                          <p role="alert" className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            Please verify this email address.
                          </p>
                        )}
                      </div>

                      {/* WhatsApp with Country Code + Verification */}
                      <div id="buyer-whatsapp-field">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            WhatsApp Number <span className="text-rose-500">*</span>
                          </label>
                          <span className={`text-[11px] font-medium ${whatsappVerified
                              ? "text-emerald-600 dark:text-emerald-400"
                              : requiresWhatsappVerification
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground"
                            }`}>
                            {whatsappVerified
                              ? "Verified ✓"
                              : requiresWhatsappVerification
                                ? "WhatsApp verification required for India"
                                : "Email verification only for this country"}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <div className="flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 shadow-xs shrink-0">
                            {(() => {
                              const foundFlag = countryCodes.find((c) => c.code === countryCode)?.flag;
                              return foundFlag ? (
                                <img
                                  src={foundFlag}
                                  alt=""
                                  className="h-3.5 w-5 rounded-[2px] object-cover border border-black/10 shrink-0"
                                />
                              ) : (
                                <Globe className="size-3.5 text-cyan-500 shrink-0" />
                              );
                            })()}
                            <select
                              aria-label="WhatsApp Country Code"
                              value={countryCode}
                              onChange={(e) => {
                                setCountryCode(e.target.value);
                                setWhatsappVerified(false);
                                setWhatsappVerificationToken("");
                                setWhatsappRegistrationWarning("");
                              }}
                              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                            >
                              {countryCodes.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.code === "custom" ? c.country : `${c.code} (${c.country})`}
                                </option>
                              ))}
                            </select>
                          </div>
                          {countryCode === "custom" && (
                            <input
                              type="text"
                              required
                              placeholder="+Code"
                              value={customCountryCode}
                              onChange={(e) => {
                                setCustomCountryCode(e.target.value.replace(/[^\d+]/g, "").slice(0, 5));
                                setWhatsappVerified(false);
                                setWhatsappVerificationToken("");
                                setWhatsappRegistrationWarning("");
                              }}
                              className="w-20 rounded-md border border-input bg-background px-2 py-1.5 text-xs font-semibold text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0"
                            />
                          )}
                          <div className="relative flex-1 min-w-[140px]">
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
                              className={`w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:outline-none focus:ring-2 ${showVerificationErrors && requiresWhatsappVerification && (!whatsappVerified || !whatsappVerificationToken)
                                  ? "border-rose-500 placeholder:text-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                                  : "border-input placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                                }`}
                            />
                          </div>
                          {requiresWhatsappVerification ? (
                            <OtpVerificationButton
                              channel="whatsapp"
                              marketForm="buyers"
                              marketApplicationId={marketApplicationId}
                              target={buildWhatsappNumber(countryCode, customCountryCode, whatsapp)}
                              verified={whatsappVerified}
                              onVerified={(token) => {
                                setWhatsappVerificationToken(token);
                                setWhatsappVerified(true);
                              }}
                              onAvailabilityChange={(available, message) => {
                                setWhatsappRegistrationWarning(available ? "" : message || "This WhatsApp number is already registered.");
                              }}
                              verifiedVariant="secondary"
                              className="shrink-0"
                            />
                          ) : null}
                        </div>
                        {whatsappRegistrationWarning && (
                          <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                            {whatsappRegistrationWarning}
                          </p>
                        )}
                        {showVerificationErrors && requiresWhatsappVerification && (!whatsappVerified || !whatsappVerificationToken) && !whatsappRegistrationWarning && (
                          <p role="alert" className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            Please verify this WhatsApp number.
                          </p>
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
                          placeholder="e.g. Apex Global Trade Ltd."
                          value={companyName}
                          onChange={(e) => setCompanyName(capitalizeWords(e.target.value))}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Website */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Website URL
                        </label>
                        <div className="relative">
                          <Globe className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                          <input
                            type="url"
                            placeholder="https://yourcompany.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: Detailed Sourcing Brief & Budget */}
                  <Card className="border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          <FileText className="size-4" />
                        </span>
                        <div>
                          <CardTitle className="text-lg">Detailed Sourcing Brief &amp; Budget</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* Looking for (Title with 70 characters max) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label htmlFor={lookingForId} className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Looking For (Role / Title) <span className="text-rose-500">*</span>
                          </label>
                          <span className={`text-xs ${lookingFor.length > 70 ? "text-rose-500 font-bold" : "text-foreground/75 font-medium"}`}>
                            {lookingFor.length} / 70 characters
                          </span>
                        </div>
                        <input
                          id={lookingForId}
                          type="text"
                          required
                          maxLength={70}
                          placeholder="e.g. Sourcing agent for EV battery cells / Buying agent for ceramic tiles"
                          value={lookingFor}
                          onChange={(e) => setLookingFor(capitalizeFirst(e.target.value))}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-foreground/85">Quick Suggestions:</span>
                          {[
                            "Sourcing Agent",
                            "Buying Agent",
                            "Quality Inspection Agent",
                            "Factory Audit Specialist",
                            "Freight & Forwarding",
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setLookingFor(preset)}
                              className={`rounded-full border px-2 py-0.5 text-[11px] transition-colors ${
                                lookingFor === preset
                                  ? "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Requirement (50 to 1000 characters) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label htmlFor={detailedReqId} className="text-xs font-semibold uppercase tracking-wider text-foreground">
                            Detailed Requirement <span className="text-rose-500">*</span>
                          </label>
                          <span
                            className={`text-xs ${detailedRequirement.length < 50 && detailedRequirement.length > 0
                                ? "text-amber-500 font-medium"
                                : detailedRequirement.length > 1000
                                  ? "text-rose-500 font-bold"
                                  : "text-foreground/75 font-medium"
                              }`}
                          >
                            {detailedRequirement.length} / 1000 characters (min 50)
                          </span>
                        </div>
                        <textarea
                          id={detailedReqId}
                          rows={5}
                          required
                          minLength={50}
                          maxLength={1000}
                          placeholder="Specify product dimensions, materials, expected packaging, factory certifications, sample turnaround time, target unit pricing, and quality benchmarks..."
                          value={detailedRequirement}
                          onChange={(e) => setDetailedRequirement(capitalizeFirst(e.target.value))}
                          className="w-full rounded-md border border-input bg-background p-3.5 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {detailedRequirement.length > 0 && detailedRequirement.length < 50 && (
                          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                            Please provide at least {50 - detailedRequirement.length} more characters to ensure accurate matches.
                          </p>
                        )}
                      </div>

                      {/* Budget to hire sourcing agent (Hourly vs Fixed toggle) */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                          Budget to Hire Sourcing Agent <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div
                            onClick={() => setBudgetType("hourly")}
                            className={`cursor-pointer rounded-lg border p-3.5 transition-all ${budgetType === "hourly"
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-input bg-background hover:bg-muted/40"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Hourly Rate</span>
                              <span className="text-xs text-foreground/75 font-medium">$ 5 / hr to $ 200 / hr</span>
                            </div>
                            {budgetType === "hourly" && (
                              <div className="mt-3 space-y-2">
                                <select
                                  aria-label="Hourly Budget Range"
                                  value={hourlyBudget}
                                  onChange={(e) => setHourlyBudget(e.target.value)}
                                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                                >
                                  {hourlyBudgets.map((h) => (
                                    <option key={h} value={h}>
                                      {h}
                                    </option>
                                  ))}
                                </select>
                                {hourlyBudget === "Custom Hourly Rate" && (
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. $ 250 / hr or Negotiable based on project"
                                    value={customHourlyBudget}
                                    onChange={(e) => setCustomHourlyBudget(capitalizeFirst(e.target.value))}
                                    className="w-full rounded-md border border-primary/40 bg-background px-2.5 py-1 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          <div
                            onClick={() => setBudgetType("fixed")}
                            className={`cursor-pointer rounded-lg border p-3.5 transition-all ${budgetType === "fixed"
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-input bg-background hover:bg-muted/40"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Fixed Project Fee</span>
                              <span className="text-xs text-foreground/75 font-medium">$ 30 to $ 10,000</span>
                            </div>
                            {budgetType === "fixed" && (
                              <div className="mt-3 space-y-2">
                                <select
                                  aria-label="Fixed Project Budget Range"
                                  value={fixedBudget}
                                  onChange={(e) => setFixedBudget(e.target.value)}
                                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                                >
                                  {fixedBudgets.map((f) => (
                                    <option key={f} value={f}>
                                      {f}
                                    </option>
                                  ))}
                                </select>
                                {fixedBudget === "Custom Fixed Budget" && (
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. $ 15,000 Milestone based / Escrow protected"
                                    value={customFixedBudget}
                                    onChange={(e) => setCustomFixedBudget(capitalizeFirst(e.target.value))}
                                    className="w-full rounded-md border border-primary/40 bg-background px-2.5 py-1 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product/Service Sample image (Upload option & auto compress under 150 kb) */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                          Product / Service Sample Image to Understand
                        </label>
                        <div className="rounded-lg border-2 border-dashed border-border/80 bg-background/50 p-6 text-center transition-colors hover:border-primary/50">
                          {isCompressing ? (
                            <div className="py-4 space-y-2">
                              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              <p className="text-xs font-medium text-foreground">
                                Compressing image under 150 KB...
                              </p>
                            </div>
                          ) : sampleImage ? (
                            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                              <img
                                src={sampleImage.previewUrl}
                                alt="Sample preview"
                                className="size-16 rounded-md object-cover border border-border"
                              />
                              <div className="text-left text-xs">
                                <p className="font-semibold text-foreground line-clamp-1">{sampleImage.name}</p>
                                <p className="text-muted-foreground">Original: {sampleImage.originalSize}</p>
                                <p className="font-medium text-emerald-600 dark:text-emerald-400">
                                  ✓ Auto compressed to {sampleImage.compressedSize} (Under 150 KB target)
                                </p>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setSampleImage(null)}
                                className="text-rose-500 hover:text-rose-600"
                              >
                                <X className="size-4" /> Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center">
                              <UploadCloud className="size-8 text-muted-foreground mb-2" />
                              <span className="text-sm font-medium text-foreground">
                                Click to upload or drag and drop sample image
                              </span>
                              <span className="mt-1 text-xs text-muted-foreground">
                                PNG, JPG, WEBP • Automatically compressed under 150 KB for faster agent review
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Sourcing Specifications */}
                  <Card className="relative z-10 border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Layers className="size-4" />
                        </span>
                        <div>
                          <CardTitle className="text-lg">Sourcing Specifications &amp; Timeline</CardTitle>

                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      {/* Source From (Multi-selection) */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Source From <span className="text-rose-500">*</span>{" "}
                          <span className="text-xs font-normal normal-case text-muted-foreground">
                            (Multi selection — select one or more origin markets)
                          </span>
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {sourceCountryOptions.map((opt) => {
                            const isSelected = selectedSources.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleSource(opt.id)}
                                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${isSelected
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                                    : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                                  }`}
                              >
                                {opt.flagImg ? (
                                  <img
                                    src={opt.flagImg}
                                    alt={`${opt.label} flag`}
                                    width={24}
                                    height={16}
                                    className="h-4 w-6 rounded-[2px] object-cover shadow-xs border border-black/15 dark:border-white/20 shrink-0"
                                  />
                                ) : (
                                  <Globe className="size-4 text-cyan-500 shrink-0" />
                                )}
                                <span>{opt.label}</span>
                                {isSelected && <Check className="size-4 shrink-0 ml-0.5" />}
                              </button>
                            );
                          })}
                        </div>
                        {selectedSources.includes("other") && (
                          <div className="mt-2.5 max-w-md">
                            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                              Specify custom origin market(s):
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. South Korea, Turkey, Indonesia, Malaysia, Japan..."
                              value={customSourceOther}
                              onChange={(e) => setCustomSourceOther(capitalizeWords(e.target.value))}
                              className="w-full rounded-md border border-primary/40 bg-background px-3 py-2 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Order Place Time */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Order Place Time <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={orderPlaceTime}
                            onChange={(e) => setOrderPlaceTime(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {orderPlaceTimes.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {orderPlaceTime === "Custom Timeline" && (
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                placeholder="e.g. By 15th Nov / Q4 2026 / In 45 days..."
                                value={customOrderPlaceTime}
                                onChange={(e) => setCustomOrderPlaceTime(capitalizeFirst(e.target.value))}
                                className="w-full rounded-md border border-primary/40 bg-background px-3 py-1.5 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          )}
                        </div>

                        {/* Order Volume */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                            Order Volume <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={orderVolume}
                            onChange={(e) => setOrderVolume(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {orderVolumes.map((vol) => (
                              <option key={vol} value={vol}>
                                {vol}
                              </option>
                            ))}
                          </select>
                          {orderVolume === "Custom Volume / Budget" && (
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                placeholder="e.g. $ 75,000 to $ 100,000 / $ 250,000 annual procurement..."
                                value={customOrderVolume}
                                onChange={(e) => setCustomOrderVolume(capitalizeFirst(e.target.value))}
                                className="w-full rounded-md border border-primary/40 bg-background px-3 py-1.5 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity: 2 sections (How much quantity + dropdown unit) */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Quantity Required <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-[1fr_160px] gap-2.5 sm:grid-cols-[1fr_200px]">
                          <div className="relative">
                            <Package className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <input
                              type="number"
                              required
                              min="1"
                              placeholder="e.g. 5000"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <select
                            aria-label="Quantity Unit"
                            value={quantityUnit}
                            onChange={(e) => setQuantityUnit(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {quantityUnits.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>
                        {quantityUnit === "Other (Custom Unit)" && (
                          <div className="mt-2 max-w-xs sm:ml-auto">
                            <input
                              type="text"
                              required
                              placeholder="Specify custom unit (e.g. Pallets, Rolls)..."
                              value={customQuantityUnit}
                              onChange={(e) => setCustomQuantityUnit(capitalizeWords(e.target.value))}
                              className="w-full rounded-md border border-primary/40 bg-background px-3 py-1.5 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 4: Address Details */}
                  <Card className="relative z-30 border-border/60 bg-card/90 shadow-sm backdrop-blur-sm">
                    <CardHeader className="border-b border-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                          <MapPin className="size-4" />
                        </span>
                        <div>
                          <CardTitle className="text-lg">Address &amp; Destination Details</CardTitle>

                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Street Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Street Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Unit 402, Trade Tower, Sector 62"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(capitalizeWords(e.target.value))}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Landmark */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Landmark
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near Metro Station / Port Gate"
                          value={landmark}
                          onChange={(e) => setLandmark(capitalizeWords(e.target.value))}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Country <span className="text-rose-500">*</span>
                        </label>
                        <CountrySelect value={country} onChange={handleCountryChange} />
                        {country === "Other Country" && (
                          <div className="mt-2">
                            <input
                              type="text"
                              required
                              placeholder="Enter your country name..."
                              value={customCountry}
                              onChange={(e) => setCustomCountry(capitalizeWords(e.target.value))}
                              className="w-full rounded-md border border-primary/40 bg-background px-3 py-1.5 text-xs text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        )}
                      </div>

                      {/* State / Province (Dynamic based on selected Country) */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          State / Province <span className="text-rose-500">*</span>
                        </label>
                        <StateSelect country={country} value={state} onChange={(val) => setState(val)} />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mumbai / Delhi / Los Angeles"
                          value={city}
                          onChange={(e) => setCity(capitalizeWords(e.target.value))}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Pin code */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Pin Code / Postal Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 110001 / 90001"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 5: Legal & Platform Safety Disclaimer */}
                  <Card className="border-amber-300/80 bg-amber-50/50 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                        <ShieldAlert className="size-5 shrink-0 text-amber-700 dark:text-amber-400" />
                        <CardTitle className="text-base font-semibold">
                          Platform Protection &amp; Off-Platform Payment Disclaimer
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1 text-sm">
                      {/* The exact requested off-platform clause */}
                      <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-amber-300/70 bg-white/80 p-4 dark:border-amber-900/40 dark:bg-black/20">
                        <input
                          type="checkbox"
                          required
                          checked={agreedOffPlatform}
                          onChange={(e) => setAgreedOffPlatform(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-amber-400 text-primary focus:ring-primary"
                        />
                        <span className="text-xs sm:text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-100">
                          <strong>You acknowledge that</strong> ChinaIndiaSourcing is a connection platform, not the sourcing agent or seller. If you contract or pay a provider outside the platform, the platform cannot protect or assume responsibility for that transaction.
                        </span>
                      </label>

                      {/* Accompanying Consent Boxes */}
                      <label className="flex items-start gap-3 cursor-pointer p-1">
                        <input
                          type="checkbox"
                          checked={agreedLeadSharing}
                          onChange={(e) => setAgreedLeadSharing(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-xs leading-relaxed text-muted-foreground">
                          I agree that my inquiries and business details may be shared with verified Agents for sourcing and lead-generation purposes.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer p-1">
                        <input
                          type="checkbox"
                          checked={agreedPartnerAccess}
                          onChange={(e) => setAgreedPartnerAccess(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-xs leading-relaxed text-muted-foreground">
                          I understand that Chinaindiasourcing is operated by Life Changing Networks Pvt. Ltd., an authorized partner of SellersLogin.com, and I consent to SellersLogin accessing my Platform data for service operations.
                        </span>
                      </label>
                    </CardContent>
                  </Card>

                  {/* Submit CTA */}
                  <div className="pt-2 text-center">
                    <Button
                      size="lg"
                      type="submit"
                      disabled={
                        isSubmitting
                      }
                      className="w-full sm:w-auto px-10 py-6 text-base font-semibold shadow-md"
                    >
                      <Search className="size-5 mr-1" /> {isSubmitting ? "Saving..." : "Continue"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

      <SiteFooter />
    </main>
  );
}
