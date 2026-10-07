import type { TerminalEngine, Tone } from "./engine";
import { terminal } from "./instance";

const W = 1024;
const H = 768;
const PAD = 46;
const LINE_H = 30;
const COLORS: Record<Tone, string> = { normal: "#ffb347", dim: "#b0782b", hot: "#fff1c9", error: "#ff7b54" };

/**
 * Draws the terminal into an offscreen 2D canvas (amber phosphor, scanlines, vignette).
 * The R3F screen uses that canvas as a CanvasTexture; the no-WebGL fallback shows it directly.
 */
export class CRT {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private font = "28px monospace";
  private cursor = true;
  private drawListeners = new Set<() => void>();

  constructor(private engine: TerminalEngine) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = W;
    this.canvas.height = H;
    this.ctx = this.canvas.getContext("2d")!;
    engine.subscribe(() => this.draw());
    setInterval(() => {
      this.cursor = !this.cursor;
      if (engine.power && !engine.busy) this.draw();
    }, 530);
  }

  /** Call once fonts are loaded so column count matches the real glyph width. */
  setFont(family: string) {
    this.font = `28px ${family}`;
    this.ctx.font = this.font;
    const cw = this.ctx.measureText("M").width || 14;
    this.engine.cols = Math.max(40, Math.floor((W - PAD * 2) / cw));
    this.draw();
  }

  onDraw(fn: () => void) {
    this.drawListeners.add(fn);
    return () => {
      this.drawListeners.delete(fn);
    };
  }

  draw() {
    const c = this.ctx;
    const t = this.engine;
    c.save();
    c.fillStyle = "#0c0904";
    c.fillRect(0, 0, W, H);

    if (t.power) {
      c.font = this.font;
      c.textBaseline = "top";
      c.shadowColor = "rgba(255,170,60,0.55)";
      c.shadowBlur = 8;
      const rows = Math.floor((H - PAD * 2) / LINE_H);
      const promptLines = t.busy ? [] : t.wrap(t.prompt + t.input);
      const view = t.lines.slice(-Math.max(1, rows - promptLines.length));
      let y = PAD;
      for (const l of view) {
        c.fillStyle = COLORS[l.tone];
        c.fillText(l.text, PAD, y);
        y += LINE_H;
      }
      promptLines.forEach((l, i) => {
        if (i === 0) {
          c.fillStyle = COLORS.hot;
          c.fillText(t.prompt, PAD, y);
          c.fillStyle = COLORS.normal;
          c.fillText(l.slice(t.prompt.length), PAD + c.measureText(t.prompt).width, y);
        } else {
          c.fillStyle = COLORS.normal;
          c.fillText(l, PAD, y);
        }
        if (i === promptLines.length - 1 && this.cursor) {
          c.fillStyle = COLORS.normal;
          c.fillRect(PAD + c.measureText(l).width + 2, y + 2, 14, 24);
        }
        y += LINE_H;
      });
      c.shadowBlur = 0;

      c.fillStyle = "rgba(0,0,0,0.22)";
      for (let sy = 0; sy < H; sy += 4) c.fillRect(0, sy, W, 2);
      const g = c.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85);
      g.addColorStop(0, "rgba(255,160,40,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    } else {
      c.fillStyle = "rgba(255,200,120,0.5)";
      c.beginPath();
      c.arc(W / 2, H / 2, 3, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
    this.drawListeners.forEach((l) => l());
  }
}

let crt: CRT | null = null;
/** Lazily created on the client only (needs `document`). */
export function getCRT(): CRT {
  if (!crt) crt = new CRT(terminal);
  return crt;
}
