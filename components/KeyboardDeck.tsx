"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { terminal } from "@/lib/terminal/instance";
import { focusTerminal } from "@/lib/focus";
import { scrollToId } from "@/lib/scroll";
import { useUI } from "@/lib/store";
import { click } from "@/lib/sound";

type KeyDef = {
  key: string; // the physical key that triggers it
  cap: string;
  what: string;
  href?: string;
  action?: () => void;
  accent?: boolean;
  span?: "w2" | "space";
};

const KEYS: KeyDef[] = [
  { key: "h", cap: "H", what: "Home", action: () => scrollToId("top") },
  { key: "p", cap: "P", what: "Projects", action: () => scrollToId("projects") },
  { key: "s", cap: "S", what: "Specs", action: () => scrollToId("specs") },
  {
    key: "t",
    cap: "T",
    what: "Terminal",
    accent: true,
    action: () => {
      scrollToId("top");
      setTimeout(focusTerminal, 700);
    },
  },
  { key: "g", cap: "G", what: "GitHub ↗", href: site.links.github, span: "w2" },
  { key: " ", cap: "SPACE", what: "CRT power", span: "space", action: () => terminal.setPower(!terminal.power) },
];

const spring = { type: "spring", stiffness: 900, damping: 22, mass: 0.6 } as const;

export function KeyboardDeck() {
  const [down, setDown] = useState<string | null>(null);
  const focused = useUI((s) => s.focused);
  const sound = useUI((s) => s.sound);
  const power = useSyncExternalStore(terminal.subscribe, () => terminal.power, () => true);

  // physical keyboard shortcuts, only while the terminal doesn't have the keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const active = document.activeElement;
      if (active && /INPUT|TEXTAREA|SELECT/.test(active.tagName)) return;
      const def = KEYS.find((k) => k.key === e.key.toLowerCase());
      if (!def) return;
      if (def.key === " " && active && /BUTTON|A/.test(active.tagName)) return; // let space press the focused control
      e.preventDefault();
      setDown(def.key);
      setTimeout(() => setDown((d) => (d === def.key ? null : d)), 150);
      document.querySelector<HTMLElement>(`[data-key="${CSS.escape(def.key)}"]`)?.click();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <footer id="contact" className="pb-10 pt-14">
      <div className="wrap">
        <div className="deck">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.1em] text-keyink">
            <span>Control deck · press keys on your keyboard</span>
            <span className="flex gap-3.5">
              <span className="led" data-on={power}><i />Power</span>
              <span className="led" data-on={focused}><i />Term</span>
              <span className="led" data-on={sound}><i />Sound</span>
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2.5 min-[880px]:grid-cols-8">
            {KEYS.map((k) => {
              const isDown = down === k.key;
              const cls = [
                "keycap",
                k.accent ? "keycap-accent" : "",
                k.span === "w2" ? "col-span-2" : "",
                k.span === "space" ? "col-span-full !min-h-[54px] !flex-row items-center justify-center gap-3 min-[880px]:col-start-2 min-[880px]:col-span-6" : "",
              ].join(" ");
              const inner = (
                <>
                  <span className="font-display text-lg font-bold leading-none">{k.cap}</span>
                  <span className="what">{k.what}</span>
                </>
              );
              const motionProps = {
                "data-key": k.key,
                "data-down": isDown,
                className: cls,
                animate: { y: isDown ? 4 : 0 },
                whileHover: { y: 1 },
                whileTap: { y: 4 },
                transition: spring,
                onClick: () => {
                  click(k.key === " " ? 0.7 : 1);
                  k.action?.();
                },
              };
              return k.href ? (
                <motion.a key={k.key} href={k.href} target="_blank" rel="noopener" {...motionProps}>
                  {inner}
                </motion.a>
              ) : (
                <motion.button key={k.key} type="button" {...motionProps}>
                  {inner}
                </motion.button>
              );
            })}
          </div>
        </div>
        <div className="label mt-6 flex flex-wrap justify-between gap-3">
          <span>© 2026 {site.name}</span>
          <span>Built with Next.js, React Three Fiber, Lenis and GSAP</span>
        </div>
      </div>
    </footer>
  );
}
