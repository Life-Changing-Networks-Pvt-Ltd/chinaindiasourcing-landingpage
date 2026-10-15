import type { Metadata } from "next";

type PageMetadata = Pick<Metadata, "title" | "description">;

export const homeSpreadsheetMetadata: PageMetadata = {
  title: "China Sourcing Agent Platform | India Global B2B Sourcing Services Marketplace",
  description:
    "ChinaIndiaSourcing.com is a leading B2B platform that brings together sourcing agents and companies from around the world, offering a wide range of products and services. Buyers can connect directly with sourcing agents to meet their requirements with ease. Our top sourcing countries are China, India and Vietnam, while our main buyers come from the USA, UK, India and beyond.",
};

// Global / Default spreadsheet rows. The final page slug is matched without
// requiring the spreadsheet and app country prefixes to be the same.
const defaultServiceMetadata: Record<string, PageMetadata> = {
  "china-buying-agent": {
    title: "China Buying Agent Service | Purchasing Agent China | Yiwu Sourcing Agent",
    description:
      "China Buying Agent, Private Agent China, Yiwu Sourcing Agent, Best China Sourcing Agent, Buying Agent in China",
  },
  "china-sourcing-agent": {
    title: "China Sourcing Agent Services for USA| Indian Sourcing Agent for USA",
    description:
      "We are one of the top China Agents in India and China, we provide the best Sourcing, freight forwarder, negotiation services to our clients and make their business easier.",
  },
  "chinese-product-inspection": {
    title: "China Product Inspection Services for USA | China Factory Inspection & Quality Control",
    description:
      "Professional China product inspection services for USA importers. Factory inspection, supplier verification, and pre-shipment quality control to ensure reliable products before shipment.",
  },
  "india-factory-visit": {
    title: "India Factory Visit for USA Importers | Factory Audit & Supplier Verification",
    description:
      "Professional India factory visit service for USA importers. Verify suppliers, inspect manufacturing facilities, and conduct factory audits before placing production orders in India.",
  },
  "indian-product-inspection": {
    title: "India Product Inspection Services for USA Importers | Quality Control & Factory Audit",
    description:
      "Professional India product inspection services for USA importers. Third-party quality control, factory audits, pre-shipment inspections, and lab testing to ensure defect-free products from India.",
  },
  "trending-indian-product-research": {
    title: "Top Trending Indian Products for USA Importers | Import from India",
    description:
      "Discover trending Indian products for USA importers. Explore high-demand and profitable products to import from India with insights on sourcing, suppliers, and market trends.",
  },
};

// Prefer a market-specific spreadsheet row when available. The sheet's `/in/`
// prefix corresponds to this app's `/india/` route.
const marketServiceMetadata: Record<string, Partial<Record<string, PageMetadata>>> = {
  uk: {
    "china-sourcing-agent": {
      title: "China Sourcing Agent Services for UK| Indian Sourcing Agent for UK",
      description:
        "We are one of the top China Agents in India and China, we provide the best Sourcing, freight forwarder, negotiation services to our clients and make their business easier.",
    },
    "chinese-product-inspection": {
      title: "China Product Inspection Services for UK | China Factory Inspection & Quality Control",
      description:
        "Professional China product inspection services for UK importers. Factory inspection, supplier verification, and pre-shipment quality control to ensure reliable products before shipment.",
    },
    "india-factory-visit": {
      title: "India Factory Visit for UK Importers | Factory Audit & Supplier Verification",
      description:
        "Professional India factory visit service for UK importers. Verify suppliers, inspect manufacturing facilities, and conduct factory audits before placing production orders in India.",
    },
    "indian-product-inspection": {
      title: "India Product Inspection Services for UK Importers | Quality Control & Factory Audit",
      description:
        "Professional India product inspection services for UK importers. Third-party quality control, factory audits, pre-shipment inspections, and lab testing to ensure defect-free products from India.",
    },
    "trending-indian-product-research": {
      title: "Top Trending Indian Products for UK Importers | Import from India",
      description:
        "Discover trending Indian products for UK importers. Explore high-demand and profitable products to import from India with insights on sourcing, suppliers, and market trends.",
    },
  },
  india: {
    "china-sourcing-agent": {
      title: "China Sourcing Agent Services for India | Indian Sourcing Agent for India Importers",
      description:
        "We are one of the top China Agents in India and China, we provide the best Sourcing, freight forwarder, negotiation services to our clients and make their business easier.",
    },
    "chinese-product-inspection": {
      title: "China Product Inspection Services for India | China Factory Inspection & Quality Control",
      description:
        "Professional China product inspection services for India importers. Factory inspection, supplier verification, and pre-shipment quality control to ensure reliable products before shipment.",
    },
  },
};

export function getSpreadsheetServiceMetadata(country: string, slug: string) {
  return marketServiceMetadata[country]?.[slug] ?? defaultServiceMetadata[slug];
}
