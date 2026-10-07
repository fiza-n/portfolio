import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Smooth-scroll to a section id ("top" = page top). Falls back to native scroll. */
export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const el = id === "top" ? null : document.getElementById(id);
  if (id !== "top" && !el) return;
  if (lenis) {
    lenis.scrollTo(el ?? 0, { offset: -64, duration: 1.2 });
  } else {
    const top = el ? el.getBoundingClientRect().top + window.scrollY - 64 : 0;
    window.scrollTo({ top });
  }
}
