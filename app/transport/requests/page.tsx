import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { updateRequestStatus } from "./actions";
import { archiveTransportRequest } from "./[id]/actions";

export const dynamic = "force-dynamic";

export default async function TransportRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { user } = await requireRole("transport");
const params = await searchParams;
const activeTab = params?.tab || "active";
  const supabase = await supabaseServer();

  const { data: requests } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("transport_user_id", user.id)
    .eq("archived_by_transport", false)
    .order("created_at", { ascending: false });
const activeRequests = (requests || []).filter(
  (r) => r.status !== "closed" && r.status !== "rejected"
);

const completedRequests = (requests || []).filter(
  (r) => r.status === "closed"
);
  const { data: unread } = await supabase
    .from("request_messages")
    .select("request_id")
    .eq("request_type", "transport")
    .is("read_at", null)
    .neq("sender_id", user.id);

  const unreadMap = new Set(unread?.map((m) => m.request_id));

  // ===== POBIERZ FARMERÓW =====
  const farmerIds = Array.from(
    new Set((requests ?? []).map((r) => r.farmer_id).filter(Boolean))
  ) as string[];

  const { data: farmers, error: farmersError } = await supabase
    .from("profiles")
    .select("id, company_name, city, contact_email, phone")
    .in("id", farmerIds);

  console.log("FARMER IDS:", farmerIds);
  console.log("FARMERS ERROR:", farmersError);
  console.log("FARMERS DATA:", farmers);

  const farmerMap = new Map(farmers?.map((f) => [f.id, f]));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Requests from farmers
          </h1>

          <a
            href="/transport"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ← Back to dashboard
          </a>
        </div>
      </header>

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 py-10">
<div className="flex gap-4 mb-6">
  <a
    href="/transport/requests?tab=active"
className={`px-4 py-2 rounded-md ${
  activeTab === "active"
    ? "bg-green-600 text-white"
    : "border text-gray-700"
}`}
  >
    Active
  </a>

  <a
    href="/transport/requests?tab=completed"
className={`px-4 py-2 rounded-md ${
  activeTab === "completed"
    ? "bg-green-600 text-white"
    : "border text-gray-700"
}`}
  >
    Completed
  </a>
</div>
{activeTab === "active" && (
  activeRequests.length === 0 ? (
    <p className="text-gray-600">No requests yet.</p>
  ) : (
<div className="mt-6 overflow-x-auto">
  <table className="w-full bg-white border rounded-xl overflow-hidden shadow-sm">
    
    {/* HEADER */}
    <thead className="bg-gray-50 text-left text-sm text-gray-600">
      <tr>
        <th className="px-4 py-3">Company</th>
        <th className="px-4 py-3">City</th>
        <th className="px-4 py-3">Email</th>
        <th className="px-4 py-3">Phone</th>
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="text-sm">
      {activeRequests.map((r) => {
        const hasUnread = unreadMap.has(r.id);
        const farmer = farmerMap.get(r.farmer_id);

        return (
          <tr
            key={r.id}
            className={`border-t hover:bg-gray-50 ${
              hasUnread ? "bg-orange-50" : ""
            }`}
          >
            {/* COMPANY */}
            <td className="px-4 py-3">
              <a
                href={`/profiles/${farmer?.id}?from=/transport/requests`}
                className="font-semibold text-green-700 hover:underline"
              >
                {farmer?.company_name || "—"}
              </a>
            </td>

            {/* CITY */}
            <td className="px-4 py-3">
              {farmer?.city || "—"}
            </td>

            {/* EMAIL */}
            <td className="px-4 py-3">
              {farmer?.contact_email || "—"}
            </td>

            {/* PHONE */}
            <td className="px-4 py-3">
              {farmer?.phone || "—"}
            </td>

            {/* DATE */}
            <td className="px-4 py-3 text-gray-500">
              {new Date(r.created_at).toLocaleDateString()}
            </td>

            {/* STATUS */}
<td className="px-4 py-3">
  {hasUnread && (
    <span className="px-2 py-1 text-xs bg-red-600 text-white rounded mr-2">
      NEW
    </span>
  )}

  {r.status === "pending" && (
    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
      Pending
    </span>
  )}

  {r.status === "closed" && (
    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
      Completed
    </span>
  )}

  {r.status === "rejected" && (
    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
      Rejected
    </span>
  )}
</td>
            {/* ACTIONS */}
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">

                <a
                  href={`/transport/requests/${r.id}`}
                  className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs hover:bg-green-700 transition"
                >
                  Open
                </a>

                <form action={archiveTransportRequest}>
                  <input type="hidden" name="request_id" value={r.id} />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-xs hover:bg-gray-300 transition"
                  >
                    Delete
                  </button>
                </form>

              </div>
            </td>
          </tr>
        );
      })}
    </tbody>

  </table>
</div>
          )
        )}
{activeTab === "completed" && (
  <div className="mt-10">
  <h2 className="text-lg font-bold text-green-800">
    Completed transport deals
  </h2>

  {completedRequests.length === 0 ? (
    <div className="bg-white border rounded-xl p-6 text-center text-gray-600 mt-4">
      No completed deals yet.
    </div>
  ) : (
    <div className="space-y-4 mt-4">
      {completedRequests.map((r) => {
        const farmer = farmerMap.get(r.farmer_id);

        return (
          <div
            key={r.id}
            className="bg-green-50 border border-green-200 rounded-xl p-6"
          >
            <div className="text-sm text-gray-500 mb-2">
              Closed deal
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div>📍 {r.pickup_location} → {r.delivery_location}</div>
              <div>📅 {r.pickup_date} → {r.delivery_date}</div>

              {r.cargo_type && <div>📦 {r.cargo_type}</div>}
              {r.cargo_weight && <div>⚖️ {r.cargo_weight}</div>}
              {r.pallets_count && <div>📦 Pallets: {r.pallets_count}</div>}
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <div>
                Farmer:{" "}
                <span className="font-medium">
                  {farmer?.company_name || "Unknown"}
                </span>
              </div>

              {farmer?.contact_email && (
                <div>Email: {farmer.contact_email}</div>
              )}

              {farmer?.phone && (
                <div>Phone: {farmer.phone}</div>
              )}
            </div>

            <a
              href={`/transport/requests/${r.id}`}
              className="inline-block mt-3 text-sm text-green-700 underline"
            >
              View conversation
            </a>
          </div>
        );
      })}
    </div>
  )}
</div>
)}
      </section>
    </main>
  );
}
