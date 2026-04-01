"use client";

import { useEffect, useRef } from "react";

export default function AutoScrollRow({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const speed = 1; // 1px na krok (możesz zmienić na 2 jeśli chcesz szybciej)

    const interval = setInterval(() => {
      if (!container) return;

      container.scrollLeft += speed;

      // reset gdy dojedziemy do połowy (bo dzieci są zdublowane)
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }, 20); // ~50 fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex gap-4 overflow-x-auto pb-3"
    >
      {children}
      {children}
    </div>
  );
}
