import { describe, expect, test } from "bun:test";
import { getComposerQuery } from "../../src/lib/composer-query";

describe("getComposerQuery", () => {
  test("keeps `+` in an emoji query with the caret at the end", () => {
    expect(getComposerQuery(":+1", 3, [":"])).toEqual({
      character: ":",
      text: "+1",
      start: 0,
      end: 3,
    });
  });

  test("completes `+1` when the caret sits after `:+`", () => {
    expect(getComposerQuery(":+1", 2, [":"])).toEqual({
      character: ":",
      text: "+1",
      start: 0,
      end: 3,
    });
  });

  test("keeps a mention open across `+`, since every trigger shares the pattern", () => {
    expect(getComposerQuery("@a+b", 4, ["@"])).toEqual({
      character: "@",
      text: "a+b",
      start: 0,
      end: 4,
    });
  });
});
