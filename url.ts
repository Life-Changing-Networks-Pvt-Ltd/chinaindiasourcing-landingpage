import { locationData } from "@/data";
import { buyerMarkets } from "@/lib/markets";
import { services } from "@/lib/services";

export const siteOrigin = "https://market.sellerslogin.com";

export const routePath = {
  home: "/",
  buyers: "/buyers",
  sellers: "/sellers",
  payments: "/payments",
  services: "/services",
  terms: "/terms",
  market: (marketSlug: string) => `/${marketSlug}`,
  section: (section: "top" | "how" | "categories" | "support" | "services") =>
    `/#${section}`,
  marketService: (marketSlug: string, serviceSlug: string) =>
    `/${marketSlug}/${serviceSlug}`,
  state: (marketSlug: string, stateSlug: string) =>
    `/${marketSlug}/${stateSlug}`,
  city: (marketSlug: string, stateSlug: string, citySlug: string) =>
    `/${marketSlug}/${stateSlug}/${citySlug}`,
  regionalService: (
    marketSlug: string,
    stateSlug: string,
    serviceSlug: string,
  ) => `/${marketSlug}/${stateSlug}/${serviceSlug}`,
} as const;

export const sectionPaths = [
  routePath.section("top"),
  routePath.section("how"),
  routePath.section("categories"),
  routePath.section("support"),
  routePath.section("services"),
] as const;

export const marketPaths = buyerMarkets.map((market) =>
  routePath.market(market.slug),
);

export const marketServicePaths = buyerMarkets.flatMap((market) =>
  services.map((service) => routePath.marketService(market.slug, service.slug)),
);

export const statePaths = locationData.flatMap((market) =>
  market.states.map((state) => routePath.state(market.countrySlug, state.slug)),
);

export const cityPaths = locationData.flatMap((market) =>
  market.states.flatMap((state) =>
    state.cities.map((city) =>
      routePath.city(market.countrySlug, state.slug, city.slug),
    ),
  ),
);

export const regionalServiceRouteParams = locationData.flatMap((market) =>
  market.states.flatMap((state) =>
    services.map((service) => ({
      country: market.countrySlug,
      slug: state.slug,
      city: service.slug,
    })),
  ),
);

export const regionalServicePaths = regionalServiceRouteParams.map(
  ({ country, slug, city }) =>
    routePath.regionalService(country, slug, city),
);

const canonicalWebsitePaths = Array.from(
  new Set([
    routePath.home,
    routePath.buyers,
    routePath.services,
    routePath.terms,
    ...sectionPaths,
    ...marketPaths,
    ...marketServicePaths,
    ...statePaths,
    ...cityPaths,
    ...regionalServicePaths,
  ]),
);

export const legacyRedirectPaths = canonicalWebsitePaths
  .filter((path) => path.startsWith("/us/"))
  .map((path) => path.replace(/^\/us\//, "/usa/"));

export const websitePaths = Array.from(
  new Set([...canonicalWebsitePaths, ...legacyRedirectPaths]),
).sort();

export const websiteUrls = websitePaths.map(
  (path) => new URL(path, siteOrigin).href,
);
