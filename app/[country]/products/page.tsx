import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDirectoryPage } from "@/components/product-directory-page";
import {
  getProductMarket,
  productCountryRouteSlugs,
  productDirectoryPath,
} from "@/lib/products";

type ProductDirectoryRouteProps = {
  params: Promise<{ country: string }>;
};

export function generateStaticParams() {
  return productCountryRouteSlugs.map((country) => ({ country }));
}

export async function generateMetadata({ params }: ProductDirectoryRouteProps): Promise<Metadata> {
  const { country } = await params;
  const market = getProductMarket(country);
  if (!market) return { title: "Products not found | ChinaIndiaSourcing" };
  return {
    title: `Products to Source from China for ${market.name} | SellersLogin Market`,
    description: `Browse China sourcing pages for fashion, toys, bags, electronics, home goods, machinery, furniture, and office supplies for buyers in ${market.locationName}.`,
    alternates: { canonical: productDirectoryPath(country) },
  };
}

export default async function ProductDirectoryRoute({ params }: ProductDirectoryRouteProps) {
  const { country } = await params;
  const market = getProductMarket(country);
  if (!market) notFound();
  return <ProductDirectoryPage market={market} country={country} />;
}
