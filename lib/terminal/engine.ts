import type { Site } from "@/content/site";
import { buildCommands, type Command } from "./commands";
import { completeCommand } from "./complete";

export type Tone = "normal" | "dim" | "hot" | "error";
export type Line = { text: string; tone: Tone };

/** Side effects the terminal can trigger on the page. Wired up in Providers. */
export type TerminalActions = {
  scrollTo: (id: string) => void;
  highlightDisk: (n: number) => void;
  blur: () => void;
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Pure terminal state machine. It knows nothing about canvas, WebGL or React:
 * the CRT renderer and UI subscribe to it, so the same engine drives
 * the 3D screen and the flat fallback.
 */
export class TerminalEngine {
  lines: Line[] = [];
  input = "";
  history: string[] = [];
  busy = false;
  power = true;
  cols = 72;
  lastOutput = "";
  readonly prompt: string;
  readonly commands: Record<string, Command>;
  actions: TerminalActions = { scrollTo: () => {}, highlightDisk: () => {}, blur: () => {} };

  private hIdx = -1;
  private booted = false;
  private version = 0;
  private listeners = new Set<() => void>();
  private keyListeners = new Set<() => void>();

  constructor(readonly site: Site) {
    this.prompt = `${site.user}@${site.host}:~$ `;
    this.commands = buildCommands(this, site);
  }

  /* ---- subscriptions (arrow fns so they can be passed around unbound) ---- */
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
  getVersion = () => this.version;
  onKey = (fn: () => void) => {
    this.keyListeners.add(fn);
    return () => {
      this.keyListeners.delete(fn);
    };
  };
  keypress() {
    this.keyListeners.forEach((l) => l());
  }
  private emit() {
    this.version++;
    this.listeners.forEach((l) => l());
  }

  /* ---- output ---- */
  wrap(text: string): string[] {
    const out: string[] = [];
    for (const raw of text.split("\n")) {
      let s = raw;
      if (!s.length) {
        out.push("");
        continue;
      }
      while (s.length > this.cols) {
        let cut = s.lastIndexOf(" ", this.cols);
        if (cut < 10) cut = this.cols;
        out.push(s.slice(0, cut));
        s = s.slice(cut).replace(/^ /, "");
      }
      out.push(s);
    }
    return out;
  }

  print(text = "", tone: Tone = "normal") {
    for (const l of this.wrap(text)) this.lines.push({ text: l, tone });
    if (this.lines.length > 400) this.lines.splice(0, this.lines.length - 400);
    this.lastOutput = text;
    this.emit();
  }

  clear() {
    this.lines = [];
    this.emit();
  }

  /* ---- input ---- */
  setInput(v: string) {
    this.input = v;
    this.emit();
  }

  submit() {
    const t = this.input;
    this.input = "";
    this.run(t);
  }

  run(line: string) {
    const raw = line.trim();
    this.print(this.prompt + raw, "hot");
    if (!raw) return;
    this.history.unshift(raw);
    this.hIdx = -1;
    const [name, ...args] = raw.split(/\s+/);
    const cmd = this.commands[name.toLowerCase()];
    if (cmd) cmd.run(args);
    else this.print(`${name}: command not found. Type 'help'.`, "error");
  }

  /** Step through history. dir = 1 goes back in time. Returns the new input. */
  recall(dir: 1 | -1): string {
    this.hIdx = Math.max(-1, Math.min(this.history.length - 1, this.hIdx + dir));
    this.setInput(this.hIdx < 0 ? "" : this.history[this.hIdx]);
    return this.input;
  }

  complete(): string {
    const names = Object.keys(this.commands).filter((k) => !this.commands[k].hidden);
    this.setInput(completeCommand(this.input, names));
    return this.input;
  }

  /* ---- power & boot ---- */
  setPower(on: boolean) {
    this.power = on;
    if (on) {
      this.lines = [];
      void this.boot({ instant: true, force: true });
    }
    this.emit();
  }

  async boot({ instant = false, force = false } = {}) {
    if (this.booted && !force) return; // React strict mode mounts twice
    this.booted = true;
    const seq: [string, Tone][] = [
      ["BYTES BIOS v2.6  (c) 2026 Bytes Limited", "dim"],
      ["Memory test: 640K OK", "dim"],
      ["Detecting drives... A: 1.44M  C: ZZ-OS", "dim"],
      ["", "normal"],
      ["ZZ-OS 26.10 ready. Welcome, visitor.", "hot"],
      ["Type 'help' to see what this machine can do.", "normal"],
    ];
    this.busy = true;
    for (const [t, tone] of seq) {
      this.print(t, tone);
      if (!instant) await sleep(260);
    }
    this.busy = false;
    this.emit();
  }

  /** Types a command out character by character, then runs it. Used by the hero chips. */
  async typeAndRun(text: string, { delay = 45, onChar }: { delay?: number; onChar?: () => void } = {}) {
    if (this.busy) return;
    if (!this.power) this.setPower(true);
    this.setInput("");
    for (const ch of text) {
      this.setInput(this.input + ch);
      this.keypress();
      onChar?.();
      if (delay) await sleep(delay);
    }
    this.submit();
  }
}
