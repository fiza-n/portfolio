"use client";

import { useEffect, useRef } from "react";
import { getCRT } from "@/lib/terminal/crt";

/** Shown when WebGL is unavailable: the same terminal canvas in a flat beige bezel. */
export function FallbackCRT() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = getCRT().canvas;
    c.style.width = "100%";
    c.style.height = "auto";
    c.style.display = "block";
    ref.current?.appendChild(c);
    return () => c.remove();
  }, []);
  return (
    <div
      ref={ref}
      className="absolute inset-x-[6%] top-[8%] overflow-hidden rounded-2xl border-[18px] border-plastic bg-[#0b0904] shadow-[0_0_0_1px_var(--plastic-shade),0_30px_60px_-20px_rgb(0_0_0/.4)]"
    />
  );
}
