"use client";

import { useState } from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCTION_METHODS,
  QUANTITY_UNITS,
  HARVEST_PERIODS,
} from "@/lib/options";
import { swedenRegions } from "@/lib/swedenRegions";

export default function AnnouncementFilters({
  search,
  category,
  region,
  production,
  unit,
  harvest,
  minQty,
  maxQty,
}: {
  search?: string;
  category?: string;
  region?: string;
  production?: string;
  unit?: string;
  harvest?: string;
  minQty?: number | null;
  maxQty?: number | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">

      {/* 🔍 SEARCH ROW */}
      <form className="flex gap-2 w-full md:max-w-xl">
        <input
          type="text"
          name="search"
          defaultValue={search || ""}
          placeholder="Search products..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />

        <button
          type="submit"
          className="px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-4 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Filters {open ? "▲" : "▼"}
        </button>
      </form>

      {/* 🔽 FILTER PANEL */}
      {open && (
        <form className="mt-4 flex flex-wrap gap-3">

<select
  name="category"
  defaultValue={category || ""}
  className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm min-w-[220px]"
>
  <option value="">All categories</option>

  {/* 🌾 CROPS */}
  <optgroup label="🌾 Crops">
    <option value="grains_oilseeds">Grains & oilseeds</option>
    <option value="vegetables">Vegetables</option>
    <option value="fruits_berries">Fruits & berries</option>
  </optgroup>

  {/* 🐄 ANIMAL PRODUCTS */}
  <optgroup label="🐄 Animal products">
    <option value="meat">Meat</option>
    <option value="dairy">Dairy</option>
    <option value="eggs">Eggs</option>
  </optgroup>

  {/* 🌱 AGRI INPUTS */}
  <optgroup label="🌱 Agri inputs">
    <option value="feed">Feed</option>
    <option value="seeds_planting">Seeds & planting material</option>
  </optgroup>

  {/* 🍯 SPECIALTY */}
  <optgroup label="🍯 Specialty">
    <option value="honey">Honey & bee products</option>
    <option value="herbs_spices">Herbs & spices</option>
  </optgroup>

  {/* 🏭 PROCESSED */}
  <optgroup label="🏭 Processed">
    <option value="processed_food">Processed foods</option>
  </optgroup>

  {/* 🌲 OTHER */}
  <optgroup label="🌲 Other">
    <option value="biomass">Wood / biomass</option>
    <option value="other">Other</option>
  </optgroup>
</select>
          <select name="region" defaultValue={region || ""} className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm">
            <option value="">All regions</option>
            {swedenRegions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select name="production" defaultValue={production || ""} className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm">
            <option value="">Production method</option>
            {PRODUCTION_METHODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <select name="unit" defaultValue={unit || ""} className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm">
            <option value="">Unit</option>
            {QUANTITY_UNITS.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>

          <select name="harvest" defaultValue={harvest || ""} className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-sm">
            <option value="">Harvest period</option>
            {HARVEST_PERIODS.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>

<input
  type="number"
  name="minQty"
  min="0"
  step="1"
  defaultValue={minQty || ""}
  placeholder="Min qty"
  className="border rounded-md px-3 py-2 w-28"
/>

<input
  type="number"
  name="maxQty"
  min="0"
  step="1"
  defaultValue={maxQty || ""}
  placeholder="Max qty"
  className="border rounded-md px-3 py-2 w-28"
/>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Apply filters
          </button>
        </form>
      )}
    </div>
  );
}
