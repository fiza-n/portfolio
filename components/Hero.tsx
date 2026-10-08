"use client";

import { motion, type Variants } from "motion/react";
import { site } from "@/content/site";
import { terminal } from "@/lib/terminal/instance";
import { focusTerminal } from "@/lib/focus";
import { click } from "@/lib/sound";
import { Stage } from "./Stage";

const CHIPS = ["help", "projects", "stack", "sudo hire-me"];

const rise: Variants = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: "0%", transition: { delay: 0.1 + i * 0.12, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } }),
};

export function Hero() {
  const runChip = (cmd: string) => {
    click();
    focusTerminal();
    void terminal.typeAndRun(cmd, { onChar: () => click(1.1) });
  };

  return (
    <section className="relative">
      <div className="wrap grid grid-cols-1 items-center gap-6 pb-2 pt-7 min-[880px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[880px]:pb-6 min-[880px]:pt-12">
        <div className="min-w-0">
          <div className="label">{site.role}</div>
          <h1 className="mb-5 mt-3.5 font-display text-[clamp(2.6rem,6.4vw,5.2rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            {["Fiza Noor", "builds backends."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span className={`block ${i === 1 ? "text-signal" : ""}`} variants={rise} initial="hidden" animate="show" custom={i}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mb-6 max-w-[34ch] text-xl leading-snug text-pretty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            {site.lede}
          </motion.p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Run a command on the workstation">
            {CHIPS.map((c) => (
              <button key={c} type="button" className="chip" onClick={() => runChip(c)}>
                {c}
              </button>
            ))}
          </div>
          <p className="label mt-4">
            Click the screen and type. <kbd className="rounded border border-b-2 border-line bg-surface px-1.5">Esc</kbd> to step back.
          </p>
        </div>
        <Stage />
      </div>
    </section>
  );
}
