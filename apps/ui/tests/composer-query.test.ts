import assert from "node:assert/strict";
import { test } from "node:test";
import { getComposerQuery } from "../registry/default/lib/composer-query";

test("keeps full-name queries active through spaces and normalizes search whitespace", () => {
  for (const [input, query] of [
    ["@sam", "sam"],
    ["@sam ", "sam"],
    ["@sam r", "sam r"],
    ["@sam  rivera ", "sam rivera"],
    ["@sam\u00a0r", "sam r"],
    ["@Jose\u0301 O’N", "Jose\u0301 O’N"],
  ] as const) {
    assert.deepEqual(getComposerQuery(input, input.length, ["@"]), {
      character: "@",
      text: query,
      start: 0,
      end: input.length,
    });
  }
});

test("replaces the query and current word without consuming following prose", () => {
  const text = "Ask @sam rivera about this";
  const caret = text.indexOf("vera");
  const query = getComposerQuery(text, caret, ["@"]);
  assert.deepEqual(query, {
    character: "@",
    text: "sam rivera",
    start: 4,
    end: 15,
  });
  assert.equal(
    `${text.slice(0, query?.start)}@Sam Rivera${text.slice(query?.end)}`,
    "Ask @Sam Rivera about this",
  );
  const partial = "Ask @sam r about this";
  assert.equal(
    getComposerQuery(partial, partial.indexOf(" about"), ["@"])?.text,
    "sam r",
  );
});

test("uses the most recent configured trigger and supports multi-word actions", () => {
  assert.equal(
    getComposerQuery("@sam r /sum up", 14, ["@", "/"])?.text,
    "sum up",
  );
  assert.equal(
    getComposerQuery("@sam r /sum up", 14, ["@", "/"])?.character,
    "/",
  );
  assert.equal(
    getComposerQuery("#design team", 12, ["#"])?.text,
    "design team",
  );
  assert.equal(getComposerQuery("/sum up", 7, ["@"]), null);
  assert.equal(getComposerQuery("@sam r", 6, []), null);
});

test("does not cross newlines, punctuation, email addresses, or URLs", () => {
  for (const input of [
    "@sam\nr",
    "@sam\r\nr",
    "@sam,r",
    "@sam\tr",
    "sam@rivera.com",
    "https://example.com/path",
    "@sam r https://example.com",
    "@sam r @invalid@email",
  ]) {
    assert.equal(
      getComposerQuery(input, input.length, ["@", "/"]),
      null,
      input,
    );
  }
  assert.equal(getComposerQuery("Notes\n@sam r", 12, ["@"])?.text, "sam r");
});
