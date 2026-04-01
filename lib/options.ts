// lib/options.ts

export const PRODUCT_CATEGORIES = [
  { value: "grains_oilseeds", label: "Grains & oilseeds" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits_berries", label: "Fruits & berries" },
  { value: "meat", label: "Meat" },
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "feed", label: "Feed" },
  { value: "seeds_planting", label: "Seeds & planting material" },
  { value: "honey", label: "Honey & bee products" },
  { value: "herbs_spices", label: "Herbs & spices" },
  { value: "processed_food", label: "Processed foods" },
  { value: "biomass", label: "Wood / biomass" },
  { value: "other", label: "Other" },
];

export const PRODUCTION_METHODS = [
  { value: "conventional", label: "Conventional" },
  { value: "organic", label: "Organic" },
  { value: "regenerative", label: "Regenerative" },
  { value: "integrated", label: "Integrated production" },
  { value: "other", label: "Other" },
];

export const PRICE_TYPES = [
  { value: "fixed", label: "Fixed price" },
  { value: "negotiable", label: "Negotiable" },
  { value: "index_linked", label: "Index-linked" },
];

export const QUANTITY_UNITS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "ton", label: "Tons (t)" },
  { value: "pcs", label: "Pieces" },
  { value: "liters", label: "Liters (L)" },
  { value: "m3", label: "Cubic meters (m³)" },
  { value: "pallet", label: "Pallets" },
  { value: "big_bag", label: "Big-bags" },
  { value: "bag", label: "Bags / sacks" },
  { value: "crate", label: "Crates / boxes" },
  { value: "container", label: "Containers" },
  { value: "bale", label: "Bales" },
];

export const PACKAGING_TYPES = [
  { value: "bulk", label: "Bulk / loose" },
  { value: "big_bag", label: "Big-bag" },
  { value: "bags", label: "Bags / sacks" },
  { value: "crates", label: "Crates / boxes" },
  { value: "pallets", label: "Palletized" },
  { value: "vacuum", label: "Vacuum packed" },
  { value: "chilled", label: "Chilled chain" },
  { value: "frozen", label: "Frozen" },
  { value: "other", label: "Other" },
];

export const HARVEST_PERIODS = [
  { value: "jan_feb", label: "Jan–Feb" },
  { value: "mar_apr", label: "Mar–Apr" },
  { value: "may_jun", label: "May–Jun" },
  { value: "jul_aug", label: "Jul–Aug" },
  { value: "sep_oct", label: "Sep–Oct" },
  { value: "nov_dec", label: "Nov–Dec" },
  { value: "year_round", label: "Year-round" },
];

// ===== INCOTERMS =====
export const INCOTERMS = [
  { value: "EXW", label: "EXW – Ex Works" },
  { value: "FCA", label: "FCA – Free Carrier" },
  { value: "FOB", label: "FOB – Free On Board" },
  { value: "CIF", label: "CIF – Cost, Insurance & Freight" },
  { value: "DAP", label: "DAP – Delivered At Place" },
  { value: "DDP", label: "DDP – Delivered Duty Paid" },
];


// ===== DELIVERY SCOPE (prosty poziom) =====
export const DELIVERY_SCOPES = [
  { value: "local", label: "Local (within region)" },
  { value: "sweden", label: "Sweden" },
  { value: "scandinavia", label: "Scandinavia" },
  { value: "eu", label: "European Union" },
  { value: "export", label: "Export worldwide" },
];


// ===== EU COUNTRIES (na start) =====
export const EU_COUNTRIES = [
  "Sweden",
  "Denmark",
  "Finland",
  "Norway",
  "Germany",
  "Netherlands",
  "Poland",
  "France",
  "Italy",
  "Spain",
  "Belgium",
  "Austria",
];

export function getLabel(
  options: { value: string; label: string }[],
  value?: string | null
) {
  if (!value) return null;

  const found = options.find((o) => o.value === value);
  return found ? found.label : value; // fallback jeśli to "other"
}
