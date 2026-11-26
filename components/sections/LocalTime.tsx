"use client";

import { useEffect, useState } from "react";

export function LocalTime({ location, timeZone }: { location: string; timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span>
      {location}
      {time && <span className="text-paper">, {time} IST</span>}
    </span>
  );
}
