import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import BuyerPipelineChart from "@/components/charts/BuyerPipelineChart";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BuyerDashboard() {
  const { user } = await requireRole("buyer");
  const supabase = await supabaseServer();
// ===== TOP FARMERS =====
const { data: topFarmers } = await supabase.rpc("get_top_farmers");
  // ===== PIPELINE =====
  const { data: interests } = await supabase
    .from("interests")
    .select("status")
    .eq("buyer_id", user.id);

  const statusCount = {
    pending: 0,
    contacted: 0,
    agreed: 0,
    rejected: 0,
    closed: 0,
  };

  interests?.forEach((i) => {
    if (statusCount[i.status as keyof typeof statusCount] !== undefined) {
      statusCount[i.status as keyof typeof statusCount]++;
    }
  });

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
          Manage your deals and discover new offers
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/*  PIPELINE */}
<div className="bg-white p-5 rounded-xl shadow-sm space-y-6">

  {/*  CHART */}
  <BuyerPipelineChart status={statusCount} />

  {/*  TOP FARMERS */}

  <div>
    <h3 className="text-sm font-medium text-gray-700 mb-3">
      ⭐ Top farmers
    </h3>
<div className="space-y-2 text-sm text-gray-600">
  {topFarmers?.map((f: any) => (
    <div key={f.farmer_id} className="flex justify-between">
      
      <span className="truncate">
        {f.company_name || "Unnamed farm"}
      </span>

      <span className="text-yellow-600 flex items-center gap-1">
        ⭐ {f.avg_rating}
        <span className="text-gray-400 text-xs">
          ({f.reviews_count})
        </span>
      </span>

    </div>
  ))}

  {(!topFarmers || topFarmers.length === 0) && (
    <p className="text-xs text-gray-400">
      No rated farmers yet
    </p>
  )}
</div>

  </div>

  {/*  TRACKING */}
  <div className="opacity-60">
    <h3 className="text-sm font-medium text-gray-700 mb-2">
      🚚 Order tracking
    </h3>

    <p className="text-xs text-gray-500">
      Coming soon – track deliveries in real time
    </p>
  </div>

</div>
        {/*  LATEST */}
<div className="bg-white p-5 rounded-xl shadow-sm">
  <h3 className="text-sm font-medium mb-4">
    Latest announcements
  </h3>

  <div className="divide-y">

    {latest?.map((a) => (
<Link
  key={a.id}
  href={`/announcements/${a.id}?from=/buyer/browse`}
  className="block py-4 first:pt-0 last:pb-0 hover:bg-gray-50 px-2 rounded-lg transition"
>
        <div className="flex justify-between items-start gap-4">

          {/* LEFT */}
          <div>
            <p className="font-medium text-gray-800">
              {a.product_name}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {a.pickup_region || "Unknown location"}
            </p>

            {/*  EXTRA INFO */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
              
              <span>
                📦 {a.quantity ?? "—"} {a.unit ?? ""}
              </span>

              <span>
                💰 {a.price_negotiable
                  ? "Negotiable"
                  : a.price
                  ? "Fixed price"
                  : "—"}
              </span>

              <span>
                📦 Bulk
              </span>

            </div>
          </div>

          {/* RIGHT */}
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-green-700">
              {a.price
                ? `${a.price} SEK`
                : a.price_negotiable
                ? "Negotiable"
                : "—"}
            </p>

            {a.type === "surplus" && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                SURPLUS
              </span>
            )}
          </div>

        </div>
</Link>
    ))}

  </div>
</div>

        {/*  FINANCING */}
        <ActionCard
          title="Financing"
          description="Access funding solutions"
          href="https://www.almi.se/"
          icon="💰"
        />

        {/*  NEWS */}
        <ActionCard
          title="Market news"
          description="Latest agriculture insights"
          href="https://www.lantbruk.com/"
          icon="📰"
        />

      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
  disabled,
}: any) {
  return (
<a
  href={disabled ? "#" : href}
  target="_blank"
  rel="noopener noreferrer"
      className={`rounded-xl p-5 bg-white border shadow-sm transition
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
    >
      <div className="text-xl">{icon}</div>
      <h3 className="font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>

      {disabled && (
        <p className="text-xs text-gray-400 mt-2">
          Coming soon
        </p>
      )}
    </a>
  );
}
