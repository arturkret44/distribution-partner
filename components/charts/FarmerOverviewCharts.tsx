"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FarmerOverviewCharts({
  status,
  products,
}: {
  status: {
    pending: number;
    contacted: number;
    agreed: number;
    closed: number;
    rejected: number;
  };
  products: {
    name: string;
    total: number;
    sold: number;
  }[];
}) {
  const statusData = [
    { name: "Pending", value: status.pending },
    { name: "Contacted", value: status.contacted },
    { name: "Agreed", value: status.agreed },
    { name: "Rejected", value: status.rejected },
    { name: "Closed", value: status.closed },
  ];

  const COLORS = [
    "#f59e0b", // pending (żółty)
    "#3b82f6", // contacted (niebieski)
    "#22c55e", // agreed (zielony)
    "#ef4444", // rejected (czerwony 🔥)
    "#6b7280", // closed (szary)
  ];

  return (
    <div
      className="relative rounded-2xl p-6
      bg-white/60 backdrop-blur-xl
      border border-gray-200
      border-l-4 border-blue-500
      shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-sm font-medium text-blue-700 mb-4">
        Deal pipeline
      </h3>

      <div className="h-[260px] flex">
        
        {/* 📊 CHART */}
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                cx="50%"
                cy="50%"
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
<Tooltip
  contentStyle={{
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  }}
  labelStyle={{ color: "#374151", fontWeight: 500 }}
  itemStyle={{ color: "#374151" }}
/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📋 LEGEND */}
        <div className="w-1/3 flex flex-col justify-center gap-2 pl-4">
          {statusData.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-gray-700">{item.name}</span>
              <span className="ml-auto text-gray-400">
                {item.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
