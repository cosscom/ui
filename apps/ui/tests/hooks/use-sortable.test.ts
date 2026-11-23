import { describe, expect, it } from "bun:test";
import {
  getSortableKeyboardTarget,
  moveSortableItem,
} from "../../registry/default/hooks/use-sortable";

const board = {
  todo: ["a", "b", "c"],
  doing: ["d"],
  done: [] as string[],
};

describe("moveSortableItem", () => {
  it("moves an item forward within a container", () => {
    const next = moveSortableItem(
      board,
      { container: "todo", index: 0 },
      { container: "todo", index: 2 },
    );
    expect(next.todo).toEqual(["b", "c", "a"]);
  });

  it("moves an item backward within a container", () => {
    const next = moveSortableItem(
      board,
      { container: "todo", index: 2 },
      { container: "todo", index: 0 },
    );
    expect(next.todo).toEqual(["c", "a", "b"]);
  });

  it("moves an item to another container", () => {
    const next = moveSortableItem(
      board,
      { container: "todo", index: 1 },
      { container: "doing", index: 0 },
    );
    expect(next.todo).toEqual(["a", "c"]);
    expect(next.doing).toEqual(["b", "d"]);
  });

  it("moves an item into an empty container", () => {
    const next = moveSortableItem(
      board,
      { container: "doing", index: 0 },
      { container: "done", index: 0 },
    );
    expect(next.doing).toEqual([]);
    expect(next.done).toEqual(["d"]);
  });

  it("clamps the target index to the container size", () => {
    const next = moveSortableItem(
      board,
      { container: "todo", index: 0 },
      { container: "doing", index: 10 },
    );
    expect(next.doing).toEqual(["d", "a"]);
  });

  it("returns the same value when nothing moves", () => {
    expect(
      moveSortableItem(
        board,
        { container: "todo", index: 1 },
        { container: "todo", index: 1 },
      ),
    ).toBe(board);
    expect(
      moveSortableItem(
        board,
        { container: "todo", index: 5 },
        { container: "doing", index: 0 },
      ),
    ).toBe(board);
    expect(
      moveSortableItem(
        board,
        { container: "todo", index: 0 },
        { container: "missing", index: 0 },
      ),
    ).toBe(board);
  });

  it("does not mutate the input", () => {
    const value = { list: ["a", "b"] };
    moveSortableItem(
      value,
      { container: "list", index: 0 },
      { container: "list", index: 1 },
    );
    expect(value.list).toEqual(["a", "b"]);
  });
});

describe("getSortableKeyboardTarget", () => {
  it("moves up and down within a vertical container", () => {
    const position = { container: "todo", index: 1 };
    expect(getSortableKeyboardTarget(board, position, "ArrowDown")).toEqual({
      container: "todo",
      index: 2,
    });
    expect(getSortableKeyboardTarget(board, position, "ArrowUp")).toEqual({
      container: "todo",
      index: 0,
    });
  });

  it("stops at the ends of a container", () => {
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "todo", index: 0 },
        "ArrowUp",
      ),
    ).toBeNull();
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "todo", index: 2 },
        "ArrowDown",
      ),
    ).toBeNull();
  });

  it("jumps to the start and end with Home and End", () => {
    const position = { container: "todo", index: 1 };
    expect(getSortableKeyboardTarget(board, position, "Home")).toEqual({
      container: "todo",
      index: 0,
    });
    expect(getSortableKeyboardTarget(board, position, "End")).toEqual({
      container: "todo",
      index: 2,
    });
  });

  it("moves to the next and previous container, keeping the index in range", () => {
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "todo", index: 2 },
        "ArrowRight",
      ),
    ).toEqual({ container: "doing", index: 1 });
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "doing", index: 0 },
        "ArrowLeft",
      ),
    ).toEqual({ container: "todo", index: 0 });
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "done", index: 0 },
        "ArrowRight",
      ),
    ).toBeNull();
  });

  it("skips containers that refuse the item", () => {
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "todo", index: 0 },
        "ArrowRight",
        { canMoveTo: (target) => target.container !== "doing" },
      ),
    ).toEqual({ container: "done", index: 0 });
  });

  it("follows the given container order instead of the key order", () => {
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "done", index: 0 },
        "ArrowRight",
        { containers: ["done", "todo", "doing"] },
      ),
    ).toEqual({ container: "todo", index: 0 });
  });

  it("moves by rows in a grid", () => {
    const tiles = { grid: ["a", "b", "c", "d", "e", "f", "g"] };
    const grid = { gridColumns: 3, orientation: "grid" as const };
    const at = (index: number) => ({ container: "grid", index });
    expect(getSortableKeyboardTarget(tiles, at(1), "ArrowDown", grid)).toEqual(
      at(4),
    );
    expect(getSortableKeyboardTarget(tiles, at(4), "ArrowUp", grid)).toEqual(
      at(1),
    );
    expect(getSortableKeyboardTarget(tiles, at(5), "ArrowDown", grid)).toEqual(
      at(6),
    );
    expect(
      getSortableKeyboardTarget(tiles, at(6), "ArrowDown", grid),
    ).toBeNull();
    expect(getSortableKeyboardTarget(tiles, at(2), "ArrowRight", grid)).toEqual(
      at(3),
    );
  });

  it("mirrors left and right in right-to-left layouts", () => {
    expect(
      getSortableKeyboardTarget(
        board,
        { container: "doing", index: 0 },
        "ArrowLeft",
        { direction: "rtl" },
      ),
    ).toEqual({ container: "done", index: 0 });
  });

  it("swaps the axes for horizontal containers", () => {
    const rows = { first: ["a", "b"], second: ["c"] };
    expect(
      getSortableKeyboardTarget(
        rows,
        { container: "first", index: 0 },
        "ArrowRight",
        { orientation: "horizontal" },
      ),
    ).toEqual({ container: "first", index: 1 });
    expect(
      getSortableKeyboardTarget(
        rows,
        { container: "first", index: 1 },
        "ArrowDown",
        { orientation: "horizontal" },
      ),
    ).toEqual({ container: "second", index: 1 });
  });
});
