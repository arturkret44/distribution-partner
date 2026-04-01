import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { saveWarehouseProfile } from "./actions";
import WarehouseProfileForm from "./WarehouseProfileForm";

export const dynamic = "force-dynamic";

export default async function WarehouseProfilePage() {
  const { user } = await requireRole("warehouse");

  const supabase = await supabaseServer();

const { data: warehouseProfile } = await supabase
  .from("warehouse_profiles")
  .select("*")
  .eq("user_id", user.id)
  .single();

const { data: baseProfile } = await supabase
  .from("profiles")
  .select("company_name, phone, website, address, country, city")
  .eq("id", user.id)
  .single();

const profile = {
  ...warehouseProfile,
  ...baseProfile,
};

return (
  <main className="min-h-screen bg-gray-50">

    {/* HEADER */}
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Warehouse Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your storage offer and availability
          </p>
        </div>

      </div>
    </header>

    {/* CONTENT */}
<section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

  {/* LEFT – FORM */}
  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-8">
    <WarehouseProfileForm
      profile={profile}
      saveAction={saveWarehouseProfile}
    />

    <div className="mt-6 flex gap-4">
      <a
        href="/warehouse/profile/images"
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm font-medium"
      >
        Manage warehouse photos
      </a>

      <a
        href={`/profiles/${user.id}?from=/warehouse/profile`}
        target="_blank"
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm font-medium"
      >
        View your public profile
      </a>
    </div>
  </div>

  {/* RIGHT – SIDE PANEL */}
  <div className="space-y-6">

    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
      <h3 className="font-semibold text-purple-900 mb-2">
        📦 Tips for better visibility
      </h3>

      <ul className="text-sm text-purple-800 space-y-1">
        <li>• Clearly describe storage capacity</li>
        <li>• Mention if you offer cold storage</li>
        <li>• List the regions you serve</li>
        <li>• Add photos of your warehouse</li>
      </ul>
    </div>

    <div className="bg-gray-50 border rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-2">
        Example warehouse profile
      </h3>

      <p className="text-sm text-gray-600">
        "Cold storage facility in Skåne with space for fruits and vegetables.
        Fast loading and flexible pickup times."
      </p>
    </div>

  </div>

</section>
  </main>
);

}
