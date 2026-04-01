"use client";

import { useState } from "react";
import { swedenRegions } from "@/lib/swedenRegions";
import { kommunerByRegion } from "@/lib/swedenKommuner";

export default function TransportProfileForm({
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
<form
  action={saveAction}
  className="mt-8 max-w-2xl space-y-6"
>

<div className="border rounded-xl p-5 bg-gray-50">
  <h3 className="font-semibold text-gray-800 mb-4">
    Company information
  </h3>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-800">
        Company name
      </label>
      <input
        name="company_name"
        defaultValue={profile?.company_name || ""}
        required
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-800">
        Contact email
      </label>
      <input
        name="contact_email"
        type="email"
        defaultValue={profile?.contact_email || ""}
        required
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-green-500"
      />
    </div>
<div>
  <label className="block text-sm font-semibold text-gray-800">
    Phone
  </label>
  <input
    name="phone"
    defaultValue={profile?.phone || ""}
    className="mt-1 w-full rounded-md border px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-800">
    Website
  </label>
  <input
    name="website"
    defaultValue={profile?.website || ""}
    className="mt-1 w-full rounded-md border px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-800">
    Address
  </label>
  <input
    name="address"
    defaultValue={profile?.address || ""}
    className="mt-1 w-full rounded-md border px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-800">
    Country
  </label>
  <input
    name="country"
    defaultValue={profile?.country || ""}
    className="mt-1 w-full rounded-md border px-3 py-2"
  />
</div>

    <div>
      <label className="block text-sm font-semibold text-gray-800">
        Organization number (optional)
      </label>
      <input
        name="org_number"
        defaultValue={profile?.org_number || ""}
        placeholder="XXXXXX-XXXX"
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm"
      />
    </div>
  </div>
</div>

<div className="border rounded-xl p-5 bg-gray-50">
  <h3 className="font-semibold text-gray-800 mb-4">
    Operating area
  </h3>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-800">
        Operating region (Län)
      </label>

      <select
        name="operating_region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        required
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm"
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
      <label className="block text-sm font-semibold text-gray-800">
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

      <p className="text-xs text-gray-500 mt-1">
        Hold CTRL (Windows) or CMD (Mac) to select multiple
      </p>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-800">
        City (optional)
      </label>
      <input
        name="city"
        defaultValue={profile?.city || ""}
        placeholder="e.g. Malmö"
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm"
      />
    </div>
  </div>
</div>

      {/* REFRIGERATED */}
<div className="border rounded-xl p-5 bg-gray-50">
  <h3 className="font-semibold text-gray-800 mb-4">
    Fleet & capabilities
  </h3>

  <label className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
    <input
      type="checkbox"
      name="has_refrigerated"
      defaultChecked={profile?.has_refrigerated || false}
    />
    <span className="text-sm font-medium text-green-800">
      We have refrigerated vehicles
    </span>
  </label>
</div>

      {/* DESCRIPTION */}
<div className="border rounded-xl p-5 bg-gray-50">
  <h3 className="font-semibold text-gray-800 mb-4">
    Description
  </h3>

  <textarea
    name="description"
    defaultValue={profile?.description || ""}
    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm min-h-[120px]"
  />
</div>
<button
  type="submit"
  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
>
  Save profile
</button>

    </form>
  );
}
