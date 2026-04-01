import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function deleteWarehouseRequest(formData: FormData) {
  "use server";

  const supabase = await supabaseServer();
  const { user } = await requireRole("farmer");

  const id = formData.get("id") as string;
  if (!id) return;

  const { data: request } = await supabase
    .from("warehouse_requests")
    .select("farmer_id")
    .eq("id", id)
    .single();

  if (!request || request.farmer_id !== user.id) return;

  await supabase
    .from("warehouse_requests")
    .update({ archived_by_farmer: true })
    .eq("id", id);

  revalidatePath("/farmer/requests");
}


async function deleteTransportRequest(formData: FormData) {
  "use server";

  const supabase = await supabaseServer();
  const { user } = await requireRole("farmer");

  const id = formData.get("id") as string;
  if (!id) return;

  // sprawdź czy to jego request
  const { data: request } = await supabase
    .from("transport_requests")
    .select("farmer_id")
    .eq("id", id)
    .single();

  if (!request || request.farmer_id !== user.id) return;

  // zamiast delete — ARCHIVE
  await supabase
    .from("transport_requests")
    .update({ archived_by_farmer: true })
    .eq("id", id);

  revalidatePath("/farmer/requests");
}

export const dynamic = "force-dynamic";

export default async function FarmerRequestsPage() {
  const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  /* =========================
     TRANSPORT REQUESTS
  ========================= */

  const { data: transportRequests } = await supabase
    .from("transport_requests") 
   .select("id, message, status, created_at, transport_user_id")
.eq("farmer_id", user.id)
.eq("archived_by_farmer", false)
    .order("created_at", { ascending: false });
const activeTransportIds = transportRequests?.map(r => r.id) ?? [];

// pobierz wszystkie NIEPRZECZYTANE wiadomości dla farmera
const { data: unreadMessages } = await supabase
  .from("request_messages")
  .select("request_id")
  .eq("request_type", "transport")
  .in("request_id", activeTransportIds)
  .neq("sender_id", user.id)
  .is("read_at", null);

  let enrichedTransport: any[] = [];

  if (transportRequests && transportRequests.length > 0) {
    const transportIds = transportRequests.map((r) => r.transport_user_id);

    const { data: transportProfiles } = await supabase
      .from("transport_profiles")
      .select("user_id, company_name, operating_region")
      .in("user_id", transportIds);

enrichedTransport = transportRequests.map((r) => {
  const hasUnread = unreadMessages?.some(
    (m) => m.request_id === r.id
  );

  return {
    ...r,
    hasUnread,
    profile:
      transportProfiles?.find(
        (p) => p.user_id === r.transport_user_id
      ) || null,
  };
});

  }

  /* =========================
     WAREHOUSE REQUESTS
  ========================= */

  const { data: warehouseRequests } = await supabase
    .from("warehouse_requests")
    .select(
      "id, message, status, created_at, warehouse_user_id, announcement_id"
    )
    .eq("farmer_id", user.id)
    .eq("archived_by_farmer", false)  
  .order("created_at", { ascending: false });
const activeWarehouseIds = warehouseRequests?.map(r => r.id) ?? [];

const { data: unreadWarehouseMessages } = await supabase
  .from("request_messages")
  .select("request_id")
  .eq("request_type", "warehouse")
  .in("request_id", activeWarehouseIds)
  .neq("sender_id", user.id)
  .is("read_at", null);


  let enrichedWarehouse: any[] = [];

  if (warehouseRequests && warehouseRequests.length > 0) {
    const warehouseIds = warehouseRequests.map((r) => r.warehouse_user_id);

    const { data: warehouseProfiles } = await supabase
      .from("warehouse_profiles")
      .select("user_id, company_name")
      .in("user_id", warehouseIds);

enrichedWarehouse = warehouseRequests.map((r) => {
  const hasUnread = unreadWarehouseMessages?.some(
    (m) => m.request_id === r.id
  );

  return {
    ...r,
    hasUnread,
    profile:
      warehouseProfiles?.find(
        (p) => p.user_id === r.warehouse_user_id
      ) || null,
  };
});

  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          My requests
        </h1>

        {/* ================= TRANSPORT ================= */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🚚 Transport requests
          </h2>

          {!enrichedTransport || enrichedTransport.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-gray-500">
              You haven’t sent any transport requests yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Company</th>
                    <th className="text-left px-6 py-3">Message</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Conversation</th>

                  </tr>
                </thead>
                <tbody>
                  {enrichedTransport.map((r) => (
<tr
  key={r.id}
  className={`border-t transition ${
    r.hasUnread
      ? "bg-green-50 hover:bg-green-100"
      : "hover:bg-gray-50"
  }`}
>


                      <td className="px-6 py-4 font-medium">
                        {r.profile?.company_name || "Unknown company"}
                        <div className="text-xs text-gray-500">
                          {r.profile?.operating_region}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {r.message}
                      </td>


                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
<td className="px-6 py-4 flex items-center gap-3">
  <a
    href={`/farmer/requests/transport/${r.id}`}
    className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
  >
    Open →
  </a>

<form action={deleteTransportRequest}>
  <input type="hidden" name="id" value={r.id} />
  <button
    type="submit"
    className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
  >
    Delete
  </button>
</form>

  {r.hasUnread && (
    <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      new
    </span>
  )}
</td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ================= WAREHOUSE ================= */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🏬 Warehouse requests
          </h2>

          {!enrichedWarehouse || enrichedWarehouse.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-gray-500">
              You haven’t sent any warehouse requests yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Warehouse</th>
                    <th className="text-left px-6 py-3">Message</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Conversation</th>

                  </tr>
                </thead>
                <tbody>
                  {enrichedWarehouse.map((r) => (
<tr
  key={r.id}
  className={`border-t transition ${
    r.hasUnread
      ? "bg-green-50 hover:bg-green-100 border-l-4 border-green-500"
      : "hover:bg-gray-50"
  }`}
>

                      <td className="px-6 py-4 font-medium">
                        {r.profile?.company_name || "Unknown warehouse"}
                      </td>

<td className={`px-6 py-4 ${r.hasUnread ? "font-semibold text-gray-900" : "text-gray-700"}`}>
  {r.message}
</td>


                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
<td className="px-6 py-4 flex items-center gap-3">
  <a
    href={`/farmer/requests/warehouse/${r.id}`}
    className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
  >
    Open →
  </a>

  <form action={deleteWarehouseRequest}>
    <input type="hidden" name="id" value={r.id} />
    <button
      type="submit"
      className="text-sm px-3 py-1 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
    >
      Delete
    </button>
  </form>

  {r.hasUnread && (
    <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      new
    </span>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ===== Helpers ===== */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    closed: "bg-green-100 text-green-700",
  };

  const labels: Record<string, string> = {
    new: "New",
    in_progress: "In progress",
    rejected: "Rejected",
    closed: "Completed",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}
