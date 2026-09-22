"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Riyadh",
});

/** The current time in Riyadh, ticking once a minute. Renders empty on the server. */
export function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>Riyadh {time && `· ${time} GMT+3`}</span>;
}
