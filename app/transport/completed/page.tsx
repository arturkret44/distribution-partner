import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { hasUserReviewed, createReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function CompletedTransportPage() {
  const { user } = await requireRole("transport");
  const supabase = await supabaseServer();

  // 🔥 pobierz zamknięte transporty
  const { data: deals } = await supabase
    .from("transport_requests")
    .select(`
      id,
      farmer_id,
      closed_at,
      pickup_location,
      delivery_location,
      pickup_date,
      delivery_date,
      cargo_type,
      cargo_weight,
      pallets_count
    `)
    .eq("transport_user_id", user.id)
    .eq("status", "closed")
    .order("closed_at", { ascending: false });

  let dealsWithProfiles = deals || [];

  if (deals && deals.length > 0) {
    const farmerIds = deals.map((d) => d.farmer_id);

    const { data: farmers } = await supabase
      .from("profiles")
      .select("id, company_name, contact_email, phone")
      .in("id", farmerIds);

    dealsWithProfiles = deals.map((d) => ({
      ...d,
      profile: farmers?.find((f) => f.id === d.farmer_id) || null,
    }));
  }
// 🔥 REVIEW STATUS
const reviewStatusMap: Record<string, boolean> = {};

for (const deal of dealsWithProfiles) {
  const reviewed = await hasUserReviewed(
    user.id,
    "transport",
    deal.id
  );
  reviewStatusMap[deal.id] = reviewed;
}
  return (
    <main className="min-h-screen bg-green-50">
      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            Completed transport jobs
          </h1>

          <a
            href="/transport"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ← Back to dashboard
          </a>
        </div>

        {/* EMPTY */}
        {(!dealsWithProfiles || dealsWithProfiles.length === 0) && (
          <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
            No completed transport jobs yet.
          </div>
        )}

        {/* TABLE */}
        {dealsWithProfiles && dealsWithProfiles.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-green-100 text-left">
                <tr>
                  <th className="p-3">Closed</th> 
                  <th className="p-3">Route</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Cargo</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Review</th>
                </tr>
              </thead>

              <tbody>
                {dealsWithProfiles.map((r) => (
                  <tr key={r.id} className="border-t">
<td className="p-3">
  {r.closed_at
    ? new Date(r.closed_at).toLocaleString()
    : "—"}
</td>                    
                    {/* ROUTE */}
                    <td className="p-3">
                      📍 {r.pickup_location || "?"} → {r.delivery_location || "?"}
                    </td>

                    {/* DATES */}
                    <td className="p-3">
                      {r.pickup_date || "?"} → {r.delivery_date || "?"}
                    </td>

                    {/* CARGO */}
                    <td className="p-3">
                      <div>{r.cargo_type || "—"}</div>
                      {r.cargo_weight && (
                        <div className="text-xs text-gray-500">
                          ⚖️ {r.cargo_weight}
                        </div>
                      )}
                      {r.pallets_count && (
                        <div className="text-xs text-gray-500">
                          📦 {r.pallets_count} pallets
                        </div>
                      )}
                    </td>
{/* FARMER */}
<td className="p-3">
  <div className="font-medium">
    {r.profile?.company_name || "Unknown"}
  </div>
  <div className="text-xs text-gray-500">
    {r.profile?.contact_email}
  </div>
</td>

{/* REVIEW */}
<td className="p-3">
  {reviewStatusMap[r.id] ? (
    <span className="text-green-600 font-medium text-sm">
      ✅ Reviewed
    </span>
  ) : (
    <form action={createReview} className="flex gap-2">
      <input type="hidden" name="context_type" value="transport" />
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
