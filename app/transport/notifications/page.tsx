import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import { markAllAsRead } from "./actions";

export const dynamic = "force-dynamic";

export default async function TransportNotificationsPage() {
  const { user } = await requireRole("transport");

  const supabase = await supabaseServer();

  const { data: notifications } = await supabase
    .from("transport_notifications")
    .select("id, created_at, read_at, request_id")
    .eq("transport_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main style={{ padding: 40 }}>
      <a href="/transport" style={{ color: "#1d4ed8" }}>
        ← Back to dashboard
      </a>

      <h1 style={{ marginTop: 20 }}>Notifications</h1>

      <form action={markAllAsRead} style={{ marginTop: 10 }}>
        <button
          style={{
            padding: "6px 10px",
            background: "#1d4ed8",
            color: "white",
            borderRadius: 6,
          }}
        >
          Mark all as read
        </button>
      </form>

      <ul style={{ marginTop: 20 }}>
        {notifications?.map((n) => (
          <li
            key={n.id}
            style={{
              padding: 12,
              marginBottom: 10,
              border: "1px solid #ddd",
              background: n.read_at ? "#f3f4f6" : "white",
            }}
          >
            <p>New request from a farmer</p>

            <small>
              {new Date(n.created_at).toLocaleString()}
            </small>

            <div style={{ marginTop: 6 }}>
              <a
                href="/transport/requests"
                style={{ color: "#1d4ed8" }}
              >
                Open requests →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
