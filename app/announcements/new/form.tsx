"use client";
import { updateAnnouncement } from "../[id]/edit/actions";
import { useState } from "react";
import { createAnnouncement } from "./actions";
import {
  PRODUCT_CATEGORIES,
  PRODUCTION_METHODS,
  PRICE_TYPES,
  QUANTITY_UNITS,
  PACKAGING_TYPES,
  HARVEST_PERIODS,
} from "@/lib/options";

export function CreateAnnouncementForm({
  announcement,
  mode = "create",
}: {
  announcement?: any;
  mode?: "create" | "edit";
}) {
  const [category, setCategory] = useState("");
  const [productionMethod, setProductionMethod] = useState("");
  const [packaging, setPackaging] = useState("");

  return (
<form
  action={mode === "edit" ? updateAnnouncement : createAnnouncement}
  className="space-y-6"
>
{mode === "edit" && (
  <input type="hidden" name="id" value={announcement.id} />
)}
      {/* Announcement type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Announcement type
        </label>

        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="regular"
              defaultChecked={announcement?.type === "regular"}  
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">Regular offer</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="surplus"
              defaultChecked={announcement?.type === "surplus"} 
              className="h-4 w-4"
            />
            <span className="text-sm text-gray-700">
              Surplus / urgent promotion
            </span>
          </label>
        </div>
      </div>

      {/* Product */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product
        </label>
        <input
          name="product_name"
          defaultValue={announcement?.product_name || ""}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Product details */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-medium text-gray-800 mb-3">
          Product details
        </h3>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Product category
          </label>
          <select
            name="product_category"
            required
            value={category || announcement?.product_category || ""}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {category === "other" && (
            <input
              name="product_category_other"
              required
              placeholder="Please specify category"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          )}
        </div>

        {/* Variety / breed */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Variety / breed
          </label>
          <input
            name="variety"
            defaultValue={announcement?.variety || ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g. Wheat – Durum, Angus cattle, etc."
          />
        </div>

        {/* Harvest period */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Harvest period
          </label>
          <select
            name="harvest_period"
            defaultValue={announcement?.harvest_period || ""}  
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select period</option>
            {HARVEST_PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Production method */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Production method
          </label>
          <select
            name="production_method"
            value={productionMethod || announcement?.production_method || ""}
            onChange={(e) => setProductionMethod(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select method</option>
            {PRODUCTION_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {productionMethod === "other" && (
            <input
              name="production_method_other"
              required
              placeholder="Please specify production method"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          )}
        </div>

        {/* Packaging */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Packaging type
          </label>
          <select
            name="packaging_type"
            value={packaging || announcement?.packaging_type || ""} 
            onChange={(e) => setPackaging(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select packaging</option>
            {PACKAGING_TYPES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {packaging === "other" && (
            <input
              name="packaging_type_other"
              required
              placeholder="Please specify packaging type"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          )}
        </div>

        {/* Min order quantity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Minimum order quantity
          </label>
          <input
            name="min_order_quantity"
            type="number"
            min="0"
            step="0.01"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Expiration date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Expiration / best before
          </label>
          <input
            name="expiration_date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Origin country */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country of origin
          </label>
          <input
            name="origin_country"
            defaultValue={announcement?.origin_country || ""} 
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="e.g. Sweden"
          />
        </div>
      </div>

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            name="quantity"
            defaultValue={announcement?.quantity || ""}
            type="number"
            min="1"
            step="1"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            name="unit"
            defaultValue={announcement?.unit || ""}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select unit</option>
            {QUANTITY_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quality
        </label>
        <input
          name="quality"
          defaultValue={announcement?.quality || ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          name="price"
          defaultValue={announcement?.price || ""}  
          type="number"
          min="0"
          step="0.01"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">
          Price type
        </label>

        <select
          name="price_type"
          defaultValue={announcement?.price_type || "fixed"}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        >
          {PRICE_TYPES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price negotiable */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="price_negotiable" defaultChecked={announcement?.price_negotiable} className="h-4 w-4" />
        <label className="text-sm text-gray-700">
          Price is negotiable
        </label>
      </div>

      {/* Transport */}
      <div className="border rounded-md p-4 bg-gray-50">
        <h3 className="font-medium text-gray-800 mb-3">
          Transport requirements
        </h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="requires_refrigeration"
            defaultChecked={announcement?.requires_refrigeration}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-700">
            This product requires refrigerated transport
            <span className="block text-xs text-gray-500">
              (for example: fresh vegetables, fruits, dairy, meat)
            </span>
          </span>
        </label>
      </div>

      {/* Pickup */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pickup region (län)
          </label>
          <select
            name="pickup_region"
            defaultValue={announcement?.pickup_region || ""}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select region</option>
            <option>Skåne län</option>
            <option>Stockholms län</option>
            <option>Västra Götalands län</option>
            <option>Hallands län</option>
            <option>Blekinge län</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pickup kommun
          </label>
          <input
            name="pickup_kommun"
            defaultValue={announcement?.pickup_kommun || ""}
            required
            placeholder="e.g. Ängelholm"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Sell by */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sell by date
        </label>
        <input
          name="sell_by_date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          name="status"
          value="draft"
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Save draft
        </button>

        <button
          type="submit"
          name="status"
          value="published"
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Publish
        </button>
      </div>
    </form>
  );
}
