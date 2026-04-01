"use client";

import { useState } from "react";
import { swedenRegions } from "@/lib/swedenRegions";
import { kommunerByRegion } from "@/lib/swedenKommuner";

export default function WarehouseProfileForm({
  profile,
  saveAction,
}: {
  profile: any;
  saveAction: any;
}) {
  const [region, setRegion] = useState(profile?.operating_region || "");

  const availableKommuner = region
    ? kommunerByRegion[region] || []
    : [];

  return (
    <form action={saveAction} className="mt-8 max-w-3xl">
<div className="p-6 space-y-6">

        {/* ===== BASIC INFO ===== */}
<section className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
            🏢 Company information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company name
              </label>
              <input
                name="company_name"
                defaultValue={profile?.company_name || ""}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
              />
            </div>


<div>
  <label className="block text-sm font-medium text-gray-700">
    Phone
  </label>
  <input
    name="phone"
    defaultValue={profile?.phone || ""}
    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Website
  </label>
  <input
    name="website"
    defaultValue={profile?.website || ""}
    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Country
  </label>
  <input
    name="country"
    defaultValue={profile?.country || ""}
    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Address
  </label>
  <input
    name="address"
    defaultValue={profile?.address || ""}
    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
  />
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact email
            </label>
            <input
              name="contact_email"
              type="email"
              defaultValue={profile?.contact_email || ""}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organization number (optional)
            </label>
            <input
              name="org_number"
              defaultValue={profile?.org_number || ""}
              placeholder="XXXXXX-XXXX"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
            />
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City (optional)
              </label>
              <input
                name="city"
                defaultValue={profile?.city || ""}
                placeholder="e.g. Malmö"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
              />
            </div>
          </div>
        </section>

        <hr />

        {/* ===== OPERATING AREA ===== */}
        <section className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
            🌍 Operating area
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Operating region (Län)
              </label>

              <select
                name="operating_region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
              >
                <option value="">-- select region --</option>

                {swedenRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Operating kommuner
              </label>

<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3 bg-white">

  {availableKommuner.map((kommun) => (
    <label
      key={kommun}
      className="flex items-center gap-2 text-sm text-gray-700"
    >
      <input
        type="checkbox"
        name="operating_kommuner"
        value={kommun}
        defaultChecked={profile?.operating_kommuner?.includes(kommun)}
        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
      />
      {kommun}
    </label>
  ))}

</div>

              <p className="text-xs text-gray-500 mt-2">
                Hold CTRL (Windows) or CMD (Mac) to select multiple
              </p>
            </div>
          </div>
        </section>

        <hr />

        {/* ===== FACILITIES ===== */}
        <section className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
            ❄ Facilities
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Recommended for fruits, vegetables, dairy and meat
          </p>

          <label className="inline-flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="has_cold_storage"
              defaultChecked={profile?.has_cold_storage || false}
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              We offer cold storage facilities
            </span>
          </label>
        </section>

        <hr />

        {/* ===== DESCRIPTION ===== */}
        <section className="bg-gray-50 border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-3">
            📝 About your warehouse
          </h2>

          <textarea
            name="description"
            defaultValue={profile?.description || ""}
            rows={5}
            placeholder="Describe your warehouse, capacity, services, etc."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
          />
        </section>

        {/* ===== SUBMIT ===== */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-medium px-5 py-2 rounded-md transition"
          >
            Save profile
          </button>
        </div>

      </div>
    </form>
  );
}
