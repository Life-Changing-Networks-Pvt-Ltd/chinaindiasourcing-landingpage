import { locationSlug } from "@/data";

const sourceLocationNames = {
  india: [
    "Mumbai",
    "Delhi",
    "Noida",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Surat",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Mysuru",
    "Aurangabad",
    "Jamshedpur",
    "Amritsar",
    "Navi Mumbai",
    "Prayagraj",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Chandigarh",
    "Guwahati",
    "Gurugram",
    "Noida",
    "Kochi",
    "Thiruvananthapuram",
    "Bhubaneswar",
    "Maharashtra",
    "Gujarat",
    "Tamil Nadu",
    "Karnataka",
    "Uttar Pradesh",
    "Telangana",
    "Delhi",
    "Haryana",
    "West Bengal",
    "Rajasthan",
    "Andhra Pradesh",
    "Madhya Pradesh",
    "Punjab",
    "Kerala",
    "Odisha",
  ],
  china: [
    "Shanghai",
    "Beijing",
    "Guangzhou",
    "Yiwu",
    "Shenzhen",
    "Chengdu",
    "Hangzhou",
    "Chongqing",
    "Wuhan",
    "Nanjing",
    "Tianjin",
    "Suzhou",
    "Xi'an",
    "Zhengzhou",
    "Changsha",
    "Qingdao",
    "Ningbo",
    "Dongguan",
    "Hefei",
    "Foshan",
    "Jinan",
    "Dalian",
    "Xiamen",
    "Fuzhou",
    "Kunming",
    "Shenyang",
    "Harbin",
    "Wuxi",
    "Shijiazhuang",
    "Nanchang",
    "Changchun",
    "Taiyuan",
    "Guiyang",
    "Nanning",
    "Urumqi",
    "Hohhot",
    "Lanzhou",
    "Wenzhou",
    "Zhuhai",
    "Changzhou",
    "Nantong",
    "Xuzhou",
    "Yantai",
    "Shaoxing",
    "Jiaxing",
    "Taizhou",
    "Zhongshan",
    "Huizhou",
    "Tangshan",
    "Luoyang",
    "Haikou",
    "Guangdong",
    "Jiangsu",
    "Zhejiang",
    "Shandong",
    "Shanghai",
    "Beijing",
    "Sichuan",
    "Fujian",
    "Hubei",
    "Henan",
    "Hunan",
    "Anhui",
    "Hebei",
    "Liaoning",
    "Chongqing",
  ],
} as const;

export type ProcurementCountrySlug = keyof typeof sourceLocationNames;

export type ProcurementLocation = {
  name: string;
  slug: string;
};

type ProcurementCountry = {
  slug: ProcurementCountrySlug;
  name: "India" | "China";
  serviceSlug: "india-procurement-agent" | "china-procurement-agent";
  locations: ProcurementLocation[];
};

function uniqueLocations(names: readonly string[]) {
  return Array.from(
    new Map(
      names.map((name) => [locationSlug(name), { name, slug: locationSlug(name) }]),
    ).values(),
  );
}

export const procurementCountries: ProcurementCountry[] = [
  {
    slug: "india",
    name: "India",
    serviceSlug: "india-procurement-agent",
    locations: uniqueLocations(sourceLocationNames.india),
  },
  {
    slug: "china",
    name: "China",
    serviceSlug: "china-procurement-agent",
    locations: uniqueLocations(sourceLocationNames.china),
  },
];

export function getProcurementCountry(countrySlug: string) {
  return procurementCountries.find((country) => country.slug === countrySlug);
}

export function getProcurementLocation(countrySlug: string, location: string) {
  return getProcurementCountry(countrySlug)?.locations.find(
    (item) => item.slug === location,
  );
}

export function isLocationProcurementService(
  countrySlug: string,
  serviceSlug: string,
) {
  return getProcurementCountry(countrySlug)?.serviceSlug === serviceSlug;
}

export function procurementPageTitle(
  countrySlug: string,
  locationName: string,
) {
  const country = getProcurementCountry(countrySlug);
  return country
    ? `${locationName} ${country.name} Procurement Agent for United States Buyers`
    : undefined;
}

export const procurementLocationRouteParams = procurementCountries.flatMap(
  (country) =>
    country.locations.map((location) => ({
      country: country.slug,
      location: location.slug,
      service: country.serviceSlug,
    })),
);
