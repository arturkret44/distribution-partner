import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import SidebarItem from "@/components/SidebarItem";
import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import Image from "next/image";
export default async function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("warehouse");
  const supabase = await supabaseServer();

  // unread messages
  const { data: warehouseRequests } = await supabase
    .from("warehouse_requests")
    .select("id")
    .eq("warehouse_user_id", user.id);

  const requestIds = warehouseRequests?.map(r => r.id) ?? [];

  let unreadCount = 0;

  if (requestIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "warehouse")
      .in("request_id", requestIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadCount = count ?? 0;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* SIDEBAR */}
      <aside className="w-64 p-5 flex flex-col justify-between border-r bg-white/60 backdrop-blur-xl">

        <div>
<div className="mb-8 flex items-center gap-2 text-lg font-semibold text-black">
  <Image
    src="/warehouse2.webp"
    alt="Warehouse"
    width={90}
    height={90}
  />
  <span>Warehouse panel</span>
</div>
          <nav className="flex flex-col gap-1">
            <SidebarItem href="/warehouse" label="Dashboard" icon="🏠" />

            <SidebarItem
              href="/warehouse/requests"
              label="Requests"
              icon="📨"
              badge={unreadCount}
            />

            <SidebarItem
              href="/warehouse/completed"
              label="Completed"
              icon="✅"
            />

            <SidebarItem
              href="/warehouse/browse"
              label="Browse"
              icon="📦"
            />
            <SidebarItem
  href="/warehouse/find-workers"
  label="Find workers"
  icon="👷"
/>

            <SidebarItem
              href="/warehouse/profile"
              label="Profile"
              icon="👤"
            />
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            ← Back to homepage
          </Link>

          <LogoutButton />
        </div>
      </aside>

      {/* RIGHT */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>

        <footer className="border-t bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 flex justify-between">
            <span>© {new Date().getFullYear()} Agri Coordination</span>
            <a href="/testimonials/new">✍️ Leave feedback</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
