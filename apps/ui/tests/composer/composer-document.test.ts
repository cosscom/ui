import { describe, expect, it } from "bun:test";
import { parseComposerClipboard } from "../../registry/default/lib/composer-clipboard";
import {
  equalValue,
  getComposerText,
  getFilteredItems,
  hasVisibleItems,
} from "../../registry/default/lib/composer-document";

const token = {
  type: "mention",
  trigger: "@",
  id: "person-1",
  label: "Alex",
  data: '{"scope":"workspace-1"}',
  text: "Alex",
} as const;

describe("structured composer values", () => {
  it("preserves metadata and uses explicit readable text, with a trigger-label fallback", () => {
    const value = [{ type: "text", text: "Ask " } as const, token];
    expect(parseComposerClipboard(JSON.stringify(value))).toEqual(value);
    expect(getComposerText(value)).toBe("Ask Alex");
    expect(getComposerText([{ ...token, text: undefined }])).toBe("@Alex");
    expect(equalValue([token], [{ ...token, data: "another scope" }])).toBe(
      false,
    );
    expect(equalValue([token], [{ ...token, text: "@Alex" }])).toBe(false);
  });

  it("rejects invalid or excessive clipboard input and drops unsupported fields", () => {
    expect(
      parseComposerClipboard(
        JSON.stringify([{ ...token, style: "position:fixed" }]),
      ),
    ).toEqual([token]);
    expect(parseComposerClipboard("<b>Alex</b>")).toBeNull();
    expect(
      parseComposerClipboard(JSON.stringify([{ type: "mention", id: 1 }])),
    ).toBeNull();
    expect(
      parseComposerClipboard(JSON.stringify(Array(1001).fill(token))),
    ).toBeNull();
    expect(parseComposerClipboard("x".repeat(100001))).toBeNull();
  });
});

describe("asynchronous composer suggestions", () => {
  const query = {
    character: "@",
    text: "al",
    key: "current",
    node: {} as Text,
    start: 0,
    end: 3,
  };
  const item = { id: "alex", label: "Alex" };

  it("rejects a different query identity even when the query text matches", () => {
    expect(
      getFilteredItems(
        { character: "@", items: [item], queryKey: "previous" },
        query,
        () => true,
      ),
    ).toEqual([]);
    expect(
      getFilteredItems(
        { character: "@", items: [item], queryKey: "current" },
        query,
        () => true,
      ),
    ).toEqual([item]);
    expect(
      getFilteredItems(
        { character: "@", items: [item], itemsFor: "other" },
        query,
        () => true,
      ),
    ).toEqual([]);
    expect(
      getFilteredItems({ character: "@", items: [item] }, query, () => true),
    ).toEqual([item]);
  });

  it("keeps ready empty results open only when requested", () => {
    expect(hasVisibleItems({ character: "@", items: [] }, [])).toBe(false);
    expect(
      hasVisibleItems({ character: "@", items: [], showEmpty: true }, []),
    ).toBe(true);
  });
});
