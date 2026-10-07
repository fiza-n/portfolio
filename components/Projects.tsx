"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site } from "@/content/site";
import { useUI } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const lit = useUI((s) => s.litDisk);

  // disks slide out of the drawer one after another; scrubbed to scroll position
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".disk", {
          y: 60,
          rotate: (i) => (i % 2 ? 2 : -2),
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 35%", scrub: 0.6 },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="projects" className="py-16">
      <div className="wrap">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-3.5">
          <h2 className="font-display text-[1.75rem] font-bold tracking-[-0.03em]">Disks in the drawer</h2>
          <span className="label">
            Type <b>open 1</b> in the terminal, or press <b>P</b>
          </span>
        </div>
        <div ref={root} className="grid grid-cols-1 gap-[22px] min-[880px]:grid-cols-2">
          {site.projects.map((p, i) => (
            <article key={p.name} id={`disk-${i + 1}`} className="disk transition-transform duration-300 hover:-translate-y-1" data-lit={lit === i + 1}>
              <div className="disk-paper">
                <div className="flex justify-between gap-2.5 font-mono text-xs uppercase tracking-[0.08em] text-[#6b675e]">
                  <span>
                    Disk {String(i + 1).padStart(2, "0")} · {p.kind}
                  </span>
                  <span className="text-signal">{p.state}</span>
                </div>
                <h3 className="mb-1.5 mt-2.5 font-display text-[1.35rem] font-bold tracking-[-0.02em]">{p.name}</h3>
                <p className="mb-3.5 max-w-[52ch] text-[#3d3a34]">{p.blurb}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded border border-[#c9c4b8] bg-[#fffdf8] px-[7px] py-0.5 font-mono text-xs">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
