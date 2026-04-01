"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BuyerPipelineChart({
  status,
}: {
  status: {
    pending: number;
    contacted: number;
    agreed: number;
    rejected: number;
    closed: number;
  };
}) {
  const data = [
    { name: "Pending", value: status.pending },
    { name: "Contacted", value: status.contacted },
    { name: "Agreed", value: status.agreed },
    { name: "Rejected", value: status.rejected },
    { name: "Closed", value: status.closed },
  ];

  const COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
    "#6b7280",
  ];

  return (
    <div className="rounded-2xl p-6 bg-white/60 backdrop-blur-xl border border-gray-200 border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition">
      <h3 className="text-sm font-medium text-yellow-700 mb-4">
        Deal pipeline
      </h3>

      <div className="h-[260px] flex">
        <div className="w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/3 flex flex-col justify-center gap-2 pl-4">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span>{item.name}</span>
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
