import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import SidebarItem from "@/components/SidebarItem";
import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import Image from "next/image";

export default async function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("transport");
  const supabase = await supabaseServer();

  // 🔔 unread messages
  const { data: transportRequests } = await supabase
    .from("transport_requests")
    .select("id")
    .eq("transport_user_id", user.id);

  const transportRequestIds =
    transportRequests?.map((r) => r.id) ?? [];

  let unreadCount = 0;

  if (transportRequestIds.length > 0) {
    const { count } = await supabase
      .from("request_messages")
      .select("*", { count: "exact", head: true })
      .eq("request_type", "transport")
      .in("request_id", transportRequestIds)
      .neq("sender_id", user.id)
      .is("read_at", null);

    unreadCount = count ?? 0;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* SIDEBAR */}
      <aside className="w-64 p-5 flex flex-col justify-between border-r bg-white/60 backdrop-blur-xl">

        {/* TOP */}
        <div>
<div className="mb-8 flex items-center gap-2 text-lg font-semibold text-black">
  <Image
    src="/transport2.webp"
    alt="Transport"
    width={90}
    height={90}
  />
  <span>Transport panel</span>
</div>
          <nav className="flex flex-col gap-1">
            <SidebarItem href="/transport" label="Dashboard" icon="🏠" />

            <SidebarItem
              href="/transport/requests"
              label="Requests"
              icon="📨"
              badge={unreadCount}
            />

            <SidebarItem
              href="/transport/completed"
              label="Completed"
              icon="✅"
            />

<SidebarItem
  href="/transport/browse"
  label="Browse"
  icon="📦"
/>
            <SidebarItem
              href="/transport/profile"
              label="Profile"
              icon="👤"
            />
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

          <LogoutButton />
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">

        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>

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
