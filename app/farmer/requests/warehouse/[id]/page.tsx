import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { sendReply, submitStorageForm } from "./reply";
import ScrollToBottom from "@/components/ScrollToBottom";
import { QUANTITY_UNITS, PACKAGING_TYPES } from "@/lib/options";

export const dynamic = "force-dynamic";

export default async function WarehouseThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  // Pobierz request
  const { data: request } = await supabase
    .from("warehouse_requests")
    .select("*")
    .eq("id", id)
    .single();

const { data: warehouseProfile } = await supabase
  .from("warehouse_profiles")
  .select("company_name")
  .eq("user_id", request.warehouse_user_id)
  .single();


  if (!request || request.farmer_id !== user.id) {
    return <p className="p-6 text-red-600">Access denied</p>;
  }

  // Pobierz wiadomości
  const { data: messages } = await supabase
    .from("request_messages")
    .select("*")
    .eq("request_type", "warehouse")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

// oznacz jako przeczytane (tylko wiadomości od drugiej strony)
await supabase
  .from("request_messages")
  .update({ read_at: new Date().toISOString() })
  .eq("request_type", "warehouse")
  .eq("request_id", id)
  .neq("sender_id", user.id)
  .is("read_at", null);


return (
  <main className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-3xl mx-auto">

      <a
        href="/farmer/requests"
        className="inline-block mb-6 text-sm text-green-700 hover:underline"
      >
        ← Back to requests
      </a>

      <div className="flex items-center justify-between mb-6">
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold">
      🏬 {warehouseProfile?.company_name || "Warehouse"}
    </h1>
  </div>
</div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            request.status === "new"
              ? "bg-blue-100 text-blue-700"
              : request.status === "in_progress"
              ? "bg-yellow-100 text-yellow-700"
              : request.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {request.status}
        </span>
      </div>

<div className={`grid gap-6 ${
  request.form_status === "pending"
    ? "md:grid-cols-2"
    : "grid-cols-1"
}`}>
{request.form_status === "pending" && (
  <div className="bg-white rounded-xl border p-5 shadow-sm h-fit">
    <form
    action={submitStorageForm}
    className="mb-6 p-4 border rounded-lg bg-gray-50"
  >
    <h3 className="font-semibold mb-3">
      📄 Storage form from warehouse
    </h3>

    <input type="hidden" name="request_id" value={id} />

    {/* START DATE */}
    <div className="mb-3">
      <label className="block text-sm">Start date:</label>
      <input
        type="date"
        name="start_date"
        required
        min={new Date().toISOString().split("T")[0]}
        className="border p-2 rounded w-full"
      />
    </div>

    {/* END DATE */}
    <div className="mb-3">
      <label className="block text-sm">End date:</label>
      <input
        type="date"
        name="end_date"
        required
        min={new Date().toISOString().split("T")[0]}
        className="border p-2 rounded w-full"
      />
    </div>

    {/* QUANTITY */}
    <div className="mb-3">
      <label className="block text-sm">Quantity:</label>
      <input
        type="number"
        name="quantity"
        required
        min="0"
        step="0.01"
        className="border p-2 rounded w-full"
      />
    </div>

    {/* UNIT */}
    <div className="mb-3">
      <label className="block text-sm">Unit:</label>
      <select
        name="storage_unit"
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select unit</option>
        {QUANTITY_UNITS.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </select>
    </div>

    {/* PACKAGING */}
    <div className="mb-3">
      <label className="block text-sm">Packaging type:</label>
      <select
        name="packaging_type"
        className="border p-2 rounded w-full"
      >
        <option value="">Select packaging</option>
        {PACKAGING_TYPES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>

    {/* STORAGE TYPE */}
    <div className="mb-3">
      <label className="block text-sm">Storage type:</label>
      <select
        name="storage_type"
        className="border p-2 rounded w-full"
      >
        <option value="">Select storage type</option>
        <option value="dry">Dry</option>
        <option value="refrigerated">Refrigerated</option>
        <option value="frozen">Frozen</option>
      </select>
    </div>

    {/* NOTES */}
    <div className="mb-3">
      <label className="block text-sm">Notes:</label>
      <textarea
        name="notes"
        className="border p-2 rounded w-full"
      />
    </div>

    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Submit form
    </button>
  </form>
  </div>
)}
<div className="bg-white rounded-xl border p-5 shadow-sm flex flex-col max-h-[600px]">
  <div className="flex-1 overflow-y-auto space-y-3">
{messages?.map((m) => {
  const isMine = m.sender_id === user.id;
  const isUnread = !m.read_at && !isMine;

  return (
    <div
      key={m.id}
      className={`p-4 rounded-lg max-w-[75%] ${
        isMine
          ? "ml-auto bg-green-100 text-green-900"
          : isUnread
          ? "bg-gray-100 border border-green-300 text-gray-900"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {isUnread && (
        <div className="text-[10px] font-semibold text-green-700 mb-1">
          NEW MESSAGE
        </div>
      )}

      <p className="text-sm">{m.message}</p>

      <p className="text-xs text-gray-500 mt-2">
        {new Date(m.created_at).toLocaleString()}
      </p>
    </div>
  );
})}

        {(!messages || messages.length === 0) && (
          <p className="text-gray-500">No messages yet.</p>
        )}
<ScrollToBottom />
  </div>
</div>
      </div>

      {/* Reply */}
<form action={sendReply} className="mt-6 space-y-4 border-t pt-4">
        <input type="hidden" name="request_type" value="warehouse" />
        <input type="hidden" name="request_id" value={id} />

        <textarea
          name="message"
          required
          rows={4}
          placeholder="Write your reply..."
          className="w-full border rounded-md p-3"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Send reply
        </button>
      </form>

    </div>
  </main>
);

}
