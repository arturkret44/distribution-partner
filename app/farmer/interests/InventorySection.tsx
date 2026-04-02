"use client";

import React, { useMemo, useState } from "react";
import { PRODUCT_CATEGORIES, getLabel } from "@/lib/options";
import { updateInterestStatus, closeDeal } from "./actions";

type InventoryItem = {
  id: string;
  product_name: string;
  total: number;
  available: number;
  reserved: number;
  sold: number;
  buyers?: any[];
};
type Props = {
  inventoryByCategory: Record<string, InventoryItem[]>;
  th: React.CSSProperties;
  td: React.CSSProperties;
};

export default function InventorySection({ inventoryByCategory, th, td }: Props) {
  const [statusFilter, setStatusFilter] =
  useState<"all" | "pending" | "contacted" | "agreed" | "closed" | "rejected">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openProducts, setOpenProducts] = useState<Record<string, boolean>>({});
function toggleCategory(category: string) {
  setOpenCategories((prev) => ({
    ...prev,
    [category]: !prev[category],
  }));
}
function toggleProduct(id: string) {
  setOpenProducts((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
}
const categories = useMemo(() => {
  return PRODUCT_CATEGORIES.map((c) => c.value);
}, []);

const statusCounts = useMemo(() => {
  const counts = {
    all: 0,
    pending: 0,
    contacted: 0,
    agreed: 0,
    closed: 0,
    rejected: 0,
  };

  Object.values(inventoryByCategory || {}).forEach((items) => {
    items.forEach((item) => {
      if (!item.buyers) return;

      item.buyers.forEach((b: any) => {
        counts.all++;
        if (counts[b.status as keyof typeof counts] !== undefined) {
          counts[b.status as keyof typeof counts]++;
        }
      });
    });
  });

  return counts;
}, [inventoryByCategory]);

  const filteredEntries = useMemo(() => {
    return Object.entries(inventoryByCategory || {})
      .filter(([category]) => (categoryFilter === "all" ? true : category === categoryFilter))
      .map(([category, items]) => {
const filteredItems = items.filter((item) => {

  if (statusFilter === "all") return true;

  if (!item.buyers || item.buyers.length === 0) return false;

  return item.buyers.some((b) => b.status === statusFilter);
});
        return [category, filteredItems] as const;
      })
      // usuń puste kategorie po filtrze
      .filter(([_, items]) => items.length > 0);
  }, [inventoryByCategory, categoryFilter, statusFilter]);

  return (
<div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
<h2 className="text-lg font-semibold mb-4">
        My Inventory
      </h2>

      {/* FILTERS */}
<div className="flex gap-3 mb-5 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="input"
        >
<option value="all">All ({statusCounts.all})</option>
<option value="pending">Pending ({statusCounts.pending})</option>
<option value="contacted">Contacted ({statusCounts.contacted})</option>
<option value="agreed">Agreed ({statusCounts.agreed})</option>
<option value="closed">Closed ({statusCounts.closed})</option>
<option value="rejected">Rejected ({statusCounts.rejected})</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input"
        >
          <option value="all">All categories</option>
{PRODUCT_CATEGORIES.map((c) => (
  <option key={c.value} value={c.value}>
    {c.label}
  </option>
))}
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <p style={{ color: "#475569" }}>No inventory items match the selected filters.</p>
      ) : (
        filteredEntries.map(([category, items]) => (
<div key={category} className="mb-6">
<h3
  onClick={() => toggleCategory(category)}
className="text-sm font-semibold text-gray-700 flex items-center gap-2 cursor-pointer mb-2 hover:text-gray-900"
>
  {openCategories[category] ? "▼" : "▶"}{" "}
  {getLabel(PRODUCT_CATEGORIES, category) || category} ({items.length})
</h3>
{openCategories[category] && (
<table className="w-full text-sm">
              <thead>
<tr className="bg-gray-50 text-gray-600">
<th style={{ ...th, width: "40%" }}>Product</th>
<th style={{ ...th, width: "15%" }}>Total</th>
<th style={{ ...th, width: "15%" }}>Available</th>
<th style={{ ...th, width: "15%" }}>Reserved</th>
<th style={{ ...th, width: "15%" }}>Sold</th>
                </tr>
              </thead>

              <tbody>
{items.map((item) => (
  <React.Fragment key={item.id}>
<tr key={item.id} className="border-b hover:bg-gray-50 transition">
<td className="py-2 px-3 cursor-pointer font-medium text-gray-800" onClick={() => toggleProduct(item.id)}>
  {openProducts[item.id] ? "▼ " : "▶ "}
  {item.product_name}
<span
className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700"
>
regular
</span>
  {(item.buyers?.length ?? 0) > 0 && (
    <span
className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium"
    >
      {item.buyers.length} buyers
    </span>
  )}
</td>
                    <td style={td}>{item.total}</td>
                    <td style={td}>{item.available}</td>
                    <td style={td}>{item.reserved}</td>
                    <td style={td}>{item.sold}</td>
                  </tr>
{openProducts[item.id] && item.buyers?.length > 0 && (
  <tr>
<td colSpan={5} className="p-4 bg-gray-50 rounded-xl">
<div className="font-semibold mb-2 text-gray-700">
Interested buyers for {item.product_name}
</div>
<table className="w-full ml-4 text-sm">
<thead>
  <tr>
    <th className="text-left py-2 px-3 font-medium">Buyer</th>
    <th className="text-left py-2 px-3 font-medium">Quantity</th>
    <th className="text-left py-2 px-3 font-medium">Product price</th>
    <th className="text-left py-2 px-3 font-medium">Offer</th>
    <th className="text-left py-2 px-3 font-medium">Status</th>
    <th className="text-left py-2 px-3 font-medium">Date</th>
  </tr>
</thead>
        <tbody>
          {item.buyers.map((b: any) => (
<tr key={b.interest_id}>
<td className="py-2 px-3">
<a
href={`/profiles/${b.buyer_id}`}
className="text-blue-600 font-semibold hover:underline"
>
{b.buyer_company_name}
</a>
</td>
  <td className="py-2 px-3">{b.requested_quantity || "—"}</td>

  <td className="py-2 px-3">{b.price ? `${b.price} SEK` : "—"}</td>

  <td className="py-2 px-3">
    {b.offered_price ? `${b.offered_price} SEK` : "—"}
  </td>

<td className="py-2 px-3">
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>

<span
  className={`
    px-2 py-1 rounded-full text-xs font-semibold capitalize
    ${
      b.status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : b.status === "contacted"
        ? "bg-amber-100 text-amber-800"
        : b.status === "agreed"
        ? "bg-green-100 text-green-700"
        : b.status === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-600"
    }
  `}
>
{b.status}
</span>
{b.status !== "closed" && (
<form action={updateInterestStatus} style={{ display: "flex", gap: 6 }}>
<input type="hidden" name="interest_id" value={b.interest_id} />

<select
name="status"
defaultValue={b.status}
style={{
padding: "4px 6px",
borderRadius: 6,
border: "1px solid #e5e7eb",
fontSize: 12
}}
>
<option value="pending">pending</option>
<option value="contacted">contacted</option>
<option value="agreed">agreed</option>
<option value="rejected">rejected</option>
</select>

<button
  type="submit"
  className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-xs transition"
>
  Update
</button>

</form>
)}
{b.status === "agreed" && b.status !== "closed" && (
<form action={closeDeal}>
<input type="hidden" name="interest_id" value={b.interest_id} />

<button
type="submit"
className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-xs transition"
>
Close deal
</button>

</form>
)}
</div>
</td>
  <td style={td}>
    {new Date(b.created_at).toLocaleDateString()}
  </td>
</tr>
          ))}
        </tbody>
      </table>
    </td>
  </tr>
)}
</React.Fragment>
                ))}
              </tbody>
            </table>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const filterStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 13,
  background: "white",
};
