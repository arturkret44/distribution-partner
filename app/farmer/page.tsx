import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";
import SalesChart from "@/components/charts/SalesChart";
import FarmerOverviewCharts from "@/components/charts/FarmerOverviewCharts";
import WeatherWidget from "@/components/WeatherWidget";
export const dynamic = "force-dynamic";

export default async function FarmerDashboard() {
  const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  // ===== DATA =====
  const { data: allAnnouncements } = await supabase
    .from("announcements")
    .select("id, quantity, quantity_available")
    .eq("farmer_id", user.id);

  const totalQuantity =
    allAnnouncements?.reduce((sum, a) => sum + (a.quantity || 0), 0) ?? 0;

  const availableQuantity =
    allAnnouncements?.reduce(
      (sum, a) => sum + (a.quantity_available || 0),
      0
    ) ?? 0;

  const soldQuantity = totalQuantity - availableQuantity;

  const { count: newInterestsCount } = await supabase
    .from("interests")
    .select(
      `id, announcements!inner ( farmer_id )`,
      { count: "exact", head: true }
    )
    .eq("announcements.farmer_id", user.id)
    .eq("status", "pending");

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id")
    .eq("farmer_id", user.id);

  const totalAnnouncements = announcements?.length ?? 0;

  // ===== REQUESTS =====
  const { data: transport } = await supabase
    .from("transport_requests")
    .select("id")
    .eq("farmer_id", user.id)
    .eq("archived_by_farmer", false);

  const { data: warehouse } = await supabase
    .from("warehouse_requests")
    .select("id")
    .eq("farmer_id", user.id)
    .eq("archived_by_farmer", false);

  const transportIds = transport?.map(r => r.id) ?? [];
  const warehouseIds = warehouse?.map(r => r.id) ?? [];

  let unreadFarmerMessagesCount = 0;

  if (transportIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "transport")
      .in("request_id", transportIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadFarmerMessagesCount += count ?? 0;
  }

  if (warehouseIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "warehouse")
      .in("request_id", warehouseIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadFarmerMessagesCount += count ?? 0;
  }

// ===== PIPELINE STATUS =====
const { data: interests } = await supabase
  .from("interests")
  .select("status, requested_quantity");
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
// ===== PRODUCTS =====
const { data: productData } = await supabase
  .from("announcements")
  .select("product_name, quantity, quantity_available")
  .eq("farmer_id", user.id);

const productChartData =
  productData?.map((p) => ({
    name: p.product_name,
    value: p.quantity,
  })) ?? [];
  return (
    <div className="relative space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Here’s what’s happening with your supply today
          </p>

          <div className="flex gap-3 mt-3">
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Active
            </span>

            <span className="text-xs text-gray-400">
              {totalAnnouncements} listings • {newInterestsCount ?? 0} new interests
            </span>
          </div>
        </div>

        <a
          href="/announcements/new"
          className="px-5 py-2 rounded-lg bg-green-600 text-white"
        >
          + Create announcement
        </a>
      </div>

      {/* GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

  <div className="bg-white p-5 rounded-xl shadow-sm h-full">
    <SalesChart data={productChartData} />
  </div>

  <div className="bg-white p-5 rounded-xl shadow-sm h-full">
    <FarmerOverviewCharts
      status={statusCount}
      products={productChartData}
    />
  </div>
<ActionCard
  title="Farming Support"
  description="Subsidies and EU funding programs for farmers"
  href="https://jordbruksverket.se/stod"
  icon="💰"
  color="border-gray-300"
/>
<ActionCard
  title="Farmer Info"
  description="Official agriculture resources"
  href="https://jordbruksverket.se/"
  icon="🇸🇪"
  color="border-gray-300"
/>

<ActionCard
  title="Product Market"
  description="Check prices and commodity trends"
  href="https://www.tradingeconomics.com/commodities"
  icon="📈"
  color="border-gray-300"
/>

<WeatherWidget />
      </div>

    </div>
  );
}

/* ===== COMPONENT ===== */

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
function ActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-2xl p-5 bg-white/60 backdrop-blur-xl border border-gray-200 hover:border-gray-300
      border-l-4 ${color} shadow-sm hover:shadow-md transition hover:scale-[1.02]`}
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
