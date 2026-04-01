import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TransportDashboard() {
  const { user } = await requireRole("transport");
  const supabase = await supabaseServer();

  // ===== REQUESTS =====
  const { data: transportRequests } = await supabase
    .from("transport_requests")
    .select("id")
    .eq("transport_user_id", user.id);

  const transportRequestIds =
    transportRequests?.map((r) => r.id) ?? [];

  let unreadTransportMessagesCount = 0;

  if (transportRequestIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "transport")
      .in("request_id", transportRequestIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadTransportMessagesCount = count ?? 0;
  }

  // ===== COMPLETED =====
  const { data: completedRequests } = await supabase
    .from("transport_requests")
    .select("id")
    .eq("transport_user_id", user.id)
    .eq("status", "closed");

  const completedCount = completedRequests?.length ?? 0;

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your transport operations and discover opportunities
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== INFO CARDS ===== */}


        <ActionCard
          title="Transport news"
          description="Latest logistics & transport news in Sweden"
          href="https://www.transportnytt.se/"
          icon="📰"
        />

        <ActionCard
          title="Funding & support"
          description="Financial support for transport companies"
          href="https://www.verksamt.se/"
          icon="💰"
        />

<div className="rounded-2xl border bg-white shadow-sm p-5">

  <p className="text-xs text-gray-400">Fuel prices</p>

  <div className="flex items-center gap-2 mt-1">
    <span className="text-xl">⛽</span>
    <p className="text-lg font-semibold">Sweden fuel prices</p>
  </div>

  <div className="mt-4 space-y-3 text-sm text-gray-700">

    <div className="flex justify-between">
      <span>Diesel</span>
      <span className="font-semibold">~18.4 SEK/L</span>
    </div>

    <div className="flex justify-between">
      <span>Petrol</span>
      <span className="font-semibold">~19.1 SEK/L</span>
    </div>

    {/* 🔥 NOWE */}
    <div className="flex justify-between">
      <span>Trend</span>
      <span className="text-green-600">↓ -0.2 SEK</span>
    </div>

    <div className="flex justify-between">
      <span>Region</span>
      <span className="text-gray-500">Sweden</span>
    </div>

    <div className="flex justify-between">
      <span>Updated</span>
      <span className="text-gray-500">recently</span>
    </div>

  </div>

  <a
    href="https://www.globalpetrolprices.com/Sweden/diesel_prices/"
    target="_blank"
    className="text-xs text-blue-600 mt-4 inline-block hover:underline"
  >
    View full data →
  </a>

</div>
        {/* ===== MAP ===== */}
        <div className="rounded-2xl overflow-hidden border bg-white shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=Sweden&t=&z=5&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[300px]"
            loading="lazy"
          />
        </div>

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
  highlight,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`rounded-2xl p-5 bg-white/60 backdrop-blur-xl border border-gray-200 hover:border-gray-300
      shadow-sm hover:shadow-md transition hover:scale-[1.02]
      ${highlight ? "border-blue-400 ring-2 ring-blue-200" : ""}`}
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
