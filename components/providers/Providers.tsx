"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "motion/react";
import { setLenis, scrollToId } from "@/lib/scroll";
import { terminal } from "@/lib/terminal/instance";
import { blurTerminal } from "@/lib/focus";
import { ui } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis drives the scroll, GSAP's ticker drives Lenis, and ScrollTrigger
 * updates on every Lenis scroll. One clock for everything = no jitter between
 * scrubbed timelines and the smooth scroll position.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // wire terminal side effects to the page
    terminal.actions = {
      scrollTo: scrollToId,
      blur: blurTerminal,
      highlightDisk: (n) => {
        ui.set({ litDisk: n });
        setTimeout(() => ui.get().litDisk === n && ui.set({ litDisk: null }), 2600);
      },
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
