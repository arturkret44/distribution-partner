"use client";

import { useState } from "react";

export default function TabsSection({
  inventory,
  buyers,
  closed,
  newCount,
}: {
  inventory: React.ReactNode;
  buyers: React.ReactNode;
  closed: React.ReactNode;
  newCount: number;
})
{
const [tab, setTab] = useState<"inventory" | "buyers" | "closed">("inventory");
  return (
    <div>
      {/* TABS */}
      <div style={tabsWrapper}>
        <button
          onClick={() => setTab("inventory")}
          style={{
            ...tabButton,
            ...(tab === "inventory" ? activeTab : {}),
          }}
        >
          Inventory
        </button>

<button
  onClick={() => setTab("buyers")}
  style={{
    ...tabButton,
    ...(tab === "buyers" ? activeTab : {}),
    display: "flex",
    alignItems: "center",
    gap: 6,
  }}
>
  Interested buyers

  {newCount > 0 && (
    <span
      style={{
        background: "#dc2626",
        color: "white",
        fontSize: 11,
        padding: "2px 7px",
        borderRadius: 999,
        fontWeight: 600,
      }}
    >
      {newCount}
    </span>
  )}
</button>      
<button
onClick={() => setTab("closed")}
style={{
...tabButton,
...(tab === "closed" ? activeTab : {}),
}}
>
Closed deals
</button>
</div>
      {/* CONTENT */}
      <div style={{ marginTop: 20 }}>
{tab === "inventory" && inventory}
{tab === "buyers" && buyers}
{tab === "closed" && closed}
      </div>
    </div>
  );
}

const tabsWrapper: React.CSSProperties = {
  display: "flex",
  gap: 10,
  borderBottom: "2px solid #e5e7eb",
  marginBottom: 10,
  alignItems: "flex-end",
  flexWrap: "nowrap",
};
const tabButton: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "8px 8px 0 0",

  // zamiast border: "none"
  borderTop: "1px solid transparent",
  borderLeft: "1px solid transparent",
  borderRight: "1px solid transparent",
  borderBottom: "none",

  background: "transparent",
  cursor: "pointer",
  fontWeight: 500,
  color: "#475569",
  whiteSpace: "nowrap",
};
const activeTab: React.CSSProperties = {
  background: "white",
  borderBottom: "2px solid white",
  borderTop: "1px solid #e5e7eb",
  borderLeft: "1px solid #e5e7eb",
  borderRight: "1px solid #e5e7eb",
  color: "#166534",
  fontWeight: 600,
};
