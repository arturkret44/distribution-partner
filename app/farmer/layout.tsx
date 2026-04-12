import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import SidebarItem from "@/components/SidebarItem";
import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import Image from "next/image";
export default async function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("farmer");
  const supabase = await supabaseServer();

  // ===== NEW INTERESTS =====
  const { count: newInterestsCount } = await supabase
    .from("interests")
    .select(
      `
      id,
      announcements!inner (
        farmer_id
      )
    `,
      { count: "exact", head: true }
    )
    .eq("announcements.farmer_id", user.id)
    .eq("status", "pending");

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

  const transportIds = transport?.map((r) => r.id) ?? [];
  const warehouseIds = warehouse?.map((r) => r.id) ?? [];

  let unreadCount = 0;

  if (transportIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "transport")
      .in("request_id", transportIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadCount += count ?? 0;
  }

  if (warehouseIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "warehouse")
      .in("request_id", warehouseIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadCount += count ?? 0;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      
      {/* SIDEBAR */}
      <aside
        className="w-64 p-5 flex flex-col justify-between
        border-r border-white/40
        bg-white/60 backdrop-blur-xl"
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
<div className="mb-8 flex items-center gap-2 text-lg font-semibold text-black">
  <Image
    src="/farmer2.webp"
    alt="Farmer"
    width={90}
    height={90}
  />
  <span>Farmer panel</span>
</div>
          {/* NAV */}
          <nav className="flex flex-col gap-1">
            <SidebarItem href="/farmer" label="Dashboard" icon="🏠" />
            <SidebarItem href="/farmer/announcements" label="Announcements" icon="📦" />
            <SidebarItem href="/farmer/browse" label="Browse" icon="🔍" />

            <SidebarItem
              href="/farmer/interests"
              label="Pipeline"
              icon="🤝"
              badge={newInterestsCount ?? 0}
            />

            <SidebarItem href="/farmer/find-transport" label="Transport" icon="🚚" />
            <SidebarItem href="/farmer/find-warehouse" label="Warehouse" icon="🏬" />
<SidebarItem
  href="/farmer/find-workers"
  label="Find workers"
  icon="👷"
/>
            <SidebarItem
              href="/farmer/requests"
              label="Requests"
              icon="📨"
              badge={unreadCount}
            />

            <SidebarItem href="/farmer/profile" label="Profile" icon="👤" />
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to homepage
          </Link>

          <div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">
        
        {/* CONTENT */}
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 flex justify-between items-center">
            <span>
              © {new Date().getFullYear()} Agri Coordination
            </span>

            <a
              href="/testimonials/new"
              className="text-green-700 hover:underline font-medium"
            >
              ✍️ Leave feedback
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
