"use client";

import { useState } from "react";

export function FarmerNotificationBell({
  notifications,
}: {
  notifications: {
    id: string;
    announcement_id: string;
    announcements?: {
      product_name: string;
    } | null;
  }[];
}) {
  const [open, setOpen] = useState(false);
  const count = notifications.length;

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-2 text-gray-700 hover:text-green-700 transition"
      >
        <span className="text-xl">🔔</span>
        <span className="text-sm font-medium">
          Notifications
        </span>

        {count > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {/* Dropdown */}
{open && (
  <div className="absolute right-0 mt-3 w-80 rounded-lg border bg-white shadow-lg z-50">
    {/* Header */}
    <div className="px-4 py-3 border-b flex items-center justify-between">
      <span className="font-semibold text-gray-800">
        Notifications
      </span>
    </div>

    {/* Content */}
    {notifications.length === 0 ? (
      <div className="px-4 py-6 text-sm text-gray-500 text-center">
        No new notifications
      </div>
    ) : (
      <ul className="max-h-72 overflow-y-auto divide-y">
        {notifications.slice(0, 5).map((n) => (
          <li key={n.id}>
            <a
              href={`/announcements/${n.announcement_id}?notification=${n.id}`}
              onClick={() => setOpen(false)}
              className="block w-full px-4 py-3 text-sm hover:bg-gray-50"
            >
              Someone is interested in your product:{" "}
              <b>{n.announcements?.product_name}</b>
            </a>
          </li>
        ))}
      </ul>
    )}

    {/* Footer – ALWAYS visible */}
    <div className="border-t">
      <a
        href="/farmer/notifications"
        onClick={() => setOpen(false)}
        className="block px-4 py-3 text-sm text-green-700 font-medium hover:bg-green-50 text-center"
      >
        View all notifications →
      </a>
    </div>
  </div>
)}
    </div>
  );
}
