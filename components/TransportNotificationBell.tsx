import Link from "next/link";

export default function TransportNotificationBell({
  notifications,
}: {
  notifications: any[];
}) {
  const unread = notifications.filter((n) => !n.read_at);

  return (
    <Link href="/transport/notifications">
      <div
        style={{
          position: "relative",
          cursor: "pointer",
          fontSize: 22,
        }}
      >
        🔔

        {unread.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -10,
              background: "#dc2626",
              color: "white",
              borderRadius: "50%",
              width: 18,
              height: 18,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unread.length}
          </span>
        )}
      </div>
    </Link>
  );
}
