// Run separately from suites that mock Base UI modules process-wide.
import { afterAll, afterEach, describe, expect, test } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(document, "fonts", { value: new EventTarget() });
// Use Motion’s JavaScript animation driver in Happy DOM.
Reflect.deleteProperty(Element.prototype, "animate");
const matchMedia = window.matchMedia.bind(window);
window.matchMedia = (query) => {
  const result = matchMedia(query);
  if (query.includes("prefers-reduced-motion"))
    Object.defineProperty(result, "matches", { value: true });
  return result;
};

const { act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { ChatPreview } = await import("../../app/chat/chat-preview");

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

function find<T extends HTMLElement>(selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element;
}

async function click(selector: string): Promise<void> {
  await act(async () => find(selector).click());
}

async function waitForExit(): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (!container.querySelector('[data-slot="chat-reply-focus"]')) return;
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
  }
  throw new Error("Reply preview did not exit");
}

async function mount(): Promise<HTMLDivElement> {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<ChatPreview direct />));
  const viewport = find<HTMLDivElement>('[role="log"]');
  // Happy DOM has no layout. Give the real timeline a scrollable message height.
  Object.defineProperties(viewport, {
    clientHeight: { get: () => 200 },
    scrollHeight: {
      get: () =>
        viewport.querySelectorAll('[data-slot="chat-message"]').length * 300,
    },
  });
  const source = find('[data-slot="chat-message-bubble"]');
  source.getBoundingClientRect = () => new DOMRect(0, 100, 240, 40);
  await act(async () => {
    viewport.scrollTop = 120;
    viewport.dispatchEvent(new Event("scroll", { bubbles: true }));
  });
  return viewport;
}

async function typeDraft(): Promise<void> {
  await act(async () => {
    const input = find('[data-slot="composer-input"]');
    input.focus();
    input.textContent = "Reply test";
    window.getSelection()?.selectAllChildren(input);
    window.getSelection()?.collapseToEnd();
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  });
}

afterEach(async () => {
  if (root) await act(async () => root.unmount());
  container?.remove();
});

afterAll(async () => {
  await GlobalRegistrator.unregister();
});

describe("reply scroll handoff", () => {
  test("reveals a sent reply after the reply preview exits", async () => {
    const viewport = await mount();
    await click('[aria-label="Reply to Maya Chen"]');
    await typeDraft();
    await click('[aria-label="Send message"]');
    await waitForExit();

    expect(viewport.scrollTop).toBeGreaterThanOrEqual(
      viewport.scrollHeight - viewport.clientHeight,
    );
    const sent = Array.from(
      viewport.querySelectorAll('[data-slot="chat-message"]'),
    ).find((message) => message.textContent?.includes("Reply test"));
    expect(
      sent?.querySelector('[data-slot="chat-reply-reference"]')?.textContent,
    ).toContain("Hey Sam, can you review the onboarding flow?");
  });

  test("preserves the draft and reading position when a reply is cancelled", async () => {
    const viewport = await mount();
    await click('[aria-label="Reply to Maya Chen"]');
    await typeDraft();
    await click('[aria-label="Cancel reply"]');
    await waitForExit();

    expect(viewport.scrollTop).toBe(120);
    expect(find('[data-slot="composer-input"]').textContent).toBe("Reply test");
  });
});
