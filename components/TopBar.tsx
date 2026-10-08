"use client";

import { useEffect, useState } from "react";
import { ui, useUI } from "@/lib/store";
import { click } from "@/lib/sound";
import { scrollToId } from "@/lib/scroll";

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit" });

export function TopBar() {
  const sound = useUI((s) => s.sound);
  const [time, setTime] = useState("--:--"); // set on the client to avoid a hydration mismatch

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="wrap flex flex-wrap items-center gap-5 py-3">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
          className="font-display text-[0.95rem] font-bold tracking-tight no-underline"
        >
          FIZA NOOR
        </a>
        <span className="label inline-flex items-center gap-2">
          <span className="beacon" aria-hidden="true" />
          Open to internships
        </span>
        <span className="flex-1" />
        <span className="label tabular-nums">PKT {time}</span>
        <button
          type="button"
          aria-pressed={sound}
          onClick={() => {
            ui.set({ sound: !sound });
            click();
          }}
          className="label cursor-pointer rounded-md border border-line bg-surface px-2.5 py-1 !text-ink aria-pressed:border-signal aria-pressed:!text-signal"
        >
          {sound ? "Sound on" : "Sound off"}
        </button>
      </div>
    </header>
  );
}
