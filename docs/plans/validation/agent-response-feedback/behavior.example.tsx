import { afterEach, expect, test } from "bun:test";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost" });
Object.defineProperty(win, "SyntaxError", { value: SyntaxError });
for (const name of [
  "MutationObserver",
  "ResizeObserver",
  "HTMLInputElement",
  "HTMLButtonElement",
  "HTMLFormElement",
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLTextAreaElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "CompositionEvent",
  "FocusEvent",
  "getComputedStyle",
])
  Object.defineProperty(globalThis, name, {
    value: name === "window" ? win : (win as any)[name],
    configurable: true,
    writable: true,
  });
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
(globalThis as any).requestAnimationFrame = (callback: () => void) =>
  setTimeout(callback, 0);
(globalThis as any).cancelAnimationFrame = clearTimeout;
Object.defineProperty(win.HTMLElement.prototype, "getAnimations", {
  value: () => [],
  configurable: true,
});
const { act, createRef } = await import("react");
const { createRoot } = await import("react-dom/client");
const { AgentResponseFeedback } = await import(
  "./src/components/ui/agent-response-feedback"
);
const labels = {
  goodResponse: "Good",
  badResponse: "Bad",
  dialogTitle: "Feedback",
  dialogDescription: "Optional details",
  reasonPrompt: "Reason",
  details: "Details",
  detailsPlaceholder: "Explain",
  cancel: "Cancel",
  submit: "Send",
  submitError: "Save failed",
  thankYou: "Thanks",
};
let container = document.createElement("div");
document.body.append(container);
let root = createRoot(container);
const render = async (props: any = {}) =>
  act(async () => {
    root.render(
      <AgentResponseFeedback
        labels={labels}
        onFeedback={() => {}}
        {...props}
      />,
    );
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
const button = (label: string) =>
  Array.from(document.querySelectorAll("button")).find(
    (b) => b.getAttribute("aria-label") === label || b.textContent === label,
  )!;
const click = async (label: string) =>
  act(async () => {
    button(label).click();
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
const submit = async () =>
  act(async () => {
    document
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
afterEach(async () => {
  await act(async () => {
    root.unmount();
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
  container.remove();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
test("successful positive save selects and a second click clears", async () => {
  const calls: any[] = [];
  await render({ onFeedback: (v: any) => calls.push(v) });
  await click("Good");
  expect(button("Good").getAttribute("aria-pressed")).toBe("true");
  await click("Good");
  expect(calls).toEqual([
    { rating: "positive", reasons: [], details: "" },
    null,
  ]);
  expect(button("Good").getAttribute("aria-pressed")).toBe("false");
});
test("in-flight guard blocks repeated activation before render", async () => {
  let count = 0;
  let done!: () => void;
  await render({
    onFeedback: () => {
      count++;
      return new Promise<void>((resolve) => {
        done = resolve;
      });
    },
  });
  await act(async () => {
    button("Good").click();
    button("Good").click();
    button("Bad").click();
  });
  expect(count).toBe(1);
  expect(button("Good").disabled).toBe(true);
  await act(async () => done());
  expect(button("Good").getAttribute("aria-pressed")).toBe("true");
});
test("failed clear preserves previous rating and permits retry", async () => {
  let fail = true;
  await render({
    defaultValue: "positive",
    onFeedback: () => {
      if (fail) throw new Error("failure");
    },
  });
  await click("Good");
  expect(button("Good").getAttribute("aria-pressed")).toBe("true");
  expect(container.textContent).toContain("Save failed");
  fail = false;
  await click("Good");
  expect(button("Good").getAttribute("aria-pressed")).toBe("false");
});
test("controlled rating remains caller-owned after saving", async () => {
  await render({ value: null });
  await click("Good");
  expect(button("Good").getAttribute("aria-pressed")).toBe("false");
  await render({ value: "negative" });
  expect(button("Bad").getAttribute("aria-pressed")).toBe("true");
});
test("disabled blocks rating actions", async () => {
  let count = 0;
  await render({ disabled: true, onFeedback: () => count++ });
  await click("Good");
  await click("Bad");
  expect(count).toBe(0);
  expect(document.querySelectorAll('[role="dialog"]').length).toBe(0);
});
test("negative feedback permits omitted reasons and details", async () => {
  const calls: any[] = [];
  await render({ showDetails: false, onFeedback: (v: any) => calls.push(v) });
  await click("Bad");
  expect(document.querySelectorAll("textarea").length).toBe(0);
  await submit();
  expect(calls).toEqual([{ rating: "negative", reasons: [], details: "" }]);
  expect(button("Bad").getAttribute("aria-pressed")).toBe("true");
});
test("negative failure retains selected reason for retry", async () => {
  let fail = true;
  const calls: any[] = [];
  await render({
    reasons: [{ value: "wrong", label: "Wrong" }],
    onFeedback: (v: any) => {
      calls.push(v);
      if (fail) throw new Error("failed");
    },
  });
  await click("Bad");
  await click("Wrong");
  await submit();
  expect(button("Wrong").getAttribute("aria-pressed")).toBe("true");
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
    "Save failed",
  );
  fail = false;
  await submit();
  expect(calls[1]).toEqual({
    rating: "negative",
    reasons: ["wrong"],
    details: "",
  });
  expect(button("Bad").getAttribute("aria-pressed")).toBe("true");
});
test("pending negative save blocks duplicate submit and Escape dismissal", async () => {
  let count = 0;
  let done!: () => void;
  await render({
    onFeedback: () => {
      count++;
      return new Promise<void>((resolve) => {
        done = resolve;
      });
    },
  });
  await click("Bad");
  await act(async () => {
    const form = document.querySelector("form")!;
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
  });
  expect(count).toBe(1);
  expect(document.querySelectorAll('[role="dialog"]').length).toBe(1);
  expect(button("Send").disabled).toBe(true);
  await act(async () => done());
});
