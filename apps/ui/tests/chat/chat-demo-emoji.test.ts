import { describe, expect, it } from "bun:test";
import {
  EMOJI,
  searchEmoji,
} from "../../registry/default/chat-demo/chat-demo-emoji";

function labels(query: string): string[] {
  return searchEmoji(query).map((item) => item.label);
}

describe("chat demo emoji search", () => {
  it("needs at least two characters", () => {
    expect(searchEmoji("")).toEqual([]);
    expect(searchEmoji("t")).toEqual([]);
    expect(searchEmoji(" t ")).toEqual([]);
    expect(labels("th")).toContain("thumbsup");
  });

  it("ranks shortcode prefixes, then keyword prefixes, then substrings", () => {
    expect(labels("smile")).toEqual([
      "smiley",
      "smile",
      "grinning",
      "grin",
      "slightly_smiling_face",
      "blush",
      "sweat_smile",
    ]);
  });

  it("returns at most eight results", () => {
    expect(
      EMOJI.filter((item) => item.shortcode.includes("he")).length,
    ).toBeGreaterThan(8);
    expect(searchEmoji("he")).toHaveLength(8);
    expect(searchEmoji("he", EMOJI, 3)).toHaveLength(3);
  });

  it("ignores case and matches spaces as underscores", () => {
    expect(labels("Heart Eyes")).toEqual(["heart_eyes"]);
    expect(labels("THU")).toEqual(["thumbsup", "thumbsdown"]);
  });

  it("returns plain-text items that insert the emoji", () => {
    expect(searchEmoji("thumbsup")).toEqual([
      { id: "thumbsup", label: "thumbsup", text: "👍", type: "text" },
    ]);
  });

  it("ships the common reactions with unique shortcodes", () => {
    for (const [query, emoji] of [
      ["thumbsup", "👍"],
      ["heart", "❤️"],
      ["joy", "😂"],
      ["open_mouth", "😮"],
      ["clap", "👏"],
      ["tada", "🎉"],
    ] as const) {
      expect(searchEmoji(query)[0]?.text).toBe(emoji);
    }
    const shortcodes = EMOJI.map((item) => item.shortcode);
    expect(new Set(shortcodes).size).toBe(shortcodes.length);
    expect(EMOJI.length).toBeGreaterThanOrEqual(100);
    expect(EMOJI.length).toBeLessThanOrEqual(150);
  });
});
