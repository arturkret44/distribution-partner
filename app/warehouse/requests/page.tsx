import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { markRequestAsRead } from "./actions";

export const dynamic = "force-dynamic";

export default async function WarehouseRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {

  const params = await searchParams;
  const activeTab = params?.tab || "active";

  const { user } = await requireRole("warehouse");



  const supabase = await supabaseServer();

const { data: completedDeals } = await supabase
  .from("warehouse_requests")
  .select(`
    id,
    closed_at,
    farmer_id,
    announcements (
      product_name
    )
  `)
  .eq("warehouse_user_id", user.id)
  .eq("status", "closed")
  .order("closed_at", { ascending: false })
  .limit(5);

  // 1. Pobieramy requests bez próby joinowania profili
  const { data: requests, error } = await supabase
    .from("warehouse_requests")
    .select(
      `
      id,
      message,
      created_at,
      farmer_id,
      read_at,
      status,
      closed_at,

  storage_start_date,
  storage_end_date,
  storage_quantity,
  storage_unit,
  storage_location,
  requires_refrigeration,
  storage_notes,

      announcements (
        id,
        product_name,
        quantity,
        unit,
        quality,
        price,
        price_negotiable,
        requires_refrigeration,
        pickup_region,
        pickup_kommun,
        location,
        sell_by_date
      )
    `
    )
    .eq("warehouse_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    // Minimalny fallback UI, żeby nie wywalać całej strony


    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <h1 className="text-xl font-bold text-purple-800">
              Incoming storage requests
            </h1>

          </div>
        </header>

        <section className="max-w-4xl mx-auto px-6 py-10">

          <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
            Something went wrong while loading requests.
          </div>

          <div className="mt-6">
          </div>
        </section>
      </main>
    );
  }

  // 2. Jeśli są requesty – pobieramy profile farmerów osobno
  let requestsWithProfiles: any[] = requests || [];

  if (requests && requests.length > 0) {
    const farmerIds = requests.map((r) => r.farmer_id);

    const { data: farmerProfiles } = await supabase
      .from("profiles")
      .select("id, company_name, contact_email, phone")
      .in("id", farmerIds);

    // 3. Łączymy dane w kodzie
requestsWithProfiles = requests.map((r) => {
  const farmer = farmerProfiles?.find((p) => p.id === r.farmer_id);

  return {
    ...r,
    profile: farmer
      ? [{
          id: farmer.id,
          company_name: farmer.company_name,
          contact_email: farmer.contact_email,
          phone: farmer.phone
        }]
      : []
  };
});
}

const activeRequests = requestsWithProfiles.filter(
  (r) => r.status !== "closed" && r.status !== "rejected"
);

const completedRequests = requestsWithProfiles.filter(
  (r) => r.status === "closed"
);


  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-800">
            Incoming storage requests
          </h1>

        </div>
      </header>

    <section className="max-w-4xl mx-auto px-6 py-10">

  {/*  TABS */}
  <div className="flex gap-4 mb-6">
    <a
      href="/warehouse/requests?tab=active"
      className={`px-4 py-2 rounded-md ${
        activeTab === "active"
          ? "bg-purple-700 text-white"
          : "border text-gray-700"
      }`}
    >
      Active
    </a>

    <a
      href="/warehouse/requests?tab=completed"
      className={`px-4 py-2 rounded-md ${
        activeTab === "completed"
          ? "bg-purple-700 text-white"
          : "border text-gray-700"
      }`}
    >
      Completed
    </a>
  </div>

