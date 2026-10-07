"use client";
import { useSyncExternalStore } from "react";

/** Tiny external store: UI state shared between the DOM, the R3F scene and the keyboard deck. */
type UIState = {
  focused: boolean;      // terminal has the keyboard, camera zoomed to the CRT
  sound: boolean;
  litDisk: number | null; // project disk highlighted by `open <n>`
};

let state: UIState = { focused: false, sound: false, litDisk: null };
const listeners = new Set<() => void>();

export const ui = {
  get: () => state,
  set(patch: Partial<UIState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

const serverState: UIState = { focused: false, sound: false, litDisk: null };

export function useUI<T>(select: (s: UIState) => T): T {
  return useSyncExternalStore(ui.subscribe, () => select(state), () => select(serverState));
}
