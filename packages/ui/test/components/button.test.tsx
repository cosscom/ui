import { beforeEach, describe, expect, mock, test } from "bun:test";
import type * as React from "react";

type ButtonPrimitiveProps = Record<string, unknown> & {
  children?: React.ReactNode;
};

const buttonPrimitiveCalls: ButtonPrimitiveProps[] = [];

function mockButtonPrimitive(props: ButtonPrimitiveProps) {
  buttonPrimitiveCalls.push(props);
  return null;
}

mock.module("@base-ui/react/button", () => ({
  Button: mockButtonPrimitive,
}));

const { Button: ButtonComponent } = await import("../../src/components/button");

function Button(props: Parameters<typeof ButtonComponent>[0]) {
  const element = ButtonComponent(props);
  (element.type as (props: unknown) => unknown)(element.props);
}

function lastButtonPrimitiveCall() {
  const lastCall = buttonPrimitiveCalls[buttonPrimitiveCalls.length - 1];
  if (!lastCall) {
    throw new Error("ButtonPrimitive was not called");
  }
  return lastCall;
}

describe("Button", () => {
  beforeEach(() => {
    buttonPrimitiveCalls.length = 0;
  });

  test("sets base attributes and forwards children", () => {
    Button({ children: "Default label" });

    const call = lastButtonPrimitiveCall();
    expect(call["data-slot"]).toBe("button");
    expect(call.disabled).toBe(false);
    expect(call.focusableWhenDisabled).toBe(false);
    expect(call.children).toBeDefined();
  });

  test("disables and stays focusable while loading", () => {
    Button({ children: "Submit", loading: true });

    const call = lastButtonPrimitiveCall();
    expect(call.disabled).toBe(true);
    expect(call.focusableWhenDisabled).toBe(true);
    expect(call["data-loading"]).toBe("");
  });

  test("respects an explicit focusableWhenDisabled override", () => {
    Button({
      children: "Submit",
      focusableWhenDisabled: false,
      loading: true,
    });

    const call = lastButtonPrimitiveCall();
    expect(call.disabled).toBe(true);
    expect(call.focusableWhenDisabled).toBe(false);
  });

  test("merges variants, sizes, and custom className", () => {
    Button({
      className: "custom-class",
      size: "lg",
      variant: "destructive",
    });

    const call = lastButtonPrimitiveCall();
    const className = call.className as string;
    expect(className).toContain("border-destructive");
    expect(className).toContain("h-10");
    expect(className).toContain("custom-class");
  });
});
