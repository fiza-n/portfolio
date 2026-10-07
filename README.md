# ZZ-26 Workstation

Fiza Noor's portfolio: a 3D late-80s workstation whose CRT runs a real terminal.

**Stack:** Next.js 15 (App Router, React 19) · React Three Fiber + drei · Lenis · GSAP + ScrollTrigger · Motion · Tailwind CSS v4

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also runs the type check)
```

Node 18.18+ (Node 20 or 22 recommended).

## Edit content

Everything visible (projects, specs, links, hero text) lives in `content/site.ts`. The terminal commands read from the same file.

## How it fits together

```
app/
  layout.tsx            fonts (next/font), metadata, Providers
  page.tsx              TopBar → Hero → Projects → Specs → KeyboardDeck
  globals.css           Tailwind v4 + color tokens (light/dark) + keycap/floppy styles
components/
  providers/Providers   Lenis driven by gsap.ticker, ScrollTrigger synced, terminal actions wired
  Hero, Stage           headline (Motion), chips, the 3D stage + hidden terminal input
  TerminalInput         invisible <input> that feeds the terminal (mobile keyboard + a11y)
  three/
    WorkstationCanvas   R3F <Canvas>, lights, contact shadow, WebGL fallback
    Rig                 cursor / scroll / scroll-velocity rotation, camera fly-to-screen
    Workstation         case, monitor, keyboard (instanced caps), mouse — all primitives, no GLB
    CRTScreen           curved glass mesh textured with the terminal canvas
  Projects              floppy-disk cards, GSAP ScrollTrigger scrub
  Specs                 rear-panel spec plate (server component)
  KeyboardDeck          mechanical keys, Motion springs, physical key shortcuts
lib/
  terminal/engine.ts    pure terminal state machine (no React, no canvas)
  terminal/commands.ts  help, projects, open <n>, stack, contact, sudo hire-me, …
  terminal/complete.ts  Tab completion  ← TODO: your call on the behavior
  terminal/crt.ts       draws the terminal to a 2D canvas (phosphor, scanlines)
  store.ts              tiny UI store (focused / sound / lit disk)
  scroll.ts, focus.ts, sound.ts
```

## Adding a command

Add an entry in `lib/terminal/commands.ts`:

```ts
ping: { description: "check latency", run: () => t.print("pong · 12ms") },
```

It shows up in `help` and Tab completion automatically.
