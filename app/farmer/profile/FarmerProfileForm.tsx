"use client";

import { INCOTERMS, DELIVERY_SCOPES, EU_COUNTRIES } from "@/lib/options";
import { useState } from "react";

export default function FarmerProfileForm({
  profile,
  userEmail,
  saveAction,
}: {
  profile: any;
  userEmail: string;
  saveAction: any;
}) {

const [canExport, setCanExport] = useState(
  profile?.can_export || false
);

  return (
    <form action={saveAction} className="mt-6 space-y-4 max-w-5xl">

      {/* Email read-only */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email (login)
        </label>
        <input
          value={userEmail}
          disabled
          className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          This email is used for login and cannot be changed here.
        </p>
      </div>
{/* Contact email */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Contact email
  </label>
  <input
    name="contact_email"
    type="email"
    defaultValue={profile?.contact_email || userEmail}
    required
    className="mt-1 w-full border rounded-md px-3 py-2"
  />
  <p className="text-xs text-gray-500 mt-1">
    This is the official contact email visible to buyers and partners.
  </p>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    First name
  </label>
  <input
    name="first_name"
    defaultValue={profile?.first_name || ""}
    required
    className="mt-1 w-full border rounded-md px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Last name
  </label>
  <input
    name="last_name"
    defaultValue={profile?.last_name || ""}
    required
    className="mt-1 w-full border rounded-md px-3 py-2"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Organization number (Sweden)
  </label>
  <input
    name="org_number"
    defaultValue={profile?.org_number || ""}
    required
    className="mt-1 w-full border rounded-md px-3 py-2"
    placeholder="XXXXXX-XXXX"
  />
</div>


      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company name
        </label>
        <input
          name="company_name"
          defaultValue={profile?.company_name || ""}
          required
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone number
        </label>
        <input
          name="phone"
          defaultValue={profile?.phone || ""}
          required
          className="mt-1 w-full border rounded-md px-3 py-2"
          placeholder="+46 ..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website (optional)
        </label>
        <input
          name="website"
          defaultValue={profile?.website || ""}
          className="mt-1 w-full border rounded-md px-3 py-2"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          name="country"
          defaultValue={profile?.country || ""}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          name="city"
          defaultValue={profile?.city || ""}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          name="address"
          defaultValue={profile?.address || ""}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Short description
        </label>
        <textarea
          name="description"
          defaultValue={profile?.description || ""}
          rows={4}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

{/* --- FARM DETAILS --- */}
<div className="pt-6 border-t">
  <h2 className="text-lg font-semibold text-green-800 mb-4">
    Farm details
  </h2>

  <div>
    <label className="block text-sm font-medium text-gray-700">
      Farm name
    </label>
    <input
      name="farm_name"
      defaultValue={profile?.farm_name || ""}
      className="mt-1 w-full border rounded-md px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">
      Years in business
    </label>
<input
  name="years_in_business"
  type="number"
  min={0}
  step={1}
  defaultValue={profile?.years_in_business || ""}
  className="mt-1 w-full border rounded-md px-3 py-2"
  placeholder="e.g. 15"
/>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">
      Company type
    </label>
    <select
      name="company_type"
      defaultValue={profile?.company_type || ""}
      className="mt-1 w-full border rounded-md px-3 py-2"
    >
      <option value="">Select type</option>
      <option value="family_farm">Family farm</option>
      <option value="limited_company">Limited company</option>
      <option value="cooperative">Cooperative</option>
      <option value="corporation">Corporation</option>
    </select>
  </div>
</div>

{/* --- CERTIFICATIONS --- */}
<div className="pt-6 border-t">
  <h2 className="text-lg font-semibold text-green-800 mb-4">
    Certifications & compliance
  </h2>

  <div className="space-y-2">

    <label className="flex items-center gap-2">
      <input type="checkbox" name="registered_livsmedelsverket" defaultChecked={profile?.registered_livsmedelsverket || false}/>
      Registered in Livsmedelsverket
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="inspected_jordbruksverket" defaultChecked={profile?.inspected_jordbruksverket || false}/>
      Inspected by Jordbruksverket
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="is_krav_certified" defaultChecked={profile?.is_krav_certified || false}/>
      KRAV certified
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="is_eu_organic" defaultChecked={profile?.is_eu_organic || false}/>
      EU organic certification
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="is_global_gap" defaultChecked={profile?.is_global_gap || false}/>
      Global G.A.P
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="is_ip_sigill" defaultChecked={profile?.is_ip_sigill || false}/>
      IP Sigill
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="has_haccp" defaultChecked={profile?.has_haccp || false}/>
      HACCP plan
    </label>

    <label className="flex items-center gap-2">
      <input type="checkbox" name="has_traceability" defaultChecked={profile?.has_traceability || false}/>
      Traceability system
    </label>

  </div>

  {/* Info box */}
  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-gray-700">
    <p className="font-medium">Verification required</p>
    <p className="mt-1">
      If you selected any certifications, please send supporting documents to:
      <br />
      <span className="font-semibold">verification@yourdomain.com</span>
    </p>
    <p className="mt-1">
      Your account will be marked as <span className="font-semibold">Verified supplier</span> after manual review.
    </p>
  </div>

</div>
{/* ===== DELIVERY & LOGISTICS ===== */}
<div className="mt-10">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Delivery & logistics
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm text-gray-600">Delivery scope</label>
<select
  name="delivery_scope"
  defaultValue={profile?.delivery_scope || ""}
  className="mt-1 w-full border rounded-md px-3 py-2"
>
  <option value="">Select scope</option>
  {DELIVERY_SCOPES.map((s) => (
    <option key={s.value} value={s.value}>
      {s.label}
    </option>
  ))}
</select>
    </div>

    <div>
      <label className="block text-sm text-gray-600">Incoterms</label>
<select
  name="incoterms"
  defaultValue={profile?.incoterms || ""}
  className="mt-1 w-full border rounded-md px-3 py-2"
>
  <option value="">Select Incoterms</option>
  {INCOTERMS.map((i) => (
    <option key={i.value} value={i.value}>
      {i.label}
    </option>
  ))}
</select>
    </div>

    <div>
      <label className="block text-sm text-gray-600">
        Max delivery distance (km)
      </label>
<input
  type="number"
  name="max_delivery_distance_km"
  min={0}
  step={1}
  defaultValue={profile?.max_delivery_distance_km || ""}
  className="mt-1 w-full border rounded-md px-3 py-2"
/>
    </div>

    <div className="flex items-center gap-3 mt-6">
      <input
        type="checkbox"
        name="has_own_transport"
        defaultChecked={profile?.has_own_transport}
      />
      <span>Own transport available</span>
    </div>

    <div className="flex items-center gap-3 mt-6">
      <input
        type="checkbox"
        name="needs_transport"
        defaultChecked={profile?.needs_transport}
      />
      <span>Needs transport</span>
    </div>

  </div>
</div>
{/* ===== PAYMENT TERMS ===== */}
<div className="mt-10">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Payment terms
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm text-gray-600">
        Payment terms (days)
      </label>
<input
  type="number"
  name="payment_terms_days"
  min={0}
  step={1}
  defaultValue={profile?.payment_terms_days || ""}
  className="mt-1 w-full border rounded-md px-3 py-2"
/>
    </div>

    <div>
      <label className="block text-sm text-gray-600">
        Credit limit (SEK)
      </label>
<input
  type="number"
  name="credit_limit_sek"
  min={0}
  step={1000}
  defaultValue={profile?.credit_limit_sek || ""}
  className="mt-1 w-full border rounded-md px-3 py-2"
/>
    </div>

    <div className="flex items-center gap-3 mt-6">
      <input
        type="checkbox"
        name="accepts_prepayment"
        defaultChecked={profile?.accepts_prepayment}
      />
      <span>Accepts prepayment</span>
    </div>

    <div className="flex items-center gap-3 mt-6">
      <input
        type="checkbox"
        name="accepts_factoring"
        defaultChecked={profile?.accepts_factoring}
      />
      <span>Accepts factoring</span>
    </div>

  </div>
</div>
{/* ===== EXPORT ===== */}
<div className="mt-10">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Export
  </h2>

<div className="space-y-4">
    <div className="flex items-center gap-3 mt-2">
<input
  type="checkbox"
  name="can_export"
  checked={canExport}
  onChange={(e) => setCanExport(e.target.checked)}
/>
      <span>Can export internationally</span>
    </div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Export countries
  </label>

<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
  {EU_COUNTRIES.map((country) => {
    const selected =
      profile?.export_countries?.split(",").includes(country) || false;

    return (
<label
  key={country}
  className={`w-full flex items-start gap-2 px-3 py-2 border rounded-xl text-sm shadow-sm transition
    ${canExport
      ? "bg-white hover:bg-green-50 hover:border-green-400 cursor-pointer"
      : "bg-gray-100 opacity-50 cursor-not-allowed"
    }`}
>
  <input
    type="checkbox"
    name="export_countries"
    value={country}
    defaultChecked={selected}
    disabled={!canExport}
    className="h-4 w-4 shrink-0 mt-1"
  />
<span className="text-sm">{country}</span>
</label>
    );
  })}
</div>

</div>
  </div>
</div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-700 text-white rounded-md"
      >
        Save profile
      </button>

    </form>
  );
}
