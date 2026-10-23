import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyRoot = path.resolve(repoRoot, "..", "indiachina-website");
const outputFile = path.join(repoRoot, "data", "legacy-product-pages.json");
const assetRoot = path.join(repoRoot, "public", "images", "product-sourcing");

const categories = [
  {
    name: "Fashion and Apparel",
    slug: "fashion-and-apparel",
    products: ["clothing", "women-clothing", "men-clothing", "sportswear", "shoes", "sandals", "ladies-shoes", "watch", "jewelery", "t-shirt"],
  },
  {
    name: "Kids items",
    slug: "kids-items",
    products: ["toys", "soft-toys", "wooden-toys", "educational-toys"],
  },
  {
    name: "Bags",
    slug: "bags",
    products: ["school-bags", "kids-bags", "fashion-bags", "travel-bags"],
  },
  {
    name: "Mobile & Accessories",
    slug: "mobile-and-accessories",
    products: ["mobile-phones", "headphones", "phone-accessories", "phone-cases", "phone-cover", "power-bank"],
  },
  {
    name: "Home & Kitchen Goods",
    slug: "home-and-kitchen-goods",
    products: ["kitchen-appliances", "kitchen-accessories", "utensils", "decor-items", "household-items", "cookware"],
  },
  {
    name: "Industrial products",
    slug: "industrial-products",
    products: ["machines", "machine-parts"],
  },
  { name: "Furniture", slug: "furniture", products: ["furniture"] },
  { name: "Electronics", slug: "electronics", products: ["electronics"] },
  {
    name: "Stationery & Office Supplies",
    slug: "stationery-and-office-supplies",
    products: ["stationery-office-supplies"],
  },
];

const countries = ["us", "uk", "in"];
const sourceFilename = (slug) => (slug === "machine-parts" ? "machine-Parts.php" : `${slug}.php`);

function repairEncoding(value) {
  let result = String(value || "");
  if (/[ÃÂâð]/.test(result)) {
    const windows1252 = new Map([
      ["€", 0x80], ["‚", 0x82], ["ƒ", 0x83], ["„", 0x84], ["…", 0x85],
      ["†", 0x86], ["‡", 0x87], ["ˆ", 0x88], ["‰", 0x89], ["Š", 0x8a],
      ["‹", 0x8b], ["Œ", 0x8c], ["Ž", 0x8e], ["‘", 0x91], ["’", 0x92],
      ["“", 0x93], ["”", 0x94], ["•", 0x95], ["–", 0x96], ["—", 0x97],
      ["˜", 0x98], ["™", 0x99], ["š", 0x9a], ["›", 0x9b], ["œ", 0x9c],
      ["ž", 0x9e], ["Ÿ", 0x9f],
    ]);
    const bytes = Array.from(result, (character) => {
      const code = character.codePointAt(0) ?? 0;
      return windows1252.get(character) ?? (code <= 0xff ? code : 0x3f);
    });
    const repaired = Buffer.from(bytes).toString("utf8");
    if (!repaired.includes("�")) result = repaired;
  }
  return result;
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    quot: '"',
    lt: "<",
    gt: ">",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
  };
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&([a-z]+);/gi, (match, entity) => named[entity.toLowerCase()] ?? match);
}

function cleanText(value) {
  return repairEncoding(
    decodeEntities(
      String(value || "")
        .replace(/<\?(?:php|=)[\s\S]*?\?>/gi, " ")
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, " "),
    ),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("T Shirt", "T-Shirt")
    .replace("Jewelery", "Jewellery");
}

function assignmentString(source, variable) {
  const expression = new RegExp(`\\$${variable}\\s*=\\s*(["'])([\\s\\S]*?)\\1\\s*;`);
  return cleanText(source.match(expression)?.[2] || "");
}

