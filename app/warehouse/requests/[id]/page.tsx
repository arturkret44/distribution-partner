import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { sendWarehouseReply, updateWarehouseFinalStatus, sendStorageForm } from "./actions";

export const dynamic = "force-dynamic";

export default async function WarehouseConversationPage({

  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireRole("warehouse");
  const supabase = await supabaseServer();

  const { data: request } = await supabase
.from("warehouse_requests")

    .select("*")
    .eq("id", id)
    .single();

  if (!request || request.warehouse_user_id !== user.id) {
    return <p style={{ padding: 40 }}>Access denied</p>;
  }

  const { data: messages } = await supabase
    .from("request_messages")
    .select("*")
.eq("request_id", id)
.eq("request_type", "warehouse")

    .order("created_at", { ascending: true });

// Oznacz jako przeczytane wszystkie wiadomości
// które nie są od zalogowanego transportu

await supabase
  .from("request_messages")
  .update({ read_at: new Date().toISOString() })
  .eq("request_id", id)
  .eq("request_type", "warehouse")
  .neq("sender_id", user.id)
  .is("read_at", null);


  return (
<main className="min-h-screen bg-purple-50 p-8">
  <div className="max-w-3xl mx-auto">
<a href="/warehouse/requests" className="text-purple-700 hover:underline">
        ← Back to requests
      </a>

<h1 className="text-2xl font-bold mt-4 text-purple-800">
        Conversation
      </h1>
{request.archived_by_farmer && (
<div className="border border-purple-200 bg-purple-50 p-5 rounded-xl mb-6">
    This conversation was closed by the farmer.
  </div>
)}
{request.form_status === "submitted" && (
<div className="border border-purple-200 bg-purple-50 p-5 rounded-xl mb-6">
<h3 className="font-semibold mb-3 text-purple-800">
      📄 Storage details (submitted by farmer)
    </h3>

    <div><b>Start date:</b> {request.storage_start_date}</div>
    <div><b>End date:</b> {request.storage_end_date}</div>

    <div>
      <b>Quantity:</b> {request.storage_quantity} {request.storage_unit || ""}
    </div>

    {/* 🔥 NOWE */}
    <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {request.packaging_type && (
        <span
          style={{
            fontSize: 12,
            padding: "2px 6px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 4,
          }}
        >
          📦 {request.packaging_type}
        </span>
      )}

      {request.storage_type && (
        <span
          style={{
            fontSize: 12,
            padding: "2px 6px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 4,
          }}
        >
          🏬 {request.storage_type}
        </span>
      )}
    </div>

    {request.requires_refrigeration && (
      <div style={{ marginTop: 6 }}>
        ❄️ Requires refrigeration
      </div>
    )}

    <div style={{ marginTop: 6 }}>
      <b>Notes:</b> {request.storage_notes || "—"}
    </div>
  </div>
)}
<div className="mt-6 space-y-3">
        {messages && messages.length > 0 ? (
          messages.map((m) => (
<div
  key={m.id}
  className={`p-4 rounded-lg max-w-[75%] ${
    m.sender_id === user.id
      ? "ml-auto bg-purple-100 text-purple-900"
      : !m.read_at
      ? "bg-yellow-50 border border-yellow-200"
      : "bg-gray-100"
  }`}
>
  <div className="text-xs text-gray-500">
    {new Date(m.created_at).toLocaleString()}
  </div>

  <div className="mt-1 text-sm">{m.message}</div>
</div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

{request.archived_by_farmer ? (
  <div
    style={{
      marginTop: 20,
      padding: 12,
      borderRadius: 6,
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      color: "#6b7280",
      fontSize: 14,
    }}
  >
    You can no longer reply in this conversation.
  </div>
) : (
  <form action={sendWarehouseReply} style={{ marginTop: 20 }}>

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
  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
>
          Send reply
        </button>
      </form>
)}
{!request.archived_by_farmer && (
<div className="mt-6">
<div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm">
    {/* 📦 STORAGE FORM */}
    <div>
      <div className="font-semibold text-purple-800 mb-1">
        📦 Storage form
      </div>

      {request.form_status === "pending" ? (
        <div className="text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 px-3 py-2 rounded-md">
          ⏳ Form sent — waiting for farmer response
        </div>
      ) : request.form_status === "submitted" ? (
        <div className="text-sm text-green-800 bg-green-100 border border-green-300 px-3 py-2 rounded-md">
          ✅ Form received from farmer
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <form action={sendStorageForm}>
            <input type="hidden" name="request_id" value={id} />

            <button
              type="submit"
className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition font-medium"
            >
              Send storage form
            </button>
          </form>

          <div className="text-xs text-gray-500">
            Ask farmer for final storage details (dates, quantity, packaging).
          </div>
        </div>
      )}
    </div>

    {/* 🔴 REJECT */}
    <div>
      <div className="font-semibold text-red-700 mb-1">
        Reject request
      </div>

      <div className="flex items-center gap-3">
        <form action={updateWarehouseFinalStatus}>
          <input type="hidden" name="request_id" value={id} />
          <input type="hidden" name="status" value="rejected" />

          <button
            type="submit"
className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition font-medium shadow-sm active:scale-95"
          >
            Reject
          </button>
        </form>

        <div className="text-xs text-gray-500">
          Decline this storage request and close the conversation.
        </div>
      </div>
    </div>

    {/* 🟢 COMPLETE */}
    <div>
      <div className="font-semibold text-green-700 mb-1">
        Mark as completed
      </div>

      <div className="flex items-center gap-3">
        <form action={updateWarehouseFinalStatus}>
          <input type="hidden" name="request_id" value={id} />
          <input type="hidden" name="status" value="closed" />

          <button
            type="submit"
className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition font-medium shadow-sm active:scale-95"
          >
            Complete
          </button>
        </form>

        <div className="text-xs text-gray-500">
          Confirm storage deal is finalized and successfully completed.
        </div>
      </div>
    </div>

   </div> 
  </div>
)}

  </div>
</main>
  );
}
