import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WarehouseDashboard() {
  const { user } = await requireRole("warehouse");
  const supabase = await supabaseServer();

  // ===== LATEST ANNOUNCEMENTS =====
  const { data: latest } = await supabase
    .from("announcements")
    .select(`
      id,
      product_name,
      pickup_region,
      type,
      price,
      price_negotiable,
      quantity,
      unit
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage storage opportunities and discover new products
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {/* 📰 NEWS */}
        <ActionCard
          title="Warehouse & logistics news"
          description="Latest insights for storage and logistics businesses"
          href="https://www.dagenslogistik.se/"
          icon="📰"
        />

        {/* 💰 FINANCING */}
        <ActionCard
          title="Funding & support"
          description="Financial support for warehouse companies"
          href="https://www.verksamt.se/"
          icon="💰"
        />

      </div>
    </div>
  );
}

/* ===== COMPONENT ===== */

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-2xl p-5 bg-white/60 backdrop-blur-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition hover:scale-[1.02]"
    >
      <p className="text-xs text-gray-400">{title}</p>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-xl">{icon}</span>
        <p className="text-lg font-semibold">{title}</p>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {description}
      </p>
    </a>
  );
}