function extractTagEntries(source, tag) {
  const expression = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  return Array.from(source.matchAll(expression), (match) => ({
    index: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    text: cleanText(match[1]),
  })).filter((entry) => entry.text);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractSections(source) {
  const headings = extractTagEntries(source, "h2");
  return headings
    .map((heading, index) => {
      const end = headings[index + 1]?.index ?? source.length;
      const slice = source.slice(heading.end, end);
      const paragraphs = unique(extractTagEntries(slice, "p").map(({ text }) => text))
        .filter((text) => text.length >= 35);
      const highlights = unique(extractTagEntries(slice, "h3").map(({ text }) => text))
        .filter((text) => text.length >= 3 && text.length <= 110);
      return { title: heading.text, paragraphs, highlights };
    })
    .filter((section) => section.title.length >= 4 && (section.paragraphs.length || section.highlights.length))
    .filter((section) => !/frequently asked|top-selling/i.test(section.title));
}

function extractArrayBlock(source, variable) {
  const start = source.search(new RegExp(`\\$${variable}\\s*=\\s*\\[`));
  if (start < 0) return "";
  const open = source.indexOf("[", start);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = open; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (character === "[") depth += 1;
    if (character === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(open, index + 1);
    }
  }
  return "";
}

function childArrays(block) {
  const items = [];
  let depth = 0;
  let start = -1;
  let quote = "";
  let escaped = false;
  for (let index = 0; index < block.length; index += 1) {
    const character = block[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (character === "[") {
      depth += 1;
      if (depth === 2) start = index;
    } else if (character === "]") {
      if (depth === 2 && start >= 0) items.push(block.slice(start, index + 1));
      depth -= 1;
    }
  }
  return items;
}

function phpUnescape(value) {
  return cleanText(String(value || "").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
}

function itemString(item, key) {
  const expression = new RegExp(`["']${key}["']\\s*=>\\s*(["'])((?:\\\\.|(?!\\1)[\\s\\S])*?)\\1`);
  return phpUnescape(item.match(expression)?.[2] || "");
}

function phpStrings(item) {
  return Array.from(item.matchAll(/'((?:\\.|[^'])*)'|"((?:\\.|[^"])*)"/g), (match) => phpUnescape(match[1] ?? match[2] ?? ""));
}

function itemNumber(item, key, rate) {
  const tail = item.match(new RegExp(`["']${key}["']\\s*=>\\s*([^,\\n\\]]+)`))?.[1] || "";
  const direct = tail.match(/^\s*(\d+(?:\.\d+)?)/)?.[1];
  if (direct) return Number(direct);
  const divided = tail.match(/round\(\s*(\d+(?:\.\d+)?)\s*\/\s*\$\w+/i)?.[1];
  if (divided && rate) return Number((Number(divided) / rate).toFixed(2));
  return undefined;
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeAsset(value) {
  const cleaned = String(value || "").replace(/^\.\//, "").replaceAll("\\", "/");
  if (!cleaned.toLowerCase().startsWith("assets/image/")) return "";
  return cleaned.slice("assets/image/".length);
}

function publicAsset(relativePath) {
  return relativePath ? `/images/product-sourcing/${relativePath}` : "";
}

function extractAssetReferences(source) {
  const values = [];
  const expression = /["'](assets\/image\/[^"']+?\.(?:avif|gif|jpe?g|png|webp))["']/gi;
  for (const match of source.matchAll(expression)) values.push(normalizeAsset(match[1]));
  return unique(values);
}

function extractProducts(source, assetReferences, fallbackName, fallbackIntro) {
  const block = extractArrayBlock(source, "products");
  const rateMatch = source.match(/\$(?:usd|gbp|inr)?rate\s*=\s*(\d+(?:\.\d+)?)/i);
  const rate = Number(rateMatch?.[1] || 0);
  const currency = assignmentString(source, "currencySymbol");
  const items = childArrays(block)
    .map((item, index) => {
      const name = itemString(item, "name");
      if (!name) return null;
      const image = normalizeAsset(itemString(item, "image"));
      return {
        slug: slugify(name) || `option-${index + 1}`,
        name,
        description: itemString(item, "desc") || itemString(item, "description") || fallbackIntro,
        badge: itemString(item, "badge"),
        delivery: itemString(item, "delivery"),
        image: publicAsset(image),
        currency,
        price: itemNumber(item, "price", rate),
        compareAtPrice: itemNumber(item, "mrp", rate),
        rating: itemNumber(item, "rating", rate),
        reviews: itemNumber(item, "reviews", rate),
      };
    })
    .filter(Boolean);

  if (items.length) return items;

  const fallbackImages = assetReferences.filter((asset) => asset.toLowerCase().startsWith("products/")).slice(0, 8);
  return fallbackImages.map((image, index) => {
    const filename = path.basename(image, path.extname(image)).replace(/[-_]?\d+(?:\s*\(\d+\))?$/i, "");
    const name = titleFromSlug(filename.replace(/[^a-z0-9]+/gi, "-") || `${fallbackName}-${index + 1}`);
    return {
      slug: slugify(`${name}-${index + 1}`),
      name,
      description: fallbackIntro,
      badge: "Sourcing option",
      delivery: "Specifications, MOQ, samples, production, inspection, and shipping are confirmed with the selected supplier.",
      image: publicAsset(image),
      currency: "",
    };
  });
}

function extractFaqs(source) {
  return childArrays(extractArrayBlock(source, "faqs"))
    .map((item) => {
      const keyedQuestion = itemString(item, "question");
      const keyedAnswer = itemString(item, "answer");
      if (keyedQuestion && keyedAnswer) return { question: keyedQuestion, answer: keyedAnswer };
      const strings = phpStrings(item).filter((value) => !["question", "answer"].includes(value));
      return strings.length >= 2 ? { question: strings[0], answer: strings[1] } : null;
    })
    .filter(Boolean);
}

async function copyAsset(relativePath) {
  if (!relativePath) return false;
  let source = path.join(legacyRoot, "assets", "image", ...relativePath.split("/"));
  if (!existsSync(source) && !relativePath.toLowerCase().startsWith("products/")) {
    const productAsset = path.join(legacyRoot, "assets", "image", "products", path.basename(relativePath));
    if (existsSync(productAsset)) source = productAsset;
  }
  if (!existsSync(source)) return false;
  const destination = path.join(assetRoot, ...relativePath.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  return true;
}

async function main() {
  if (!existsSync(legacyRoot)) throw new Error(`Legacy repository not found: ${legacyRoot}`);
  const assetRelative = path.relative(repoRoot, assetRoot);
  if (!assetRelative || assetRelative.startsWith("..") || path.isAbsolute(assetRelative)) {
    throw new Error(`Refusing to replace assets outside the target repository: ${assetRoot}`);
  }
  await rm(assetRoot, { recursive: true, force: true });
  await mkdir(assetRoot, { recursive: true });

  const pages = {};
  const referencedAssets = new Set();

  for (const country of countries) {
    for (const category of categories) {
      for (const slug of category.products) {
        const sourcePath = path.join(legacyRoot, country, sourceFilename(slug));
        const source = await readFile(sourcePath, "utf8");
        const name = titleFromSlug(slug);
        const h1 = extractTagEntries(source, "h1")[0]?.text || name;
        const h1End = extractTagEntries(source, "h1")[0]?.end ?? 0;
        const intro = extractTagEntries(source.slice(h1End, h1End + 6000), "p")
          .map(({ text }) => text)
          .find((text) => text.length >= 45) || assignmentString(source, "page_description");
        const assets = extractAssetReferences(source);
        assets.forEach((asset) => referencedAssets.add(asset));
        const products = extractProducts(source, assets, name, intro);
        products.forEach((product) => {
          const asset = product.image.replace(/^\/images\/product-sourcing\//, "");
          if (asset) referencedAssets.add(asset);
        });
        const heroAsset = assets.find((asset) => !asset.toLowerCase().startsWith("products/")) || products[0]?.image.replace(/^\/images\/product-sourcing\//, "") || "";

        pages[`${country}/${slug}`] = {
          country,
          slug,
          category: category.name,
          categorySlug: category.slug,
          name,
          seoTitle: assignmentString(source, "page_title") || `${name} sourcing from China`,
          seoDescription: assignmentString(source, "page_description") || intro,
          keywords: assignmentString(source, "page_keywords"),
          heroTitle: h1,
          heroIntro: intro,
          heroImage: publicAsset(heroAsset),
          sections: extractSections(source),
          products,
          faqs: extractFaqs(source),
        };
      }
    }
  }

  const copied = [];
  const missing = [];
  for (const asset of [...referencedAssets].sort()) {
    if (await copyAsset(asset)) copied.push(asset);
    else missing.push(asset);
  }

  const payload = {
    source: "../indiachina-website",
    categories,
    countries,
    pages,
    assets: { copied: copied.length, missing },
  };
  await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Imported ${Object.keys(pages).length} localized product pages.`);
  console.log(`Copied ${copied.length} product assets; ${missing.length} references were missing.`);
  console.log(`Extracted ${Object.values(pages).reduce((sum, page) => sum + page.products.length, 0)} localized subproducts.`);
}

await main();
