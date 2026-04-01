"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl
        transition-all duration-200
        ${
          active
            ? "bg-green-50 text-green-700 font-medium"
            : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
        }
        hover:translate-x-[2px]
      `}
    >
      {/* ACTIVE INDICATOR */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-green-500 rounded-r-full" />
      )}

      <span className="text-lg">{icon}</span>

      <span className="text-sm">{label}</span>

      {/* BADGE */}
      {badge && badge > 0 && (
        <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
          {badge}
        </span>
      )}
    </Link>
  );
}
