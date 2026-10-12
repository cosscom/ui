import { describe, expect, test } from "bun:test";
import { Children, isValidElement, type ReactNode } from "react";
import {
  AgentApprovalActions,
  type AgentApprovalActionsProps,
  AgentApprovalGroupActions,
  type AgentApprovalGroupActionsProps,
} from "../../src/components/agent-approval";
import { Button, type ButtonProps } from "../../src/components/button";

function buttons(node: ReactNode): ButtonProps[] {
  return Children.toArray(node).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [];
    if (child.type === Button) return [child.props as ButtonProps];
    return buttons(child.props.children);
  });
}

// Exercise the intent contract independently of the primitive render implementation.
function renderActions(disabled = false) {
  const decisions: boolean[] = [];
  const element = AgentApprovalActions({
    approveLabel: "Approve",
    rejectLabel: "Skip",
    onRespond: (approved) => decisions.push(approved),
    disabled,
  });
  return { decisions, controls: buttons(element) };
}

function activate(control: ButtonProps) {
  control.onClick?.({} as Parameters<NonNullable<ButtonProps["onClick"]>>[0]);
}

describe("AgentApprovalActions decision contract", () => {
  test("reports rejection and approval without submitting a form", () => {
    const { controls, decisions } = renderActions();
    expect(controls).toHaveLength(2);
    activate(controls[0]);
    activate(controls[1]);
    expect(decisions).toEqual([false, true]);
    expect(
      controls.every(
        (control) => !control.disabled && control.type === "button",
      ),
    ).toBe(true);
  });

  test("blocks both decisions while disabled, including repeated handler calls", () => {
    const { controls, decisions } = renderActions(true);
    for (const control of controls) {
      expect(control.disabled).toBe(true);
      activate(control);
      activate(control);
    }
    expect(decisions).toEqual([]);
  });

  test("allows either decision when the caller re-enables the actions", () => {
    const blocked = renderActions(true);
    activate(blocked.controls[1]);
    expect(blocked.decisions).toEqual([]);
    const enabled = renderActions(false);
    activate(enabled.controls[1]);
    activate(enabled.controls[0]);
    expect(enabled.decisions).toEqual([true, false]);
  });
});

function renderGroup(
  items: AgentApprovalGroupActionsProps["items"],
  disabled = false,
) {
  const decisions: { ids: string[]; approved: boolean }[] = [];
  const element = AgentApprovalGroupActions({
    approveLabel: "Approve remaining",
    rejectLabel: "Skip remaining",
    items,
    disabled,
    onRespond: (ids, approved) => decisions.push({ ids, approved }),
  });
  const props = element.props as AgentApprovalActionsProps;
  return { decisions, props, controls: buttons(AgentApprovalActions(props)) };
}

describe("AgentApprovalGroupActions decision contract", () => {
  test("reports one batch in display order per decision", () => {
    const { controls, decisions } = renderGroup([
      { id: "intro" },
      { id: "demo" },
    ]);
    activate(controls[1]);
    expect(decisions).toEqual([{ ids: ["intro", "demo"], approved: true }]);
    activate(controls[0]);
    expect(decisions[1]).toEqual({ ids: ["intro", "demo"], approved: false });
    expect(decisions).toHaveLength(2);
  });

  test("excludes handled or pending items from both decisions", () => {
    const { controls, decisions } = renderGroup([
      { id: "handled", disabled: true },
      { id: "remaining" },
      { id: "pending", disabled: true },
    ]);
    activate(controls[1]);
    activate(controls[0]);
    expect(decisions).toEqual([
      { ids: ["remaining"], approved: true },
      { ids: ["remaining"], approved: false },
    ]);
  });

  test("a retry uses the caller's updated eligibility", () => {
    const first = renderGroup([{ id: "intro" }, { id: "demo" }]);
    activate(first.controls[1]);
    const retry = renderGroup([
      { id: "intro", disabled: true },
      { id: "demo" },
    ]);
    activate(retry.controls[1]);
    expect(first.decisions[0].ids).toEqual(["intro", "demo"]);
    expect(retry.decisions[0].ids).toEqual(["demo"]);
  });

  for (const scenario of [
    { name: "empty", items: [], disabled: false },
    {
      name: "all items unavailable",
      items: [{ id: "intro", disabled: true }],
      disabled: false,
    },
    { name: "whole group pending", items: [{ id: "intro" }], disabled: true },
  ]) {
    test(`blocks the ${scenario.name} group`, () => {
      const { controls, props, decisions } = renderGroup(
        scenario.items,
        scenario.disabled,
      );
      expect(controls.every((control) => control.disabled)).toBe(true);
      for (const control of controls) activate(control);
      props.onRespond(true);
      props.onRespond(false);
      expect(decisions).toEqual([]);
    });
  }

  test("never reports the same ID twice", () => {
    const { controls, decisions } = renderGroup([
      { id: "intro" },
      { id: "intro" },
    ]);
    activate(controls[1]);
    expect(decisions[0].ids).toEqual(["intro"]);
  });

  test("passes a fresh ID snapshot to each callback", () => {
    const { controls, decisions } = renderGroup([
      { id: "intro" },
      { id: "demo" },
    ]);
    activate(controls[1]);
    decisions[0].ids.pop();
    activate(controls[0]);
    expect(decisions[1].ids).toEqual(["intro", "demo"]);
  });
});
