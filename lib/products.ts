import type { Metadata } from "next";

import legacyProductData from "@/data/legacy-product-pages.json";
import { getBuyerMarket, type BuyerMarket } from "@/lib/markets";

const productSiteOrigin = "https://market.sellerslogin.com";

export type ProductCard = {
  slug: string;
  name: string;
  description: string;
  badge?: string;
  delivery?: string;
  image?: string;
  currency?: string;
  price?: number;
  compareAtPrice?: number;
  rating?: number;
  reviews?: number;
};

export type ProductContentSection = {
  title: string;
  paragraphs: string[];
  highlights: string[];
};

export type ProductSourcingPage = {
  country: "us" | "uk" | "in";
  slug: string;
  category: string;
  categorySlug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  heroTitle: string;
  heroIntro: string;
  heroImage: string;
  sections: ProductContentSection[];
  products: ProductCard[];
  faqs: { question: string; answer: string }[];
};

export type ProductCategory = {
  name: string;
  slug: string;
  products: string[];
};

type ProductData = {
  categories: ProductCategory[];
  pages: Record<string, ProductSourcingPage>;
};

const data = legacyProductData as unknown as ProductData;

export const productCategories = data.categories;
export const productCountryRouteSlugs = ["us", "uk", "india", "in"] as const;

export function productDataCountry(country: string) {
  return country.toLowerCase() === "india" ? "in" : country.toLowerCase();
}

export function canonicalProductCountry(country: string) {
  return productDataCountry(country) === "in" ? "india" : productDataCountry(country);
}

export function getProductMarket(country: string): BuyerMarket | undefined {
  return getBuyerMarket(canonicalProductCountry(country));
}

export function getProductPage(country: string, slug: string) {
  return data.pages[`${productDataCountry(country)}/${slug.toLowerCase()}`];
}

export function getProductItem(page: ProductSourcingPage, itemSlug: string) {
  return page.products.find((product) => product.slug === itemSlug.toLowerCase());
}

export function productPagePath(country: string, productSlug: string) {
  return `/${canonicalProductCountry(country)}/${productSlug}`;
}

export function productItemPath(country: string, productSlug: string, itemSlug: string) {
  return `${productPagePath(country, productSlug)}/${itemSlug}`;
}

export function productDirectoryPath(country: string) {
  return `/${canonicalProductCountry(country)}/products`;
}

export const productPageRouteParams = productCountryRouteSlugs.flatMap((country) =>
  productCategories.flatMap((category) =>
    category.products.map((slug) => ({ country, slug })),
  ),
);

export const productItemRouteParams = productPageRouteParams.flatMap(({ country, slug }) => {
  const page = getProductPage(country, slug);
  return (page?.products || []).map((product) => ({
    country,
    slug,
    city: product.slug,
  }));
});

export function productAlternates(country: string, productSlug: string, itemSlug?: string): NonNullable<Metadata["alternates"]> {
  const localized = (market: "us" | "uk" | "india") =>
    itemSlug
      ? productItemPath(market, productSlug, itemSlug)
      : productPagePath(market, productSlug);
  const absolute = (pathname: string) => new URL(pathname, productSiteOrigin).href;
  return {
    canonical: absolute(localized(canonicalProductCountry(country) as "us" | "uk" | "india")),
    languages: {
      "en-US": absolute(localized("us")),
      "en-GB": absolute(localized("uk")),
      "en-IN": absolute(localized("india")),
      "x-default": absolute(localized("us")),
    },
  };
}
