import { supabaseServer } from "@/lib/supabase/server";
import { requireApprovedUser } from "@/lib/guards";

export const dynamic = "force-dynamic";

export default async function FarmerAnnouncementsPage() {
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select(`
      id,
      product_name,
      quantity,
      unit,
      status,
      type,
      created_at
    `)
    .eq("farmer_id", user.id)
    .order("type", { ascending: false })
    .order("created_at", { ascending: false });

const { data: transportInterests } = await supabase
  .from("transport_interests")
  .select(`
    announcement_id,
    profiles (
      id,
      company_name
    )
  `);

const transportMap = (transportInterests || []).reduce((acc: any, t: any) => {
  if (!acc[t.announcement_id]) {
    acc[t.announcement_id] = [];
  }

  acc[t.announcement_id].push(t.profiles);

  return acc;
}, {});

const { data: warehouseInterests } = await supabase
  .from("warehouse_interests")
  .select(`
    announcement_id,
    profiles (
      id,
      company_name
    )
  `);

const warehouseMap = (warehouseInterests || []).reduce((acc: any, w: any) => {
  if (!acc[w.announcement_id]) {
    acc[w.announcement_id] = [];
  }

  acc[w.announcement_id].push(w.profiles);

  return acc;
}, {});

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My announcements
          </h1>
          <p className="text-sm text-gray-500">
            Manage your product offers
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href="/announcements/new"
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            + Create announcement
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border">
        {error && (
          <p className="p-6 text-red-600">
            {error.message}
          </p>
        )}

        {!announcements || announcements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven’t created any announcements yet.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-left px-6 py-3">Quantity</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Created</th>
                <th className="text-left px-6 py-3">Transport offers</th>
                <th className="text-left px-6 py-3">Storage offers</th>
                <th className="text-left px-6 py-3">Images</th>

              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
<tr
  key={a.id}
  className={`border-t transition ${
    a.type === "surplus"
      ? "bg-orange-50 hover:bg-orange-100"
      : "hover:bg-gray-50"
  }`}
>

<td className="px-6 py-4 font-medium">
  <a
    href={`/announcements/${a.id}`}
    className="text-green-700 hover:underline"
  >
    {a.product_name}
  </a>
</td>

<td className="px-6 py-4 text-gray-600">
  {a.quantity} {a.unit}
</td>

{/* NEW: Type column */}
<td className="px-6 py-4">
  {a.type === "surplus" ? (
    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
      SURPLUS
    </span>
  ) : (
    <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
      Regular
    </span>
  )}
</td>

<td className="px-6 py-4">
  <StatusBadge status={a.status} />
</td>
<td className="px-6 py-4 text-gray-500 text-sm">
  {new Date(a.created_at).toLocaleDateString()}
</td>

<td>
  {transportMap[a.id]?.length > 0 ? (
    <>
      {transportMap[a.id].slice(0, 2).map((t: any) => (
        <a
          key={t.id}
          href={`/profiles/${t.id}`}
          style={{ display: "block", color: "#1d4ed8" }}
        >
          {t.company_name}
        </a>
      ))}

      {transportMap[a.id].length > 2 && (
        <span style={{ fontSize: 12, color: "#64748b" }}>
          +{transportMap[a.id].length - 2} more
        </span>
      )}
    </>
  ) : (
    <span style={{ color: "#94a3b8" }}>—</span>
  )}
</td>
<td>
  {warehouseMap[a.id]?.length > 0 ? (
    <>
      {warehouseMap[a.id].slice(0, 2).map((w: any) => (
        <a
          key={w.id}
          href={`/profiles/${w.id}`}
          style={{ display: "block", color: "#7c3aed" }}
        >
          {w.company_name}
        </a>
      ))}

      {warehouseMap[a.id].length > 2 && (
        <span style={{ fontSize: 12, color: "#64748b" }}>
          +{warehouseMap[a.id].length - 2} more
        </span>
      )}
    </>
  ) : (
    <span style={{ color: "#94a3b8" }}>—</span>
  )}
</td>
<td className="px-6 py-4 flex gap-2 flex-wrap">
  <a
    href={`/announcements/${a.id}/images`}
    className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition"
  >
    Manage images
  </a>
  <a
    href={`/announcements/${a.id}/edit`}
    className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    Edit announcement
  </a>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

/* ---------- helpers ---------- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-200 text-gray-700",
    published: "bg-green-100 text-green-700",
    closed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
