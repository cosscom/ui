// Runs in its own `bun test` process (see the root `test` script): other test
// files mock Base UI modules process-wide, which would break a real render.
import { afterAll, afterEach, describe, expect, test } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import type { ReactElement } from "react";

GlobalRegistrator.register();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
// Happy DOM has no FontFaceSet; the input layout only listens to it.
Object.defineProperty(document, "fonts", { value: new EventTarget() });

const { act, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const {
  Composer,
  ComposerInput,
  ComposerItem,
  ComposerList,
  ComposerPopup,
  ComposerSubmit,
  getComposerText,
} = await import("../../src/components/composer");
type ComposerItemValue =
  import("../../src/components/composer").ComposerItemValue;
type ComposerValue = import("../../src/components/composer").ComposerValue;

const emoji: ComposerItemValue[] = [
  { id: "thumbsup", label: "thumbsup", text: "👍", type: "text" },
  { id: "thumbsdown", label: "thumbsdown", text: "👎", type: "text" },
  { id: "tada", label: "tada", text: "🎉", type: "text" },
];

function search(query: string): ComposerItemValue[] {
  return query.length < 2
    ? []
    : emoji.filter((item) => item.label.startsWith(query));
}

let latest: ComposerValue = [];

function EmojiComposer(): ReactElement {
  const [items, setItems] = useState<ComposerItemValue[]>([]);
  return (
    <Composer
      onQueryChange={(query) =>
        setItems(query?.character === ":" ? search(query.text) : [])
      }
      onValueChange={(value) => {
        latest = value;
      }}
      triggers={[{ character: ":", items, filter: null }]}
    >
      <ComposerInput aria-label="Message" />
      <ComposerPopup>
        <ComposerList>
          {(item: ComposerItemValue) => (
            <ComposerItem key={item.id} value={item}>
              {item.text} :{item.label}:
            </ComposerItem>
          )}
        </ComposerList>
      </ComposerPopup>
    </Composer>
  );
}

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
let input: HTMLDivElement;

function options(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="composer-item"]'),
  ).map((item) => item.textContent ?? "");
}

function highlighted(): string | null {
  return (
    document.querySelector('[data-slot="composer-item"][data-highlighted]')
      ?.textContent ?? null
  );
}

// Append text at the end of the draft the way a browser does, then notify.
async function type(text: string): Promise<void> {
  await act(async () => {
    input.focus();
    const last = input.lastChild;
    const node =
      last instanceof Text
        ? last
        : input.appendChild(document.createTextNode(""));
    node.appendData(text);
    window.getSelection()?.collapse(node, node.length);
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  });
}

async function press(key: string, init: KeyboardEventInit = {}): Promise<void> {
  await act(async () => {
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
        ...init,
      }),
    );
  });
}

afterAll(async () => {
  await GlobalRegistrator.unregister();
});

