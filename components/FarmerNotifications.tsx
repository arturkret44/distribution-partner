import { markNotificationAsReadAndGo } from "@/app/farmer/actions";

type Notification = {
  id: string;
  announcement_id: string;
  created_at: string;
  announcements: {
    product_name: string;
  } | null;
};

export function FarmerNotifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="mt-6 rounded-lg border bg-white p-4">
      <h2 className="font-semibold text-gray-800 mb-2">
        🔔 New notifications
      </h2>

      <ul className="space-y-2 text-sm">
        {notifications.map((n) => (
          <li key={n.id}>
<form action={markNotificationAsReadAndGo}>
              <input
                type="hidden"
                name="notification_id"
                value={n.id}
              />
              <input
                type="hidden"
                name="announcement_id"
                value={n.announcement_id}
              />

              <button
                type="submit"
                className="text-left text-gray-700 hover:underline"
              >
                Someone is interested in your product:{" "}
                <b>{n.announcements?.product_name}</b>
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
