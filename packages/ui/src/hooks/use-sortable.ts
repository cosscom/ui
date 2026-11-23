"use client";

import type * as React from "react";
import {
  createElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DRAG_DISTANCE = 5;
const TOUCH_DELAY = 250;
const TOUCH_TOLERANCE = 8;
const SCROLL_EDGE = 48;
const SCROLL_SPEED = 20;
const WINDOW_EVENTS: string[] = [
  "pointermove",
  "pointerup",
  "pointercancel",
  "keydown",
  "scroll",
  "selectstart",
  "contextmenu",
  "dragstart",
];
const FIELD_SELECTOR =
  "input, select, textarea, [contenteditable]:not([contenteditable='false']), [data-sortable-ignore]";
const IGNORE_SELECTOR = `a[href], button, ${FIELD_SELECTOR}`;
const DEFAULT_INSTRUCTIONS =
  "Press Space or Enter to pick up an item. Use the arrow keys to move it, Space or Enter to drop it, and Escape to cancel.";

const visuallyHidden: React.CSSProperties = {
  border: 0,
  clipPath: "inset(50%)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
};

const useIsoLayoutEffect: typeof useLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const claimedEvents: WeakSet<Event> = new WeakSet<Event>();

type Point = { x: number; y: number };

type Session = {
  element: HTMLElement;
  id: string;
  point: Point;
  pointerId: number;
  start: Point;
  timer?: ReturnType<typeof setTimeout>;
  touch: boolean;
};

type Drag<Item> = SortableActive<Item> & {
  pointer?: { grab: Point; height: number; origin: Point; width: number };
};

type Latest<Value extends SortableValue<unknown>> = {
  committed: SortableValue<SortableItem<Value>>;
  getItemId: (item: SortableItem<Value>) => string;
  options: UseSortableOptions<Value>;
  preview: SortableValue<SortableItem<Value>>;
};

function defaultGetItemId(item: unknown): string {
  return typeof item === "object" && item !== null
    ? `${(item as { id: string | number }).id}`
    : `${item}`;
}

function locate<Item>(
  value: SortableValue<Item>,
  id: string,
  getItemId: (item: Item) => string,
): SortablePosition | null {
  for (const [container, items] of Object.entries(value)) {
    const index = items.findIndex((item) => getItemId(item) === id);
    if (index !== -1) return { container, index };
  }
  return null;
}

function moveById<Item>(
  value: SortableValue<Item>,
  id: string,
  to: SortablePosition,
  getItemId: (item: Item) => string,
): SortableValue<Item> {
  const from = locate(value, id, getItemId);
  return from ? moveSortableItem(value, from, to) : value;
}

function samePosition(a: SortablePosition, b: SortablePosition): boolean {
  return a.container === b.container && a.index === b.index;
}

function isInside(rect: DOMRect, point: Point): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

function isRtl(element: Element): boolean {
  return getComputedStyle(element).direction === "rtl";
}

function getMessage(
  type: SortableEvent<unknown>["type"],
  item: string,
  where: string,
  container: string,
): string {
  return {
    cancel: `Move canceled. ${item} returned to ${where}.`,
    drop: `Dropped ${item} at ${where}.`,
    move: `Moved ${item} to ${where}.`,
    refuse: `${item} cannot move to ${container}.`,
    start: `Picked up ${item}, ${where}.`,
  }[type];
}

function getEdgeDelta(start: number, end: number, at: number): number {
  const edge = Math.min(SCROLL_EDGE, (end - start) / 4);
  if (at < start + edge) {
    return -Math.ceil(((start + edge - at) / edge) * SCROLL_SPEED);
  }
  if (at > end - edge) {
    return Math.ceil(((at - end + edge) / edge) * SCROLL_SPEED);
  }
  return 0;
}

function scrollNearEdges(point: Point): boolean {
  let node: Element | null = document.elementFromPoint(point.x, point.y);
  for (; node; node = node.parentElement) {
    const isRoot = node === document.scrollingElement;
    const { overflowX, overflowY } = getComputedStyle(node);
    if (!isRoot && !/auto|scroll|overlay/.test(overflowX + overflowY)) continue;
    const rect = isRoot
      ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
      : node.getBoundingClientRect();
    if (!isInside(rect, point)) continue;
    const { scrollLeft, scrollTop } = node;
    node.scrollTop += getEdgeDelta(rect.top, rect.bottom, point.y);
    node.scrollLeft += getEdgeDelta(rect.left, rect.right, point.x);
    if (node.scrollTop !== scrollTop || node.scrollLeft !== scrollLeft) {
      return true;
    }
  }
  return false;
}

export type SortableValue<Item> = Record<string, readonly Item[]>;

export type SortableOrientation = "vertical" | "horizontal" | "grid";

export type SortableReason = "pointer" | "keyboard";

export type SortablePosition = {
  /** Key of the container in the value. */
  container: string;
  /** Index of the item in that container, after the move. */
  index: number;
};

export type SortableMove<Item> = {
  item: Item;
  from: SortablePosition;
  to: SortablePosition;
};

export type SortableChangeDetails<Item> = SortableMove<Item> & {
  reason: SortableReason;
};

export type SortableActive<Item> = SortableChangeDetails<Item> & {
  id: string;
  /** The container that refused the item while it is over it, if any. */
  refused: string | null;
};

export type SortableEvent<Item> = SortableChangeDetails<Item> & {
  type: "start" | "move" | "drop" | "cancel" | "refuse";
  /** The value at the moment of the event, with the item at `to`. */
  value: SortableValue<Item>;
};

export type SortableRef = (
  element: HTMLElement | null,
) => undefined | (() => void);

export type SortableProps = React.HTMLAttributes<HTMLElement> & {
  "data-dragging"?: "";
  "data-drop-refused"?: "";
  "data-drop-target"?: "";
  ref?: SortableRef;
};

/** The item type of a value, for example `Task` for `{ todo: Task[] }`. */
export type SortableItem<Value extends SortableValue<unknown>> =
  Value[keyof Value][number];

export type UseSortableOptions<Value extends SortableValue<unknown>> = {
  /** Items per container, in order. Controlled. */
  value?: Value;
  /** Initial items per container when uncontrolled. */
  defaultValue?: Value;
  /** Called once per completed move, on drop. */
  onValueChange?: (
    value: Value,
    details: SortableChangeDetails<SortableItem<Value>>,
  ) => void;
  /** Defaults to the item for strings and numbers, or its `id`. */
  getItemId?: (item: SortableItem<Value>) => string;
  /** Name of an item in announcements. Defaults to its id. */
  getItemLabel?: (item: SortableItem<Value>) => string;
  /** Name of a container in announcements. Defaults to its key. */
  getContainerLabel?: (container: string) => string;
  /** Return `false` to refuse a move, for example into a full column. */
  canMove?: (move: SortableMove<SortableItem<Value>>) => boolean;
  /** Direction items flow inside a container. Defaults to `"vertical"`. */
  orientation?: SortableOrientation;
  /**
   * Where a drag can start. `"item"`: anywhere on the item. `"handle"`: only
   * from `getHandleProps`. `"both"`: mouse and touch from anywhere, keyboard
   * from the handle. Defaults to `"item"`.
   */
  dragFrom?: "item" | "handle" | "both";
  disabled?: boolean;
  /** Scroll near the edges while dragging. Defaults to `true`. */
  autoScroll?: boolean;
  /** Keyboard instructions for screen readers. */
  instructions?: string;
  /** Custom announcements. Return `undefined` to stay silent. */
  getAnnouncement?: (
    event: SortableEvent<SortableItem<Value>>,
  ) => string | undefined;
};

export type UseSortableReturn<Value extends SortableValue<unknown>> = {
  /** The value to render. While dragging, it shows the item at its new place. */
  value: Value & SortableValue<SortableItem<Value>>;
  active: SortableActive<SortableItem<Value>> | null;
  getContainerProps: (container: string) => SortableProps;
  getItemProps: (item: SortableItem<Value>) => SortableProps;
  getHandleProps: (item: SortableItem<Value>) => SortableProps;
  getOverlayProps: () => SortableProps;
  getAnnouncerProps: () => SortableProps;
};

export function moveSortableItem<Item>(
  value: SortableValue<Item>,
  from: SortablePosition,
  to: SortablePosition,
): SortableValue<Item> {
  const source = value[from.container];
  const destination = value[to.container];
  if (!source || !destination || samePosition(from, to)) return value;
  if (from.index < 0 || from.index >= source.length) return value;

  const nextSource = source.filter((_, index) => index !== from.index);
  const nextDestination =
    from.container === to.container ? nextSource : [...destination];
  const index = Math.max(0, Math.min(to.index, nextDestination.length));
  nextDestination.splice(index, 0, source[from.index] as Item);

  return {
    ...value,
    [from.container]: nextSource,
    [to.container]: nextDestination,
  };
}

export function getSortableKeyboardTarget<Item>(
  value: SortableValue<Item>,
  position: SortablePosition,
  key: string,
  options: {
    canMoveTo?: (position: SortablePosition) => boolean;
    /** Container keys in the order they appear. Defaults to the key order. */
    containers?: readonly string[];
    direction?: "ltr" | "rtl";
    /** Items per row when `orientation` is `"grid"`. */
    gridColumns?: number;
    orientation?: SortableOrientation;
  } = {},
): SortablePosition | null {
  const {
    canMoveTo = (): boolean => true,
    containers = Object.keys(value),
    direction = "ltr",
    gridColumns = 1,
    orientation = "vertical",
  } = options;
  const list = value[position.container];
  if (!list) return null;

  const [left, right] =
    direction === "rtl"
      ? ["ArrowRight", "ArrowLeft"]
      : ["ArrowLeft", "ArrowRight"];
  const vertical = orientation === "vertical";
  const [previous, next] = vertical ? ["ArrowUp", "ArrowDown"] : [left, right];
  const [before, after] = vertical ? [left, right] : ["ArrowUp", "ArrowDown"];

  const within = (index: number): SortablePosition | null => {
    const target = { container: position.container, index };
    const valid = index >= 0 && index < list.length && index !== position.index;
    return valid && canMoveTo(target) ? target : null;
  };

  if (orientation === "grid") {
    const columns = Math.max(1, gridColumns);
    const row = Math.floor(position.index / columns);
    const lastRow = Math.floor((list.length - 1) / columns);
    if (key === "ArrowUp") return within(position.index - columns);
    if (key === "ArrowDown") {
      if (row >= lastRow) return null;
      return within(Math.min(position.index + columns, list.length - 1));
    }
  }

  if (key === previous) return within(position.index - 1);
  if (key === next) return within(position.index + 1);
  if (key === "Home") return within(0);
  if (key === "End") return within(list.length - 1);
  if (orientation === "grid" || (key !== before && key !== after)) return null;

  const step = key === before ? -1 : 1;
  for (
    let index = containers.indexOf(position.container) + step;
    index >= 0 && index < containers.length;
    index += step
  ) {
    const container = containers[index] as string;
    const length = value[container]?.length ?? 0;
    const target = { container, index: Math.min(position.index, length) };
    if (canMoveTo(target)) return target;
  }
  return null;
}

export function useSortable<Value extends SortableValue<unknown>>(
  options: UseSortableOptions<Value>,
): UseSortableReturn<Value> {
  type Item = SortableItem<Value>;
  const {
    value: valueProp,
    defaultValue,
    getItemId = defaultGetItemId as (item: Item) => string,
    dragFrom = "item",
    disabled = false,
    instructions = DEFAULT_INSTRUCTIONS,
  } = options;
  const handle = dragFrom !== "item";
  const dragFromItem = dragFrom === "both";

  const [uncontrolledValue, setUncontrolledValue] = useState<
    SortableValue<Item>
  >(() => (defaultValue ?? {}) as SortableValue<Item>);
  const committed =
    (valueProp as SortableValue<Item> | undefined) ?? uncontrolledValue;
  const [drag, setDrag] = useState<Drag<Item> | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const instructionsId = useId();

  const preview = useMemo(
    (): SortableValue<Item> =>
      drag ? moveById(committed, drag.id, drag.to, getItemId) : committed,
    [committed, drag, getItemId],
  );

  const latest = useRef<Latest<Value>>(null as unknown as Latest<Value>);
  latest.current = { committed, getItemId, options, preview };
  const dragRef = useRef<Drag<Item> | null>(null);
  const focusRef = useRef<string | null>(null);
  const overlayRef = useRef<HTMLElement | null>(null);
  const refs = useRef(new Map<string, SortableRef>()).current;
  const elements = useRef({
    container: new Map<string, HTMLElement>(),
    handle: new Map<string, HTMLElement>(),
    item: new Map<string, HTMLElement>(),
  }).current;

  const [controller] = useState(() => {
    let session: Session | null = null;
    let frame = 0;
    let dragStyle: HTMLStyleElement | null = null;

    const setDragState = (next: Drag<Item> | null): void => {
      dragRef.current = next;
      setDrag(next);
      if (dragStyle && next?.pointer) {
        const cursor = next.refused ? "not-allowed" : "grabbing";
        dragStyle.textContent = `*, *::before, *::after { cursor: ${cursor} !important; user-select: none !important; -webkit-user-select: none !important; }`;
      }
    };

    const isAllowed = (current: Drag<Item>, to: SortablePosition): boolean => {
      const { canMove } = latest.current.options;
      return (
        !canMove ||
        samePosition(current.from, to) ||
        canMove({ from: current.from, item: current.item, to })
      );
    };

    const announce = (
      type: SortableEvent<Item>["type"],
      current: Drag<Item>,
      to: SortablePosition,
      value: SortableValue<Item>,
    ): void => {
      const { getItemId, options } = latest.current;
      const { from, item, reason } = current;
      const count = value[to.container]?.length ?? 0;
      const container =
        options.getContainerLabel?.(to.container) ?? to.container;
      const message = options.getAnnouncement
        ? options.getAnnouncement({ from, item, reason, to, type, value })
        : getMessage(
            type,
            (options.getItemLabel ?? getItemId)(item),
            `position ${to.index + 1} of ${count} in ${container}`,
            container,
          );
      if (!message) return;
      setAnnouncement((previous) =>
        previous === message ? `${message} ` : message,
      );
    };

    const begin = (id: string, reason: SortableReason): Drag<Item> | null => {
      const { committed, getItemId } = latest.current;
      const from = locate(committed, id, getItemId);
      if (!from) return null;
      const item = committed[from.container]?.[from.index] as Item;
      return { from, id, item, reason, refused: null, to: from };
    };

    const finish = (commit: boolean): void => {
      const current = dragRef.current;
      if (!current) return;
      const { committed, getItemId, options } = latest.current;
      const from = locate(committed, current.id, getItemId);
      setDragState(null);
      if (!from) return;
      const moved = commit && !samePosition(from, current.to);
      const next = moved
        ? moveSortableItem(committed, from, current.to)
        : committed;
      if (moved) {
        if (options.value === undefined) setUncontrolledValue(next);
        const { item, reason, to } = current;
        options.onValueChange?.(next as unknown as Value, {
          from,
          item,
          reason,
          to,
        });
      }
      announce(
        commit ? "drop" : "cancel",
        current,
        moved ? current.to : from,
        next,
      );
    };

    const update = (): void => {
      const current = dragRef.current;
      if (!current?.pointer || !session) return;
      const { grab, height, width } = current.pointer;
      const { x, y } = session.point;
      if (overlayRef.current) {
        overlayRef.current.style.transform = `translate3d(${x - grab.x}px, ${y - grab.y}px, 0)`;
      }

      const { getItemId, options, preview } = latest.current;
      let target: [string, HTMLElement] | undefined;
      let smallest = Number.POSITIVE_INFINITY;
      for (const [key, element] of elements.container) {
        const rect = element.getBoundingClientRect();
        const area = rect.width * rect.height;
        if (
          key in preview &&
          isInside(rect, session.point) &&
          area < smallest
        ) {
          target = [key, element];
          smallest = area;
        }
      }
      if (!target) {
        if (current.refused) setDragState({ ...current, refused: null });
        return;
      }

      const [container, element] = target;
      const orientation = options.orientation ?? "vertical";
      const reversed = orientation !== "vertical" && isRtl(element);
      const centerX = x - grab.x + width / 2;
      const centerY = y - grab.y + height / 2;
      const isBefore = (rect: DOMRect): boolean => {
        const middleX = rect.left + rect.width / 2;
        const leading = reversed ? middleX > centerX : middleX < centerX;
        if (orientation === "vertical") {
          return rect.top + rect.height / 2 < centerY;
        }
        if (orientation === "horizontal") return leading;
        return (
          rect.bottom < centerY ||
          (rect.top <= centerY && centerY <= rect.bottom && leading)
        );
      };
      // Count positions among all items, so lists that only render the
      // visible part (virtualized) still get the right index.
      let lastBefore = -1;
      let firstAfter = -1;
      let position = 0;
      for (const item of preview[container] ?? []) {
        const id = getItemId(item);
        if (id === current.id) continue;
        const rect = elements.item.get(id)?.getBoundingClientRect();
        if (rect && isBefore(rect)) lastBefore = position;
        else if (rect && firstAfter === -1) firstAfter = position;
        position++;
      }
      const index =
        lastBefore !== -1 ? lastBefore + 1 : Math.max(firstAfter, 0);

      const to = { container, index };
      const same = samePosition(to, current.to);
      if (same || isAllowed(current, to)) {
        if (!same || current.refused) {
          setDragState({ ...current, refused: null, to });
        }
      } else if (current.refused !== container) {
        setDragState({ ...current, refused: container });
        announce("refuse", current, to, preview);
      }
    };

    const tick = (): void => {
      frame = 0;
      if (!dragRef.current?.pointer || !session) return;
      const scrolled =
        latest.current.options.autoScroll !== false &&
        scrollNearEdges(session.point);
      update();
      if (scrolled) schedule();
    };

    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const preventTouchScroll = (event: TouchEvent): void => {
      if (dragRef.current?.reason === "pointer") event.preventDefault();
    };

    const endSession = (): void => {
      if (!session) return;
      clearTimeout(session.timer);
      session.element.removeEventListener("touchmove", preventTouchScroll);
      for (const type of WINDOW_EVENTS) {
        window.removeEventListener(type, onWindowEvent, true);
      }
      cancelAnimationFrame(frame);
      frame = 0;
      session = null;
      if (!dragStyle) return;
      dragStyle.remove();
      dragStyle = null;
      const stopClick = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
      };
      window.addEventListener("click", stopClick, {
        capture: true,
        once: true,
      });
      setTimeout(() => window.removeEventListener("click", stopClick, true), 0);
    };

    const activate = (): void => {
      if (!session) return;
      const current = begin(session.id, "pointer");
      if (!current) {
        endSession();
        return;
      }
      const element = elements.item.get(session.id) ?? session.element;
      const rect = element.getBoundingClientRect();
      const grab = {
        x: session.start.x - rect.left,
        y: session.start.y - rect.top,
      };
      dragStyle = document.createElement("style");
      document.head.append(dragStyle);
      window.getSelection()?.removeAllRanges();
      const next: Drag<Item> = {
        ...current,
        pointer: {
          grab,
          height: rect.height,
          origin: { x: session.point.x - grab.x, y: session.point.y - grab.y },
          width: rect.width,
        },
      };
      setDragState(next);
      announce("start", next, next.from, latest.current.committed);
      schedule();
    };

    function onWindowEvent(event: Event): void {
      if (!session) return;
      const dragging = dragRef.current?.reason === "pointer";
      switch (event.type) {
        case "scroll":
          if (dragging) schedule();
          return;
        case "selectstart":
        case "contextmenu":
          if (dragging || session.touch) event.preventDefault();
          return;
        case "dragstart":
          event.preventDefault();
          return;
        case "keydown":
          if (dragging && (event as KeyboardEvent).key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            finish(false);
            endSession();
          }
          return;
      }

      const pointer = event as PointerEvent;
      if (pointer.pointerId !== session.pointerId) return;
      session.point = { x: pointer.clientX, y: pointer.clientY };
      if (event.type === "pointermove") {
        const { point, start, touch } = session;
        const distance = Math.hypot(point.x - start.x, point.y - start.y);
        if (dragging) schedule();
        else if (distance > (touch ? TOUCH_TOLERANCE : DRAG_DISTANCE)) {
          if (touch) endSession();
          else activate();
        }
        return;
      }
      if (dragging) {
        if (event.type === "pointerup") update();
        finish(event.type === "pointerup");
      }
      endSession();
    }

    const onPointerDown = (
      event: React.PointerEvent<HTMLElement>,
      id: string,
      ignore: string,
    ): void => {
      const element = event.currentTarget;
      const ignored = (event.target as Element).closest?.(ignore);
      if (
        claimedEvents.has(event.nativeEvent) ||
        latest.current.options.disabled ||
        session ||
        dragRef.current ||
        !event.isPrimary ||
        event.button !== 0 ||
        (ignored && ignored !== element && element.contains(ignored))
      ) {
        return;
      }
      claimedEvents.add(event.nativeEvent);
      const start = { x: event.clientX, y: event.clientY };
      const touch = event.pointerType === "touch";
      session = {
        element,
        id,
        point: start,
        pointerId: event.pointerId,
        start,
        touch,
      };
      for (const type of WINDOW_EVENTS) {
        window.addEventListener(type, onWindowEvent, true);
      }
      if (touch) {
        element.addEventListener("touchmove", preventTouchScroll, {
          passive: false,
        });
        session.timer = setTimeout(activate, TOUCH_DELAY);
      }
    };

    const countGridColumns = (list: readonly Item[]): number => {
      const { getItemId } = latest.current;
      let top: number | undefined;
      let count = 0;
      for (const item of list) {
        const rect = elements.item
          .get(getItemId(item))
          ?.getBoundingClientRect();
        if (!rect) continue;
        top ??= rect.top;
        if (Math.abs(rect.top - top) > 1) break;
        count++;
      }
      return Math.max(count, 1);
    };

    const onKeyDown = (
      event: React.KeyboardEvent<HTMLElement>,
      id: string,
    ): void => {
      const current = dragRef.current;
      const toggle = event.key === " " || event.key === "Enter";
      if (latest.current.options.disabled) return;

      if (!current) {
        if (!toggle || event.repeat || event.target !== event.currentTarget) {
          return;
        }
        event.preventDefault();
        const next = begin(id, "keyboard");
        if (!next) return;
        focusRef.current = id;
        setDragState(next);
        announce("start", next, next.from, latest.current.committed);
        return;
      }

      if (current.reason !== "keyboard" || current.id !== id) return;
      if (toggle || event.key === "Escape" || event.key === "Tab") {
        event.preventDefault();
        if (event.key === "Escape") finish(false);
        else if (toggle && !event.repeat) finish(true);
        return;
      }

      const { committed, getItemId, options } = latest.current;
      const value = moveById(committed, id, current.to, getItemId);
      const containers = Object.keys(value).sort((a, b) => {
        const first = elements.container.get(a);
        const second = elements.container.get(b);
        if (!first || !second) return Number(!first) - Number(!second);
        return first.compareDocumentPosition(second) &
          Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1;
      });
      let rejected = null as SortablePosition | null;
      const to = getSortableKeyboardTarget(value, current.to, event.key, {
        canMoveTo: (target: SortablePosition): boolean => {
          const allowed = isAllowed(current, target);
          if (!allowed && !rejected) rejected = target;
          return allowed;
        },
        containers,
        direction: isRtl(event.currentTarget) ? "rtl" : "ltr",
        gridColumns: countGridColumns(value[current.to.container] ?? []),
        orientation: options.orientation,
      });
      if (
        to ||
        event.key.startsWith("Arrow") ||
        ["Home", "End"].includes(event.key)
      ) {
        event.preventDefault();
      }
      if (to) {
        setDragState({ ...current, refused: null, to });
        announce("move", current, to, moveById(committed, id, to, getItemId));
      } else if (rejected) {
        setDragState({ ...current, refused: rejected.container });
        announce("refuse", current, rejected, value);
      }
    };

    const setOverlay: SortableRef = (element: HTMLElement | null) => {
      overlayRef.current = element;
      return () => {
        if (overlayRef.current === element) overlayRef.current = null;
      };
    };

    return {
      dispose: endSession,
      finish,
      onKeyDown,
      onPointerDown,
      setOverlay,
    };
  });

  const getRef = (kind: keyof typeof elements, key: string): SortableRef => {
    const cacheKey = `${kind}:${key}`;
    let ref = refs.get(cacheKey);
    if (!ref) {
      const map = elements[kind];
      ref = (element: HTMLElement | null): ReturnType<SortableRef> => {
        if (!element) return;
        map.set(key, element);
        return () => {
          if (map.get(key) === element) map.delete(key);
        };
      };
      refs.set(cacheKey, ref);
    }
    return ref;
  };

  useEffect(() => controller.dispose, [controller]);

  useEffect(() => {
    const current = dragRef.current;
    if (current && (disabled || !locate(committed, current.id, getItemId))) {
      controller.finish(false);
    }
  }, [committed, controller, disabled, getItemId]);

  const keyboardDragging = drag?.reason === "keyboard";
  useEffect(() => {
    if (!keyboardDragging) return;
    const cancel = (): void => controller.finish(false);
    window.addEventListener("pointerdown", cancel, true);
    return () => window.removeEventListener("pointerdown", cancel, true);
  }, [controller, keyboardDragging]);

  useIsoLayoutEffect(() => {
    const id = focusRef.current;
    const element = id && elements[handle ? "handle" : "item"].get(id);
    if (!element) return;
    if (document.activeElement !== element) {
      element.focus({ preventScroll: true });
    }
    element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    if (!dragRef.current) focusRef.current = null;
  }, [drag, elements, handle, preview]);

  const getProps = (item: Item, kind: "item" | "handle"): SortableProps => {
    const id = getItemId(item);
    const dragging = drag?.id === id;
    const props: SortableProps = {
      "data-dragging": dragging ? "" : undefined,
      "data-drop-refused": dragging && drag?.refused ? "" : undefined,
      ref: getRef(kind, id),
    };
    if (kind === "item" && handle) {
      if (!dragFromItem) return props;
      return {
        ...props,
        onPointerDown: (event: React.PointerEvent<HTMLElement>): void =>
          controller.onPointerDown(event, id, FIELD_SELECTOR),
        style: { WebkitTouchCallout: "none" },
      };
    }
    return {
      ...props,
      "aria-describedby": instructionsId,
      "aria-disabled": disabled || undefined,
      "aria-pressed":
        dragging && drag?.reason === "keyboard" ? true : undefined,
      "aria-roledescription": "sortable",
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>): void =>
        controller.onKeyDown(event, id),
      onPointerDown: (event: React.PointerEvent<HTMLElement>): void =>
        controller.onPointerDown(event, id, IGNORE_SELECTOR),
      role: "button",
      style: {
        touchAction: handle ? "none" : undefined,
        WebkitTouchCallout: "none",
      },
      tabIndex: disabled ? -1 : 0,
    };
  };

  return {
    active: drag,
    getAnnouncerProps: (): SortableProps => ({
      children: [
        createElement(
          "span",
          { id: instructionsId, key: "instructions" },
          instructions,
        ),
        createElement(
          "span",
          {
            "aria-atomic": true,
            "aria-live": "assertive",
            key: "announcement",
            role: "status",
          },
          announcement,
        ),
      ],
      style: visuallyHidden,
    }),
    getContainerProps: (container: string): SortableProps => ({
      "data-drop-refused": drag?.refused === container ? "" : undefined,
      "data-drop-target": drag?.to.container === container ? "" : undefined,
      ref: getRef("container", container),
    }),
    getHandleProps: (item: Item): SortableProps => getProps(item, "handle"),
    getItemProps: (item: Item): SortableProps => getProps(item, "item"),
    getOverlayProps: (): SortableProps => {
      const pointer = drag?.pointer;
      return {
        "aria-hidden": true,
        "data-drop-refused": drag?.refused ? "" : undefined,
        ref: controller.setOverlay,
        inert: true,
        style: pointer
          ? {
              boxSizing: "border-box",
              height: pointer.height,
              left: 0,
              pointerEvents: "none",
              position: "fixed",
              top: 0,
              transform: `translate3d(${pointer.origin.x}px, ${pointer.origin.y}px, 0)`,
              width: pointer.width,
            }
          : { display: "none" },
      };
    },
    value: preview as unknown as Value & SortableValue<Item>,
  };
}
