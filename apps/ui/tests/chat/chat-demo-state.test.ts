import { describe, expect, it } from "bun:test";
import type {
  ChatMessage,
  ChatReaction,
} from "../../registry/default/chat-demo/chat-demo-state";
import {
  deleteChatMessage,
  getMessageDeletionReason,
  getMessagePreview,
  getTypingLabel,
  INITIAL_CHAT_MESSAGES,
  toggleReaction,
} from "../../registry/default/chat-demo/chat-demo-state";

describe("chat demo message deletion", () => {
  const memberMessage: ChatMessage = {
    id: 100,
    author: "alex",
    text: "See you soon!",
    dateLabel: "Today",
    time: "10:48",
    reactions: [],
  };

  it.each([
    "maya",
    "jordan",
    "you",
  ] as const)("allows %s to moderate a member message", (viewer) => {
    expect(getMessageDeletionReason(memberMessage, viewer)).toBe("moderator");
  });

  it.each([
    "maya",
    "jordan",
    "alex",
    "you",
  ] as const)("lets %s delete their own messages and protects other hosts and co-hosts", (viewer) => {
    for (const message of INITIAL_CHAT_MESSAGES) {
      const reason = getMessageDeletionReason(message, viewer);
      if (message.author === viewer) expect(reason).toBe("sender");
      else if (message.author !== "alex" || viewer === "alex")
        expect(reason).toBeUndefined();
    }
  });

  it("erases a moderated message and its reactions while retaining its position and identity", () => {
    const original = {
      ...memberMessage,
      reactions: [{ emoji: "❤️", members: ["you" as const] }],
    };
    const deleted = deleteChatMessage(original);
    expect(deleted).toEqual({
      ...original,
      text: "",
      reactions: [],
      deletedReason: "moderator",
    });
    expect(getMessagePreview(deleted)).toBe("Removed by a host");
    expect(getMessageDeletionReason(deleted)).toBeUndefined();
    expect(original.text).toBe(memberMessage.text);
    expect(original.reactions).toHaveLength(1);
  });

  it("uses the sender placeholder for self-deletion and leaves protected messages unchanged", () => {
    expect(getMessagePreview(deleteChatMessage(memberMessage, "alex"))).toBe(
      "Message deleted",
    );
    const protectedMessage = INITIAL_CHAT_MESSAGES[0];
    if (!protectedMessage) throw new Error("Expected an initial message");
    expect(deleteChatMessage(protectedMessage)).toBe(protectedMessage);
  });
});

describe("chat demo reactions", () => {
  it("preserves other members’ reactions when adding and removing your own", () => {
    const initial: ChatReaction[] = [{ emoji: "❤️", members: ["maya", "alex"] }];
    const reacted = toggleReaction(initial, "❤️");
    expect(reacted).toEqual([{ emoji: "❤️", members: ["maya", "alex", "you"] }]);
    expect(toggleReaction(reacted, "❤️")).toEqual(initial);
    expect(initial[0]?.members).toEqual(["maya", "alex"]);
  });

  it("removes an empty reaction without removing other emoji", () => {
    const heart: ChatReaction[] = [{ emoji: "❤️", members: ["maya", "alex"] }];
    const reacted = toggleReaction(heart, "🎉");
    expect(reacted).toHaveLength(2);
    expect(toggleReaction(reacted, "🎉")).toEqual(heart);
  });
});

describe("chat demo typing labels", () => {
  it("names one or two people and counts larger groups", () => {
    expect(getTypingLabel(["maya"])).toBe("Maya is typing");
    expect(getTypingLabel(["maya", "jordan"])).toBe(
      "Maya and Jordan are typing",
    );
    expect(getTypingLabel(["maya", "jordan", "alex"])).toBe(
      "Maya and 2 others are typing",
    );
  });
});
