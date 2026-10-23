import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationPage } from "@/components/location-page";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { cityRouteParams, getLocationCity, getLocationState } from "@/data";
import { getBuyerMarket, unitedStatesMarket } from "@/lib/markets";
import {
  getProcurementLocation,
  isLocationProcurementService,
  procurementLocationRouteParams,
  procurementPageTitle,
} from "@/lib/procurement-locations";
import { countryAlternates } from "@/lib/seo";
import {
  customClearancePageTitle,
  getService,
  isCustomClearanceService,
  serviceDisplayName,
} from "@/lib/services";
import { routePath } from "@/url";

type CityPageProps = {
  params: Promise<{ country: string; slug: string; city: string }>;
};

export function generateStaticParams() {
  const locationCityRouteParams = cityRouteParams.map(
    ({ country, state, city }) => ({ country, slug: state, city }),
  );

  const sourceLocationServiceRouteParams = procurementLocationRouteParams.map(
    ({ country, location, service }) => ({
      country,
      slug: location,
      city: service,
    }),
  );

  // Other regional service combinations remain available through dynamic generation.
  // Pre-rendering every state × service pair would create tens of thousands of
  // pages and make routine production builds unnecessarily expensive.
  return [...locationCityRouteParams, ...sourceLocationServiceRouteParams];
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { country, slug: stateSlug, city: citySlug } = await params;
  const market = getBuyerMarket(country);
  const state = getLocationState(country, stateSlug);
  const city = getLocationCity(country, stateSlug, citySlug);
  const service = getService(citySlug);
  const procurementLocation = getProcurementLocation(country, stateSlug);

  if (
    procurementLocation &&
    service &&
    isLocationProcurementService(country, service.slug)
  ) {
    return {
      title: procurementPageTitle(country, procurementLocation.name),
      description: `Find independent ${service.name} providers serving ${procurementLocation.name}, ${service.origin}, for United States buyers. Compare supplier research, quotations, negotiation, quality, and shipping coordination support.`,
      alternates: {
        canonical: routePath.sourceLocationService(
          country,
          procurementLocation.slug,
          service.slug,
        ),
      },
    };
  }

  if (!market || !state || (!city && !service)) return { title: "Page not found | Chinaindiasourcing" };

  if (service) {
    const marketTitle = market.slug === "us" ? "USA" : market.name;
    const displayServiceName = serviceDisplayName(service.name);

    return {
      title: isCustomClearanceService(service.name)
        ? customClearancePageTitle(service.origin, `${state.name}, ${marketTitle}`)
        : `${service.name} for Buyers in ${state.name}, ${market.name} | ChinaIndiaSourcing`,
      description: `Find independent providers offering ${displayServiceName} in ${service.origin} for buyers in ${state.name}, ${market.locationName}. Compare partners and coordinate the sourcing journey through the platform.`,
      alternates: countryAlternates(
        routePath.regionalService(market.slug, state.slug, service.slug),
        (alternateMarket) =>
          routePath.marketService(alternateMarket.slug, service.slug),
      ),
    };
  }

  return {
    title: `Find Sourcing Agents in ${city!.name}, ${state.name} | ChinaIndiaSourcing`,
    description: `Connect buyers in ${city!.name}, ${state.name} with independent sourcing agents and providers in China, India, and other origin countries.`,
    alternates: countryAlternates(
      routePath.city(market.slug, state.slug, city!.slug),
      (alternateMarket) => routePath.market(alternateMarket.slug),
    ),
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { country, slug: stateSlug, city: citySlug } = await params;
  const market = getBuyerMarket(country);
  const state = getLocationState(country, stateSlug);
  const city = getLocationCity(country, stateSlug, citySlug);
  const service = getService(citySlug);
  const procurementLocation = getProcurementLocation(country, stateSlug);

  if (
    procurementLocation &&
    service &&
    isLocationProcurementService(country, service.slug)
  ) {
    return (
      <ServiceDetailPage
        market={unitedStatesMarket}
        service={service}
        sourceRegionName={procurementLocation.name}
      />
    );
  }

  if (!market || !state || (!city && !service)) notFound();

  if (service) return <ServiceDetailPage market={market} service={service} regionName={state.name} />;

  return <LocationPage market={market} state={state} city={city!} />;
}
