import { supabaseServer } from "@/lib/supabase/server";
import { ApproveRejectButtons } from "./actions";
import { LogoutButton } from "@/components/LogoutButton";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await supabaseServer();

  const { data: users, error } = await supabase.rpc("admin_get_profiles");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
<div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
  <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
    🛠 Admin panel
  </div>

  <LogoutButton />
</div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800">
          Administration dashboard
        </h1>

        {/* Admin cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <DashboardCard
            href="/admin/external-transport"
            title="External transport companies"
            icon="🚚"
            description="Manage fallback transport directory"
          />

          <DashboardCard
            title="User management"
            icon="👥"
            description="Approve and manage platform users"
            disabled
          />

          <DashboardCard
            title="System settings"
            icon="⚙️"
            description="Configuration and platform options"
            disabled
          />
        </div>

        {/* Users section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pending and approved users
          </h2>

          <div className="bg-white rounded-xl shadow-sm border">
            {error && (
              <p className="p-6 text-red-600">
                Error loading users: {error.message}
              </p>
            )}

            {!users || users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found.
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Company</th>
                    <th className="text-left px-6 py-3">Role</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-left px-6 py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        {user.company_name}
                      </td>

                      <td className="px-6 py-4 text-gray-600 capitalize">
                        {user.role}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={user.verification_status} />
                      </td>

                      <td className="px-6 py-4">
                        <ApproveRejectButtons
                          userId={user.id}
                          currentStatus={user.verification_status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===== Helpers ===== */

function DashboardCard({
  title,
  description,
  icon,
  href,
  disabled,
}: {
  title: string;
  description: string;
  icon: string;
  href?: string;
  disabled?: boolean;
}) {
  const base =
    "rounded-xl border bg-white p-6 transition shadow-sm";

  if (disabled) {
    return (
      <div className={`${base} opacity-50 cursor-not-allowed`}>
        <div className="text-3xl">{icon}</div>
        <h3 className="mt-4 font-semibold text-gray-800">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {description}
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Coming soon
        </p>
      </div>
    );
  }

  return (
    <a
      href={href}
      className={`${base} hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5`}
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 font-semibold text-gray-800">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        {description}
      </p>
      <p className="text-sm text-gray-700 font-medium mt-4">
        Open →
      </p>
    </a>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
