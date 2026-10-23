export type ProductNavigationCategory = {
  name: string;
  products: ReadonlyArray<{
    label: string;
    slug: string;
  }>;
};

export const productNavigation: ReadonlyArray<ProductNavigationCategory> = [
  {
    name: "Fashion and Apparel",
    products: [
      { label: "Clothing", slug: "clothing" },
      { label: "Women Clothing", slug: "women-clothing" },
      { label: "Men Clothing", slug: "men-clothing" },
      { label: "Sportswear", slug: "sportswear" },
      { label: "Shoes", slug: "shoes" },
      { label: "Sandals", slug: "sandals" },
      { label: "Ladies Shoes", slug: "ladies-shoes" },
      { label: "Watches", slug: "watch" },
      { label: "Jewellery", slug: "jewelery" },
      { label: "T-Shirts", slug: "t-shirt" },
    ],
  },
  {
    name: "Kids Items",
    products: [
      { label: "Toys", slug: "toys" },
      { label: "Soft Toys", slug: "soft-toys" },
      { label: "Wooden Toys", slug: "wooden-toys" },
      { label: "Educational Toys", slug: "educational-toys" },
    ],
  },
  {
    name: "Bags",
    products: [
      { label: "School Bags", slug: "school-bags" },
      { label: "Kids Bags", slug: "kids-bags" },
      { label: "Fashion Bags", slug: "fashion-bags" },
      { label: "Travel Bags", slug: "travel-bags" },
    ],
  },
  {
    name: "Mobile & Accessories",
    products: [
      { label: "Mobile Phones", slug: "mobile-phones" },
      { label: "Headphones", slug: "headphones" },
      { label: "Phone Accessories", slug: "phone-accessories" },
      { label: "Phone Cases", slug: "phone-cases" },
      { label: "Phone Covers", slug: "phone-cover" },
      { label: "Power Banks", slug: "power-bank" },
    ],
  },
  {
    name: "Home & Kitchen Goods",
    products: [
      { label: "Kitchen Appliances", slug: "kitchen-appliances" },
      { label: "Kitchen Accessories", slug: "kitchen-accessories" },
      { label: "Utensils", slug: "utensils" },
      { label: "Decor Items", slug: "decor-items" },
      { label: "Household Items", slug: "household-items" },
      { label: "Cookware", slug: "cookware" },
    ],
  },
  {
    name: "Industrial Products",
    products: [
      { label: "Machines", slug: "machines" },
      { label: "Machine Parts", slug: "machine-parts" },
    ],
  },
  {
    name: "Furniture",
    products: [{ label: "Furniture", slug: "furniture" }],
  },
  {
    name: "Electronics",
    products: [{ label: "Electronics", slug: "electronics" }],
  },
  {
    name: "Stationery & Office Supplies",
    products: [
      {
        label: "Stationery & Office Supplies",
        slug: "stationery-office-supplies",
      },
    ],
  },
];
