"use client";

import { useEffect, useRef } from "react";

export default function ScrollToBottom() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return <div ref={ref} />;
}
