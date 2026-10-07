/**
 * Tab completion for the workstation terminal.
 *
 * Called with what the visitor has typed so far and the visible command names.
 * Return the string that should replace the input.
 *
 * TODO(Zain): this is a design decision, not boilerplate. Pick a behavior:
 *  - Bash-style: complete the shared prefix of all matches
 *    ("h" -> "h", since help/history share only "h"; "he" -> "help ").
 *  - Cycle: each Tab steps to the next match (needs a little state).
 *  - Argument-aware: "open " + Tab suggests disk numbers.
 * The current fallback only completes when exactly one command matches.
 */
export function completeCommand(partial: string, names: string[]): string {
  const hits = names.filter((n) => n.startsWith(partial.toLowerCase()));
  return hits.length === 1 ? hits[0] + " " : partial;
}
