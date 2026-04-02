import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { hasUserReviewed, createReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function CompletedStoragePage() {
  const { user } = await requireRole("warehouse");
  const supabase = await supabaseServer();

const { data: deals } = await supabase
  .from("warehouse_requests")
.select(`
  id,
  closed_at,
  farmer_id,
  storage_start_date,
  storage_end_date,
  storage_quantity,
  storage_unit,
  storage_location,
  requires_refrigeration,
  storage_notes,
  packaging_type,
  storage_type,
  announcements (
    product_name
  ),
  profile:profiles!warehouse_requests_farmer_id_fkey (
    company_name,
    contact_email
  )
`)
  .eq("warehouse_user_id", user.id)
  .eq("status", "closed")
  .not("storage_start_date", "is", null)
  .order("closed_at", { ascending: false });
let dealsWithProfiles = deals || [];

if (deals && deals.length > 0) {
  const farmerIds = deals.map((d) => d.farmer_id);

  const { data: farmerProfiles } = await supabase
    .from("profiles")
    .select("id, company_name, contact_email, phone")
    .in("id", farmerIds);

  dealsWithProfiles = deals.map((d) => ({
    ...d,
    profile: farmerProfiles?.find((p) => p.id === d.farmer_id) || null,
  }));
}
// 🔥 REVIEW STATUS
const reviewStatusMap: Record<string, boolean> = {};

for (const deal of dealsWithProfiles) {
  const reviewed = await hasUserReviewed(
    user.id,
    "warehouse",
    deal.id
  );
  reviewStatusMap[deal.id] = reviewed;
}
  return (
<main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-10">
<div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold text-green-800">
    Completed storage
  </h1>

</div>
        {(!deals || deals.length === 0) && (
          <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
            No completed storage yet.
          </div>
        )}

        {deals && deals.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-green-100 text-left">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Review</th>
                </tr>
              </thead>

              <tbody>
{dealsWithProfiles.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
{r.announcements?.[0]?.product_name ? (
  <span>📦 {r.announcements[0].product_name}</span>
) : (
  <span className="text-gray-500 italic text-sm">
    General inquiry
  </span>
)}
                    </td>

                    <td className="p-3">
                      {r.storage_start_date} → {r.storage_end_date}
                    </td>

<td className="p-3">
  {/* MAIN VALUE */}
  <div className="font-medium">
    {r.storage_quantity} {r.storage_unit}
  </div>

  {/* BADGES */}
  <div className="flex gap-2 mt-1">
    {r.packaging_type && (
      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
        📦 {r.packaging_type}
      </span>
    )}

    {r.storage_type && (
      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
        🏬 {r.storage_type}
      </span>
    )}
  </div>
</td>
                    <td className="p-3">
                      <div className="font-medium">
                        {r.profile?.company_name || "Unknown farmer"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.profile?.contact_email}
                      </div>
                    </td>

                    <td className="p-3">
                      {r.storage_location || "—"}
                    </td>

                    <td className="p-3">
                      {r.storage_notes || "—"}
                    </td>
<td className="p-3">
  {reviewStatusMap[r.id] ? (
    <span className="text-green-600 font-medium text-sm">
      ✅ Reviewed
    </span>
  ) : (
    <form action={createReview} className="flex gap-2">
      <input type="hidden" name="context_type" value="warehouse" />
      <input type="hidden" name="context_id" value={r.id} />
      <input
        type="hidden"
        name="reviewed_user_id"
        value={r.farmer_id}
      />

      <select name="rating" required className="text-sm border rounded px-2">
        <option value="">⭐</option>
        <option value="5">5</option>
        <option value="4">4</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
      </select>

      <input
        name="comment"
        placeholder="Comment"
        className="text-sm border rounded px-2"
      />

      <button
        type="submit"
        className="text-sm bg-green-600 text-white px-3 rounded"
      >
        Save
      </button>
    </form>
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
