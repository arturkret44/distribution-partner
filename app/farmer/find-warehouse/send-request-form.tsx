"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { sendWarehouseRequest } from "./actions";

export default function SendWarehouseRequestForm({
  warehouseId,
}: {
  warehouseId: string;
}) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnnouncements() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("announcements")
        .select("id, product_name, quantity, pickup_region, pickup_kommun")
        .eq("farmer_id", user.id);

      setAnnouncements(data || []);
      setLoading(false);
    }

    loadAnnouncements();
  }, []);

  return (
    <form action={sendWarehouseRequest}>
      <input type="hidden" name="warehouse_user_id" value={warehouseId} />

      <div style={{ marginTop: 8 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Select announcement
        </label>

        {loading ? (
          <p style={{ fontSize: 14, color: "#666" }}>Loading...</p>
        ) : (
          <select
            name="announcement_id"
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- choose your product --</option>

            {announcements.map((a) => (
              <option key={a.id} value={a.id}>
                {a.product_name} – {a.quantity} – {a.pickup_region} ({a.pickup_kommun})
              </option>
            ))}
          </select>
        )}
      </div>

      <textarea
        name="message"
        required
        placeholder="Describe what storage you need..."
        style={{
          width: "100%",
          padding: 8,
          marginTop: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
        rows={3}
      />

      <button
        type="submit"
        style={{
          marginTop: 8,
          padding: "8px 12px",
          background: "#15803d",
          color: "white",
          borderRadius: 6,
        }}
      >
        Send request
      </button>
    </form>
  );
}
