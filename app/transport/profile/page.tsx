import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { saveTransportProfile } from "./actions";
import TransportProfileForm from "./TransportProfileForm";

export const dynamic = "force-dynamic";

export default async function TransportProfilePage() {
  const { user } = await requireRole("transport");

  const supabase = await supabaseServer();

const { data: transportProfile } = await supabase
  .from("transport_profiles")
  .select("*")
  .eq("user_id", user.id)
  .single();

const { data: baseProfile } = await supabase
  .from("profiles")
  .select("phone, website, address, country, company_name")
  .eq("id", user.id)
  .single();

// merge danych
const profile = {
  ...transportProfile,
  ...baseProfile,
};

  return (
<main className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white border-b">
    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Transport Company Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your company information and service details
        </p>
      </div>

      <a
        href="/transport"
        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        ← Back to dashboard
      </a>
    </div>
  </header>

  {/* Content */}
  <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* LEFT – FORM */}
    <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-8">
      <TransportProfileForm
        profile={profile}
        saveAction={saveTransportProfile}
      />

<div className="mt-6 flex gap-3 flex-wrap">

  <a
    href="/transport/profile/images"
    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
  >
     Manage fleet photos
  </a>

  <a
    href={`/profiles/${user.id}?from=/transport/profile`}
    target="_blank"
    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
  >
     View public profile
  </a>

</div>
    </div>

    {/* RIGHT – SIDEBAR */}
    <div className="space-y-6">

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h3 className="font-semibold text-green-800 mb-3">
           Tips for better visibility
        </h3>

        <ul className="text-sm text-green-900 space-y-2">
          <li>✔ Add a clear company description</li>
          <li>✔ Specify your regions and kommuner</li>
          <li>✔ Mark if you offer refrigerated transport</li>
          <li>✔ Upload photos of your fleet</li>
        </ul>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-800 mb-3">
           Why complete your profile?
        </h3>

        <ul className="text-sm text-blue-900 space-y-2">
          <li>More transport requests from farmers</li>
          <li>Higher visibility in search results</li>
          <li>Faster contact and better deals</li>
        </ul>
      </div>

    </div>
  </section>
</main>

  );
}