describe("Composer focus", () => {
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    window.getSelection()?.removeAllRanges();
  });

  async function mount(defaultValue: ComposerValue = []): Promise<void> {
    function TestComposer(): ReactElement {
      const [value, setValue] = useState(defaultValue);
      return (
        <Composer
          value={value}
          onValueChange={setValue}
          onSubmit={() => setValue([])}
        >
          <ComposerInput aria-label="Message" />
          <ComposerSubmit aria-label="Send message">Send</ComposerSubmit>
        </Composer>
      );
    }
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(<TestComposer />));
    const element = container.querySelector<HTMLDivElement>(
      '[data-slot="composer-input"]',
    );
    if (!element) throw new Error("Composer input not rendered");
    input = element;
  }

  test("initializes an empty caret during native focus, before focusin", async () => {
    await mount();
    window.getSelection()?.removeAllRanges();
    let caretReady = false;
    input.addEventListener(
      "focusin",
      () => {
        const selection = window.getSelection();
        caretReady =
          selection?.anchorNode === input &&
          selection.anchorOffset === 0 &&
          selection.isCollapsed;
      },
      { once: true },
    );
    await act(async () => input.focus());
    expect(caretReady).toBe(true);
    expect(input.textContent).toBe("");
  });

  test("preserves the caret in an existing draft when refocused", async () => {
    await mount([{ type: "text", text: "existing draft" }]);
    await act(async () => input.focus());
    const text = input.firstChild;
    if (!text) throw new Error("Draft not rendered");
    window.getSelection()?.setBaseAndExtent(text, 3, text, 3);
    await act(async () => {
      input.blur();
      input.focus();
    });
    expect(window.getSelection()?.anchorNode).toBe(text);
    expect(window.getSelection()?.anchorOffset).toBe(3);
    expect(input.textContent).toBe("existing draft");
  });

  test("preserves the caret in a blank-line draft when refocused", async () => {
    await mount([{ type: "text", text: "\n" }]);
    await act(async () => input.focus());
    input.innerHTML = "<div><br></div><div><br></div>";
    const secondLine = input.lastChild;
    if (!secondLine) throw new Error("Blank line not rendered");
    window.getSelection()?.setBaseAndExtent(secondLine, 0, secondLine, 0);
    await act(async () => {
      input.blur();
      input.focus();
    });
    expect(window.getSelection()?.anchorNode).toBe(secondLine);
    expect(window.getSelection()?.anchorOffset).toBe(0);
  });

  test("prevents compatibility mousedown from stealing focus across sends", async () => {
    await mount();
    const button = container.querySelector<HTMLButtonElement>(
      '[aria-label="Send message"]',
    );
    if (!button) throw new Error("Send button not rendered");
    for (const message of ["first", "second"]) {
      await type(message);
      const down = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        button: 0,
      });
      await act(async () => {
        button.dispatchEvent(down);
        if (!down.defaultPrevented) button.focus();
        button.click();
      });
      expect(down.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(input);
      expect(input.textContent).toBe("");
      await act(async () => input.blur());
    }
  });
});

describe("Composer text items", () => {
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    latest = [];
  });

  async function mount(): Promise<void> {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(<EmojiComposer />));
    const element = container.querySelector<HTMLDivElement>(
      '[data-slot="composer-input"]',
    );
    if (!element) throw new Error("Composer input not rendered");
    input = element;
  }

  test("opens after a colon and two characters", async () => {
    await mount();
    await type(":t");
    expect(options()).toEqual([]);
    await type("h");
    expect(options()).toEqual(["👍 :thumbsup:", "👎 :thumbsdown:"]);
  });

  test("stays closed inside times and URLs, and after a space", async () => {
    await mount();
    await type("at 10:30");
    expect(options()).toEqual([]);
    await type(" https://thumbs");
    expect(options()).toEqual([]);
    await type(" : th");
    expect(options()).toEqual([]);
  });

  test("closes on Escape", async () => {
    await mount();
    await type(":th");
    expect(options()).toHaveLength(2);
    await press("Escape");
    expect(options()).toEqual([]);
  });

  test("navigates with arrows and inserts the character on Enter", async () => {
    await mount();
    await type("nice :thu");
    expect(highlighted()).toBe("👍 :thumbsup:");
    await press("ArrowDown");
    expect(highlighted()).toBe("👎 :thumbsdown:");
    await press("ArrowDown");
    expect(highlighted()).toBe("👍 :thumbsup:");
    await press("ArrowUp");
    expect(highlighted()).toBe("👎 :thumbsdown:");
    await press("ArrowUp");
    await press("Enter");

    expect(options()).toEqual([]);
    expect(input.textContent).toBe("nice 👍 ");
    expect(input.querySelector("[data-composer-token]")).toBeNull();
    expect(latest).toEqual([{ type: "text", text: "nice 👍 " }]);
    expect(getComposerText(latest)).toBe("nice 👍 ");

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(input);
    if (selection?.anchorNode)
      range.setEnd(selection.anchorNode, selection.anchorOffset);
    expect(range.toString()).toBe("nice 👍 ");
  });

  test("undo restores the query", async () => {
    await mount();
    await type(":tada");
    await press("Enter");
    expect(getComposerText(latest)).toBe("🎉 ");
    await press("z", { ctrlKey: true });
    expect(getComposerText(latest)).toBe(":tada");
  });
});
