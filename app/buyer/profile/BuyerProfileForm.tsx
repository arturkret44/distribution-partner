"use client";

export default function BuyerProfileForm({
  profile,
  userEmail,
  saveAction,
}: {
  profile: any;
  userEmail: string;
  saveAction: any;
}) {
  return (
    <form action={saveAction} className="mt-6 space-y-4 max-w-xl">

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email (login)
        </label>
        <input
          value={userEmail}
          disabled
          className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100"
        />
      </div>
{/* Contact email */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Contact email (for sellers)
  </label>
  <input
    name="contact_email"
    type="email"
    defaultValue={profile?.contact_email || userEmail}
    required
    className="mt-1 w-full border rounded-md px-3 py-2"
  />
  <p className="text-xs text-gray-500 mt-1">
    This is the official contact email visible to sellers and partners.
  </p>
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
    Organization number (optional)
  </label>
  <input
    name="org_number"
    defaultValue={profile?.org_number || ""}
    className="mt-1 w-full border rounded-md px-3 py-2"
    placeholder="XXXXXX-XXXX"
  />
</div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone number
        </label>
        <input
          name="phone"
          defaultValue={profile?.phone || ""}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          name="website"
          defaultValue={profile?.website || ""}
          className="mt-1 w-full border rounded-md px-3 py-2"
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
          Description
        </label>
        <textarea
          name="description"
          defaultValue={profile?.description || ""}
          rows={4}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-yellow-700 text-white rounded-md"
      >
        Save profile
      </button>
    </form>
  );
}
