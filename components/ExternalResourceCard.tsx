"use client";

export default function ExternalResourceCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        rounded-2xl p-5 bg-white/60 backdrop-blur-xl
        border border-gray-200 hover:border-gray-300
        shadow-sm hover:shadow-md transition
        hover:scale-[1.02]
      "
    >
      <p className="text-xs text-gray-400">{title}</p>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-xl">{icon}</span>
        <p className="text-lg font-semibold">{title}</p>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {description}
      </p>
    </a>
  );
}
