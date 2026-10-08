import type { Site } from "@/content/site";
import type { TerminalEngine } from "./engine";

export type Command = { description: string; hidden?: boolean; run: (args: string[]) => void };

const short = (url: string) => url.replace(/^https:\/\/(www\.)?/, "");

export function buildCommands(t: TerminalEngine, site: Site): Record<string, Command> {
  const files: Record<string, () => void> = {
    "about.txt": () => cmds.about.run([]),
    "stack.cfg": () => cmds.stack.run([]),
    "contact.lnk": () => cmds.contact.run([]),
  };

  const cmds: Record<string, Command> = {
    help: {
      description: "list commands",
      run() {
        t.print("Available commands:", "hot");
        for (const [k, v] of Object.entries(cmds)) if (!v.hidden) t.print(`  ${k.padEnd(12)} ${v.description}`);
        t.print("Tip: arrow keys recall history, Tab completes.", "dim");
      },
    },
    about: {
      description: "who is behind this machine",
      run() {
        t.print(`${site.name}. Software engineering student, aiming at backend and applied AI/ML.`, "hot");
        t.print("Third year at MAJU, Karachi. Building FastAPI, Redis and Next.js projects, and researching a Linux syscall tracer with a faculty supervisor.");
      },
    },
    projects: {
      description: "list the disks",
      run() {
        site.projects.forEach((p, i) => t.print(`  [${i + 1}] ${p.name.padEnd(28)} ${p.state}`));
        t.print("Type 'open <n>' to load a disk.", "dim");
      },
    },
    open: {
      description: "open <n>: load a project disk",
      run([arg]) {
        const n = parseInt(arg ?? "", 10);
        const p = site.projects[n - 1];
        if (!p) return t.print(`open: no disk ${arg ?? ""}. Try 1-${site.projects.length}.`, "error");
        t.print(`Loading disk ${n}... ${p.name}`, "hot");
        t.print(p.blurb);
        t.print("tags: " + p.tags.join(", "), "dim");
        t.actions.highlightDisk(n);
        setTimeout(() => {
          t.actions.blur();
          t.actions.scrollTo(`disk-${n}`);
        }, 900);
      },
    },
    stack: {
      description: "print system specifications",
      run() {
        for (const [k, v] of site.specs) t.print(`  ${k.padEnd(10)} ${v}`);
      },
    },
    contact: {
      description: "how to reach me",
      run() {
        t.print("GitHub     " + short(site.links.github));
        t.print("LinkedIn   " + short(site.links.linkedin));
        t.print("Instagram  " + short(site.links.instagram));
        t.print("Or press G / L / I on the control deck below.", "dim");
      },
    },
    ls: { description: "list files", run: () => t.print(Object.keys(files).join("    ") + "    disks/") },
    cat: {
      description: "cat <file>",
      run([f]) {
        const fn = f ? files[f] : undefined;
        if (fn) fn();
        else t.print(`cat: ${f ?? ""}: no such file`, "error");
      },
    },
    whoami: { description: "print user", run: () => t.print(site.user) },
    date: {
      description: "time in Pakistan",
      run: () =>
        t.print(
          new Date().toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "full", timeStyle: "short" }) + " PKT",
        ),
    },
    echo: { description: "echo <text>", run: (a) => t.print(a.join(" ")) },
    history: {
      description: "show command history",
      run: () =>
        t.history
          .slice()
          .reverse()
          .forEach((h, i) => t.print(`  ${String(i + 1).padStart(3)}  ${h}`)),
    },
    clear: { description: "clear the screen", run: () => t.clear() },
    shutdown: { description: "power off the CRT", run: () => t.setPower(false) },
    sudo: {
      description: "",
      hidden: true,
      run(a) {
        if (a.join(" ") === "hire-me") {
          t.print("[sudo] password for visitor: ********", "dim");
          t.print("Permission granted. Good choice.", "hot");
          t.print("Send a message on LinkedIn: " + short(site.links.linkedin));
          setTimeout(() => {
            t.actions.blur();
            t.actions.scrollTo("contact");
          }, 1400);
        } else {
          t.print("visitor is not in the sudoers file. This incident will be reported.", "error");
        }
      },
    },
  };
  return cmds;
}
