import { ui } from "./store";

let ctx: AudioContext | null = null;

/** Synthesized mechanical switch: a 12ms filtered noise burst plus a short low thump. */
export function click(pitch = 1) {
  if (!ui.get().sound || typeof window === "undefined") return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx ?? new AC();
    const t = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * 0.012);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3200 * pitch;
    bp.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.value = 0.35;
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(t);

    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.setValueAtTime(140 * pitch, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.04);
    og.gain.setValueAtTime(0.12, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(og).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.06);
  } catch {
    /* audio unavailable: stay silent */
  }
}
