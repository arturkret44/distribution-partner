"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { swedenRegions } from "@/lib/swedenRegions";
import { kommunerByRegion } from "@/lib/swedenKommuner";

export default function TransportFilters() {
  const router = useRouter();

  const [region, setRegion] = useState("");
  const [kommun, setKommun] = useState("");
  const [refrigerated, setRefrigerated] = useState(false);

  const availableKommuner = region
    ? kommunerByRegion[region] || []
    : [];

  function apply() {
    const params = new URLSearchParams();

    if (region) params.set("region", region);
    if (kommun) params.set("kommun", kommun);
    if (refrigerated) params.set("refrigerated", "true");

    router.push("/farmer/find-transport?" + params.toString());
  }

return (
  <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">

    <h3 className="text-sm font-semibold text-gray-700 mb-4">
      Filters
    </h3>

    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">

      {/* Region */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          Region
        </label>
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setKommun("");
          }}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All regions</option>
          {swedenRegions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Kommun */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          Kommun
        </label>
        <select
          value={kommun}
          onChange={(e) => setKommun(e.target.value)}
          disabled={!region}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[180px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All kommuner</option>
          {availableKommuner.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      {/* Refrigerated */}
      <div className="flex items-center gap-2 mt-2 md:mt-6">
        <input
          type="checkbox"
          checked={refrigerated}
          onChange={(e) => setRefrigerated(e.target.checked)}
          className="w-4 h-4 accent-green-600"
        />
        <label className="text-sm text-gray-700">
          Refrigerated only
        </label>
      </div>

      {/* Apply */}
      <button
        onClick={apply}
        className="mt-2 md:mt-6 px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-sm"
      >
        Apply filters
      </button>

    </div>
  </div>
);

}
