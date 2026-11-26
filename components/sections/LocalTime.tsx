"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: site.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span>
      {site.location}
      {time && <span className="text-paper">, {time} IST</span>}
    </span>
  );
}
