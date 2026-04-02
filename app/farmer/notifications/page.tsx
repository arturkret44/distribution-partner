import { requireRole } from "@/lib/guards";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function FarmerNotificationsPage() {
  await requireRole("farmer");
  const { user } = await requireApprovedUser();
  const supabase = await supabaseServer();

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select(`
      id,
      created_at,
      read_at,
      announcement_id,
      announcements (
        product_name
      )
    `)
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
<a
  href="/farmer"
  className="inline-block mb-6 text-sm text-green-700 font-medium hover:underline"
>
  ← Back to dashboard
</a>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Notifications archive
        </h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500">
            No notifications yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border bg-white p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-800">
                    Someone is interested in your product{" "}
                    <b>{n.announcements?.product_name}</b>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                <a
                  href={`/announcements/${n.announcement_id}`}
                  className="text-sm text-green-700 hover:underline"
                >
                  Open →
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
