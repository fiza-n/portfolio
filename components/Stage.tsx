"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useUI } from "@/lib/store";
import { focusTerminal, blurTerminal } from "@/lib/focus";
import { terminal } from "@/lib/terminal/instance";
import { getCRT } from "@/lib/terminal/crt";
import { TerminalInput } from "./TerminalInput";

// WebGL never renders on the server.
const WorkstationCanvas = dynamic(() => import("./three/WorkstationCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid place-items-center label">Warming up the CRT…</div>,
});

export function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useUI((s) => s.focused);
  const [visible, setVisible] = useState(true);

  // pause the render loop when the hero is off screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // load the CRT font, size the columns, then boot
  useEffect(() => {
    const crt = getCRT();
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-vt323").trim() || "monospace";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.fonts
      .load(`28px ${family}`)
      .catch(() => undefined)
      .then(() => {
        crt.setFont(family);
        void terminal.boot({ instant: reduce });
      });
  }, []);

  return (
    <div
      ref={ref}
      onClick={focusTerminal}
      className="relative h-[clamp(320px,82vw,520px)] min-w-0 cursor-text min-[880px]:h-[clamp(380px,52vw,620px)]"
      aria-label="Interactive retro workstation. Click to use its terminal."
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 62% 56% at 54% 40%, var(--glow), transparent 72%)", filter: "blur(24px)" }}
      />
      <WorkstationCanvas stageRef={ref} visible={visible} />
      <TerminalInput />
      {focused && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            blurTerminal();
          }}
          className="label absolute left-2 top-2 cursor-pointer rounded-md border border-line bg-surface px-2.5 py-1 !text-ink"
        >
          Esc · step back
        </button>
      )}
      <span className="label absolute bottom-1.5 right-2">FN-26 · 640K OK</span>
      <LiveRegion />
    </div>
  );
}

/** Mirrors the latest terminal output for screen readers. Isolated so typing doesn't re-render the canvas. */
function LiveRegion() {
  useSyncExternalStore(terminal.subscribe, terminal.getVersion, () => 0);
  return (
    <div className="sr-only" aria-live="polite">
      {terminal.lastOutput}
    </div>
  );
}
