"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  // 🔥 1. SORT + TOP 5
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);

  const otherValue = rest.reduce((sum, i) => sum + i.value, 0);

  const finalData =
    otherValue > 0
      ? [...top, { name: "Other", value: otherValue }]
      : top;

  // 🎨 więcej kolorów (bo może być więcej segmentów)
  const COLORS = [
    "#16a34a",
    "#22c55e",
    "#4ade80",
    "#86efac",
    "#bbf7d0",
    "#15803d",
  ];

  const total = finalData.reduce((sum, i) => sum + i.value, 0);

  return (
    <div
      className="relative rounded-2xl p-6
      bg-white/60 backdrop-blur-xl
      border border-gray-200
      border-l-4 border-green-500
      shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-sm font-medium text-green-700 mb-4">
        Products overview
      </h3>

      <div className="h-[260px] flex">
        
        {/* 📊 CHART */}
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={finalData}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                cx="50%"
                cy="50%"
              >
                {finalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
        <div className="w-1/3 flex flex-col justify-center gap-2 pl-4 max-h-[260px] overflow-y-auto">
          {finalData.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-gray-700">{item.name}</span>

              {/* 🔥 % zamiast surowej liczby */}
              <span className="ml-auto text-gray-400">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
