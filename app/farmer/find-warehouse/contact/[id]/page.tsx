import { requireApprovedUser } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { sendWarehouseRequest } from "../../actions";

export const dynamic = "force-dynamic";

export default async function ContactWarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: warehouse } = await supabase
    .from("warehouse_profiles")
    .select("user_id, company_name")
    .eq("user_id", id)
    .single();

  if (!warehouse) {
    return <p className="p-6 text-red-600">Warehouse not found.</p>;
  }

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, product_name, quantity, pickup_region, pickup_kommun")
    .eq("farmer_id", user.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">🏬 Contact warehouse</p>
        <h1 className="text-2xl font-semibold mt-1">
          {warehouse.company_name}
        </h1>
      </div>

      {/* COMPANY CARD */}
      <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="font-medium">{warehouse.company_name}</p>
        <p className="text-sm text-gray-500">
          Storage services for agricultural goods
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-sm">
        <form action={sendWarehouseRequest}>

          <input type="hidden" name="warehouse_user_id" value={id} />

          {/* SELECT */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Select announcement (optional)
            </label>

            <select
              name="announcement_id"
              className="input"
            >
              <option value="">
                General inquiry (no specific product)
              </option>

              {announcements?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.product_name} – {a.quantity} – {a.pickup_region} ({a.pickup_kommun})
                </option>
              ))}
            </select>
          </div>

          {/* MESSAGE */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Your message
            </label>

            <textarea
              name="message"
              required
              className="input h-32"
              placeholder="Describe what storage you need (product, volume, duration, temperature requirements...)"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
          >
            Send request
          </button>
        </form>
      </div>

      {/* BACK */}
      <div className="mt-6">
        <a
          href="/farmer/find-warehouse"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to warehouse list
        </a>
      </div>

    </main>
  );
}
