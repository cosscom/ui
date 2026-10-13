export function getComposerQuery(
  text: string,
  caret: number,
  triggers: readonly string[],
): { character: string; text: string; start: number; end: number } | null {
  let start = -1;
  let character = "";
  for (const trigger of triggers) {
    if (!trigger || trigger.length > caret) continue;
    const index = text.lastIndexOf(trigger, caret - trigger.length);
    if (index > start) {
      start = index;
      character = trigger;
    }
  }
  if (start < 0 || (start > 0 && !/\s/u.test(text.charAt(start - 1))))
    return null;

  const beforeCaret = text.slice(start + character.length, caret);
  if (/^\s/u.test(beforeCaret)) return null;
  if (!/^[\p{L}\p{M}\p{N}\p{Zs}_.’'-]*$/u.test(beforeCaret)) return null;

  // Complete the word at the caret without consuming subsequent prose.
  const suffix = /^[\p{L}\p{M}\p{N}_.’'-]*/u.exec(text.slice(caret))?.[0] ?? "";
  return {
    character,
    text: (beforeCaret + suffix).replace(/\p{Zs}+/gu, " ").trim(),
    start,
    end: caret + suffix.length,
  };
}
