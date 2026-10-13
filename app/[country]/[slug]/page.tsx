import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationPage } from "@/components/location-page";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { getLocationState, stateRouteParams } from "@/data";
import { buyerMarkets, getBuyerMarket } from "@/lib/markets";
import { countryAlternates } from "@/lib/seo";
import { getSpreadsheetServiceMetadata } from "@/lib/spreadsheet-metadata";
import {
  customClearancePageTitle,
  getService,
  isCustomClearanceService,
  serviceDisplayName,
  services,
} from "@/lib/services";
import { routePath } from "@/url";

type CountryServicePageProps = {
  params: Promise<{ country: string; slug: string }>;
};

export function generateStaticParams() {
  const serviceRouteParams = buyerMarkets.flatMap((market) =>
    services.map((service) => ({ country: market.slug, slug: service.slug })),
  );

  return [...serviceRouteParams, ...stateRouteParams];
}

export async function generateMetadata({ params }: CountryServicePageProps): Promise<Metadata> {
  const { country, slug } = await params;
  const market = getBuyerMarket(country);
  const service = getService(slug);
  const state = getLocationState(country, slug);

  if (!market || (!service && !state)) return { title: "Page not found | Chinaindiasourcing" };

  if (state) {
    return {
      title: `Find Sourcing Agents in ${state.name}, ${market.name} | ChinaIndiaSourcing`,
      description: `A directory connecting buyers in ${state.name}, ${market.locationName} with independent sourcing agents and providers in China, India, and other origin countries.`,
      alternates: countryAlternates(
        routePath.state(market.slug, state.slug),
        (alternateMarket) => routePath.market(alternateMarket.slug),
      ),
    };
  }

  const marketTitle = market.slug === "us" ? "USA" : market.name;
  const displayServiceName = serviceDisplayName(service!.name);
  const matchedMetadata = getSpreadsheetServiceMetadata(country, slug);

  return {
    title:
      matchedMetadata?.title ??
      (isCustomClearanceService(service!.name)
        ? customClearancePageTitle(service!.origin, marketTitle)
        : `${service!.name} for ${market.name} Buyers | ChinaIndiaSourcing`),
    description:
      matchedMetadata?.description ??
      `Find independent providers offering ${displayServiceName} in ${service!.origin} for buyers importing to ${market.locationName}. Compare partners, quotations, quality checkpoints, and delivery options through ChinaIndiaSourcing.`,
    alternates: countryAlternates(
      routePath.marketService(market.slug, service!.slug),
      (alternateMarket) =>
        routePath.marketService(alternateMarket.slug, service!.slug),
    ),
  };
}

export default async function CountryServicePage({ params }: CountryServicePageProps) {
  const { country, slug } = await params;
  const market = getBuyerMarket(country);
  const service = getService(slug);
  const state = getLocationState(country, slug);

  if (!market || (!service && !state)) notFound();

  if (state) return <LocationPage market={market} state={state} />;

  return <ServiceDetailPage market={market} service={service!} />;
}
