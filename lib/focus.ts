import { ui } from "./store";

let inputEl: HTMLInputElement | null = null;

export const registerTerminalInput = (el: HTMLInputElement | null) => {
  inputEl = el;
};

export function focusTerminal() {
  ui.set({ focused: true });
  inputEl?.focus({ preventScroll: true });
}

export function blurTerminal() {
  ui.set({ focused: false });
  inputEl?.blur();
}
