"use client";

import { useCallback } from "react";
import { terminal } from "@/lib/terminal/instance";
import { registerTerminalInput, blurTerminal } from "@/lib/focus";
import { ui, useUI } from "@/lib/store";
import { click } from "@/lib/sound";

/**
 * A real, invisible <input> captures typing for the CRT.
 * It brings up the on-screen keyboard on phones and gives screen readers a real field.
 */
export function TerminalInput() {
  const focused = useUI((s) => s.focused);
  const ref = useCallback((el: HTMLInputElement | null) => registerTerminalInput(el), []);

  return (
    <input
      ref={ref}
      type="text"
      aria-label="Terminal input"
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      className={`absolute left-1/2 top-[40%] h-10 w-2/5 border-0 text-base opacity-0 ${focused ? "pointer-events-auto" : "pointer-events-none"}`}
      onChange={(e) => {
        terminal.setInput(e.target.value);
        terminal.keypress();
        click(1.2);
      }}
      onKeyDown={(e) => {
        const el = e.currentTarget;
        if (!terminal.power && e.key !== "Escape") terminal.setPower(true);
        switch (e.key) {
          case "Enter":
            e.preventDefault();
            click(0.8);
            terminal.submit();
            el.value = "";
            break;
          case "ArrowUp":
          case "ArrowDown":
            e.preventDefault();
            el.value = terminal.recall(e.key === "ArrowUp" ? 1 : -1);
            break;
          case "Tab":
            e.preventDefault();
            el.value = terminal.complete();
            break;
          case "Escape":
            e.preventDefault();
            blurTerminal();
            break;
        }
      }}
      onBlur={() => {
        // clicking outside the stage steps back out of the terminal
        setTimeout(() => {
          if (ui.get().focused && document.activeElement?.getAttribute("aria-label") !== "Terminal input") ui.set({ focused: false });
        }, 0);
      }}
    />
  );
}