{activeTab === "active" && (
  activeRequests.length > 0 ? (
          <div className="space-y-4">
           {activeRequests.map((r) => (
              <div
                key={r.id}
                className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition ${
                  !r.read_at ? "border-purple-300 bg-purple-50" : ""
                }`}
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500">
                    Received: {new Date(r.created_at).toLocaleString()}
                  </div>

                  {!r.read_at && (
                    <span className="text-xs bg-purple-700 text-white px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>

                {/* ===== PRODUCT CARD ===== */}
                {r.announcements?.[0] && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-purple-800 text-base mb-2">
                      📦 {r.announcements?.[0]?.product_name}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                      <div>
                        Quantity: {r.announcements?.[0]?.quantity}{" "}
                        {r.announcements?.[0]?.unit}
                      </div>

                      <div>
                        Quality: {r.announcements?.[0]?.quality || "not specified"}
                      </div>

                      <div>
                        Location: {r.announcements?.[0]?.pickup_region} – {r.announcements?.[0]?.pickup_kommun}
                        {r.announcements?.[0]?.pickup_kommun}
                      </div>

                      <div>
                        Refrigeration:{" "}
                        {r.announcements?.[0]?.requires_refrigeration ? "Yes" : "No"}
                      </div>

                      <div>
                        Sell by:{" "}
                        {r.announcements?.[0]?.sell_by_date || "not specified"}
                      </div>

                      <div>
                        Price:{" "}
                        {r.announcements?.[0]?.price_negotiable
                          ? "Negotiable"
                          : r.announcements?.[0]?.price || "not specified"}
                      </div>
                    </div>

                    {r.announcements?.[0]?.location && (
                      <div className="text-xs text-gray-500 mt-2">
                        Exact location: {r.announcements?.[0]?.location}
                      </div>
                    )}
                  </div>
                )}

                {/* ===== MESSAGE ===== */}
                {r.message && (
                  <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700 mb-4">
                    💬 {r.message}
                  </div>
                )}

                {/* ===== FOOTER GRID ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* STATUS + OPEN */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`/warehouse/requests/${r.id}`}
                      className="px-3 py-1 text-sm bg-purple-700 text-white rounded-md hover:bg-purple-800"
                    >
                      Open conversation
                    </a>

                    {!r.read_at ? (
                      <form action={markRequestAsRead}>
                        <input type="hidden" name="request_id" value={r.id} />
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm border border-purple-700 text-purple-700 rounded-md hover:bg-purple-50"
                        >
                          Mark as read
                        </button>
                      </form>
                    ) : (
                      <div className="text-sm text-green-700 font-medium">
                        ✓ Read
                      </div>
                    )}
                  </div>

                  {/* CONTACT */}
                  <div className="bg-gray-50 border rounded-lg p-3 text-sm">
                    <div className="font-semibold text-gray-800 mb-1">
                      Contact details
                    </div>

<div>
  Company:{" "}
  <a
    href={`/profiles/${r.profile?.[0]?.id}?from=/warehouse/requests`}
    className="text-purple-700 font-semibold hover:underline"
  >
    {r.profile?.[0]?.company_name || "not provided"}
  </a>
</div>

<p className="text-xs text-gray-500 mt-1">
  Check company profile
</p>
{r.profile?.[0]?.contact_email && (
  <div>Email: {r.profile[0].contact_email}</div>
)}

{r.profile?.[0]?.phone && (
  <div>Phone: {r.profile[0].phone}</div>
)}
                  </div>
                </div>
              </div>
            ))}
</div>
  ) : (
    <div className="bg-white border rounded-xl p-6 text-center text-gray-600">
      No storage requests yet.
    </div>
  )
)}
{/* ===== COMPLETED STORAGE ===== */}
{activeTab === "completed" && (
  <>
    <h2 className="text-lg font-bold text-purple-800 mt-10">
      Completed storage
    </h2>

    {completedRequests.length === 0 ? (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-600 mt-4">
        No completed deals yet.
      </div>
    ) : (
      <div className="space-y-4 mt-4">
        {completedRequests.map((r) => (
<div
  key={r.id}
  className="bg-green-50 border border-green-200 rounded-xl p-6"
>
  <div className="text-sm text-gray-500 mb-2">
    Closed:{" "}
    {r.closed_at
      ? new Date(r.closed_at).toLocaleDateString()
      : "—"}
  </div>

  {/*  NOWE DANE */}
  <div className="text-sm text-gray-700 mt-2 space-y-1">
    <div>
      📅 {r.storage_start_date || "?"} → {r.storage_end_date || "?"}
    </div>

    <div>
      📦 {r.storage_quantity || "?"} {r.storage_unit || ""}
    </div>

    {r.requires_refrigeration && (
      <div>❄️ Requires refrigeration</div>
    )}

    {r.storage_location && (
      <div>📍 {r.storage_location}</div>
    )}
  </div>

  {/*  FARMER */}
  <div className="mt-3 text-sm text-gray-600">
    <div>
      Farmer:{" "}
<span className="font-medium">
  {r.profile?.[0]?.company_name || "Unknown"}
</span>
    </div>

{r.profile?.[0]?.contact_email && (
  <div>Email: {r.profile[0].contact_email}</div>
)}
{r.profile?.[0]?.phone && (
  <div>Phone: {r.profile[0].phone}</div>
)}
  </div>

  {/*  NOTES */}
  {r.storage_notes && (
    <div className="mt-3 text-sm text-gray-600">
      📝 {r.storage_notes}
    </div>
  )}

  <a
    href={`/warehouse/requests/${r.id}`}
    className="inline-block mt-3 text-sm text-green-700 underline"
  >
    View conversation
  </a>
</div>
        ))}
      </div>
    )}
  </>
)}
        <div className="mt-6">
        </div>
      </section>
    </main>
  );
}
