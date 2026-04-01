import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { sendTransportReply, updateTransportFinalStatus, sendTransportForm } from "./actions";

export const dynamic = "force-dynamic";

export default async function TransportConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await requireRole("transport");
  const supabase = await supabaseServer();

  const { data: request } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("id", id)
    .single();


  if (!request || request.transport_user_id !== user.id) {
    return <p style={{ padding: 40 }}>Access denied</p>;
  }

const { data: messages } = await supabase
  .from("request_messages")
  .select("*")
  .eq("request_id", id)
  .order("created_at", { ascending: true });

// Oznacz jako przeczytane wszystkie wiadomości
// które nie są od zalogowanego transportu

await supabase
  .from("request_messages")
  .update({ read_at: new Date().toISOString() })
  .eq("request_id", id)
  .neq("sender_id", user.id)
  .is("read_at", null);


  return (
    <main style={{ padding: 40 }}>
      <a href="/transport/requests" style={{ color: "#15803d" }}>
        ← Back to requests
      </a>

      <h1 style={{ fontSize: 24, fontWeight: 600, marginTop: 20 }}>
        Conversation
      </h1>
{request.form_status === "submitted" && (
  <div
    style={{
      border: "1px solid #e5e7eb",
      background: "#f0fdf4",
      padding: 16,
      borderRadius: 10,
      marginTop: 20,
    }}
  >
    <h3 style={{ fontWeight: 600, marginBottom: 10 }}>
      🚚 Transport details (submitted by farmer)
    </h3>

    <div><b>Pickup:</b> {request.pickup_location}</div>
    <div><b>Delivery:</b> {request.delivery_location}</div>

    <div style={{ marginTop: 6 }}>
      <b>Dates:</b> {request.pickup_date ? new Date(request.pickup_date).toLocaleDateString() : "—"} → {request.delivery_date}
    </div>

    <div style={{ marginTop: 6 }}>
      <b>Cargo:</b> {request.cargo_type || "—"}
    </div>

    <div>
      <b>Weight:</b> {request.cargo_weight || "—"}
    </div>

    <div>
      <b>Pallets:</b> {request.pallets_count || "—"}
    </div>

    {request.transport_notes && (
      <div style={{ marginTop: 6 }}>
        <b>Notes:</b> {request.transport_notes}
      </div>
    )}
  </div>
)}
      <div style={{ marginTop: 20 }}>
        {messages && messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 10,
                borderRadius: 6,
                background:
  m.sender_id === user.id
    ? "#e6f7ec"
    : m.read_at
    ? "#f9f9f9"
    : "#fff4cc",

              }}
            >
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(m.created_at).toLocaleString()}
              </div>

              <div style={{ marginTop: 6 }}>{m.message}</div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

{/* TRANSPORT FORM */}
<div style={{ marginTop: 30 }}>
  <div
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: 16,
    }}
  >
    <div style={{ fontWeight: 600, marginBottom: 6 }}>
      🚚 Transport form
    </div>

    {request.form_status === "pending" ? (
      <div
        style={{
          fontSize: 14,
          background: "#fff4cc",
          border: "1px solid #fde68a",
          padding: 8,
          borderRadius: 6,
        }}
      >
        ⏳ Form sent — waiting for farmer response
      </div>
    ) : request.form_status === "submitted" ? (
      <div
        style={{
          fontSize: 14,
          background: "#dcfce7",
          border: "1px solid #86efac",
          padding: 8,
          borderRadius: 6,
        }}
      >
        ✅ Form received from farmer
      </div>
    ) : (
      <form action={sendTransportForm}>
        <input type="hidden" name="request_id" value={id} />

        <button
          type="submit"
          style={{
            padding: "8px 12px",
            background: "#facc15",
            color: "black",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          Send transport form
        </button>
      </form>
    )}
  </div>
</div>

{/* REPLY FORM */}
<form action={sendTransportReply} style={{ marginTop: 20 }}>
  <input type="hidden" name="request_id" value={id} />

  <textarea
    name="message"
    required
    rows={4}
    style={{
      width: "100%",
      padding: 8,
      borderRadius: 6,
      border: "1px solid #ccc",
    }}
    placeholder="Write your reply..."
  />

  <button
    type="submit"
    style={{
      marginTop: 10,
      padding: "8px 12px",
      background: "#15803d",
      color: "white",
      borderRadius: 6,
    }}
  >
    Send reply
  </button>
</form>

<div style={{ marginTop: 20, display: "flex", gap: 10 }}>
  <form action={updateTransportFinalStatus}>
    <input type="hidden" name="request_id" value={id} />
    <input type="hidden" name="status" value="rejected" />
    <button
      type="submit"
      style={{
        padding: "8px 12px",
        background: "#dc2626",
        color: "white",
        borderRadius: 6,
      }}
    >
      Reject
    </button>
  </form>

  <form action={updateTransportFinalStatus}>
    <input type="hidden" name="request_id" value={id} />
    <input type="hidden" name="status" value="closed" />
    <button
      type="submit"
      style={{
        padding: "8px 12px",
        background: "#16a34a",
        color: "white",
        borderRadius: 6,
      }}
    >
      Mark as completed
    </button>
  </form>
</div>

</main>
);
}
