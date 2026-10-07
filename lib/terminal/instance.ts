import { site } from "@/content/site";
import { TerminalEngine } from "./engine";

/** The one terminal shared by the 3D screen, the hero chips and the keyboard deck. */
export const terminal = new TerminalEngine(site);
