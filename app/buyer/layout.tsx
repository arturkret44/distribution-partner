import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import SidebarItem from "@/components/SidebarItem";
import { supabaseServer } from "@/lib/supabase/server";
import { requireRole } from "@/lib/guards";
import Image from "next/image";
export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("buyer");
  const supabase = await supabaseServer();

  // 🔔 unread updates
  const { count: unreadCount } = await supabase
    .from("interests")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", user.id)
    .is("read_at", null)
    .in("status", ["agreed", "rejected", "contacted"]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">

      {/* SIDEBAR */}
      <aside className="w-64 p-5 flex flex-col justify-between border-r bg-white/60 backdrop-blur-xl">
        <div>
<div className="mb-8 flex items-center gap-2 text-lg font-semibold text-black">
  <Image
    src="/buyer2.webp"
    alt="Buyer"
    width={90}
    height={90}
  />
  <span>Buyer panel</span>
</div>
          <nav className="flex flex-col gap-1">
            <SidebarItem href="/buyer" label="Dashboard" icon="🏠" />
<SidebarItem href="/buyer/browse" label="Browse" icon="📦" />

            <SidebarItem
              href="/buyer/interests"
              label="Pipeline"
              icon="🤝"
              badge={unreadCount ?? 0}
            />

            <SidebarItem
              href="/buyer/contracts"
              label="Contracts"
              icon="💼"
            />

            <SidebarItem
              href="/buyer/profile"
              label="Profile"
              icon="👤"
            />
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-gray-500">
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
          <div className="px-6 py-4 text-sm text-gray-500 flex justify-between">
            <span>© {new Date().getFullYear()} Agri Coordination</span>
            <a href="/testimonials/new">✍️ Leave feedback</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
