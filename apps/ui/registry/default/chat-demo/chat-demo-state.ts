export type MemberId = "maya" | "jordan" | "alex" | "you";

export const CHAT_MEMBERS = {
  maya: {
    role: "host",
    name: "Maya Chen",
    handle: "Maya",
    initials: "MC",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  },
  jordan: {
    role: "co-host",
    name: "Jordan Lee",
    handle: "Jordan",
    initials: "JL",
    color:
      "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  },
  alex: {
    role: "guest",
    name: "Alex Morgan",
    handle: "Alex",
    initials: "AM",
    color: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  },
  you: {
    role: "co-host",
    name: "Sam Rivera",
    handle: "You",
    initials: "SR",
    color: "bg-primary text-primary-foreground",
  },
} satisfies Record<
  MemberId,
  {
    role: "host" | "co-host" | "guest";
    name: string;
    handle: string;
    initials: string;
    color: string;
  }
>;

export const OTHER_MEMBERS: MemberId[] = ["maya", "jordan", "alex"];

export function getTypingLabel(members: readonly MemberId[]): string {
  const [first, second] = members;
  if (!first) return "";
  const firstName = CHAT_MEMBERS[first].handle;
  if (members.length === 1) return `${firstName} is typing`;
  if (members.length === 2 && second)
    return `${firstName} and ${CHAT_MEMBERS[second].handle} are typing`;
  return `${firstName} and ${members.length - 1} others are typing`;
}

export const CHAT_EMOJI = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Surprised" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🙏", label: "Thanks" },
];

export type ChatReaction = { emoji: string; members: MemberId[] };
export type ChatReceipt = {
  member: MemberId;
  deliveredAt?: string;
  readAt?: string;
};
export type ChatMessage = {
  id: number;
  author: MemberId;
  text: string;
  dateLabel: string;
  time: string;
  replyTo?: number;
  reactions: ChatReaction[];
  deletedReason?: "sender" | "moderator";
  forwarded?: boolean;
  receipts?: ChatReceipt[];
  delivery?: "sending" | "sent" | "delivered" | "read" | "failed";
};

export function getMessageDeletionReason(
  message: ChatMessage,
  viewer: MemberId = "you",
): ChatMessage["deletedReason"] {
  if (message.deletedReason) return undefined;
  if (message.author === viewer) return "sender";
  if (
    CHAT_MEMBERS[viewer].role !== "guest" &&
    CHAT_MEMBERS[message.author].role === "guest"
  ) {
    return "moderator";
  }
  return undefined;
}

export function deleteChatMessage(
  message: ChatMessage,
  viewer: MemberId = "you",
): ChatMessage {
  const deletedReason = getMessageDeletionReason(message, viewer);
  if (!deletedReason) return message;
  return { ...message, text: "", reactions: [], deletedReason };
}

export function getMessagePreview(message: ChatMessage): string {
  if (message.deletedReason === "moderator") return "Removed by a host";
  if (message.deletedReason === "sender") return "Message deleted";
  return message.text;
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    author: "maya",
    text: "The new direction is ready for a first look.",
    dateLabel: "Thursday, September 10",
    time: "10:42",
    reactions: [],
    forwarded: true,
  },
  {
    id: 2,
    author: "maya",
    text: "Would love your eyes on the little details before we share it.",
    dateLabel: "Friday, September 11",
    time: "10:42",
    reactions: [],
  },
  {
    id: 3,
    author: "jordan",
    text: "Much calmer. The spacing makes all the difference ✨",
    dateLabel: "Friday, September 11",
    time: "10:44",
    reactions: [{ emoji: "❤️", members: ["maya", "alex"] }],
  },
  {
    id: 4,
    author: "you",
    text: "Agreed. Everything has a little more room to breathe.",
    dateLabel: "Today",
    time: "10:46",
    reactions: [],
    delivery: "read",
  },
  {
    id: 5,
    author: "alex",
    text: "Quick walkthrough at 2? @You would love your take on the final flow.",
    dateLabel: "Today",
    time: "10:48",
    reactions: [],
  },
  {
    id: 6,
    author: "you",
    text: "Sounds good — see you then.",
    dateLabel: "Today",
    time: "10:49",
    replyTo: 5,
    reactions: [{ emoji: "👍", members: ["jordan"] }],
    receipts: [
      { member: "maya", deliveredAt: "10:49", readAt: "10:50" },
      { member: "jordan", deliveredAt: "10:49" },
      { member: "alex" },
    ],
  },
  {
    id: 7,
    author: "maya",
    text: "Perfect. I’ll bring the coffee ☕",
    dateLabel: "Today",
    time: "10:50",
    reactions: [],
  },
  {
    id: 9,
    author: "jordan",
    text: "See you at two. I’ll bring the notes.",
    dateLabel: "Today",
    time: "10:51",
    replyTo: 6,
    reactions: [],
  },
];

const LONG_CHAT_MESSAGE: ChatMessage = {
  id: 8,
  author: "maya",
  text: [
    "I wrote down the full walkthrough so everyone can review it before we meet. First, we’ll look at the event page as a guest and make sure the date, location, and group details are easy to find. Then we’ll open the chat and check that the conversation feels useful without taking over the page.",
    "After that, let’s try a few everyday situations: catching up on older messages, replying to a specific note, mentioning someone, and finding a pinned update. I’d also like us to check what happens when several people are typing and when a message takes a moment to send.",
    "Finally, we should look at the narrow layout together. The drawer needs to leave enough room for actions beside each bubble, keep the composer comfortable to use, and make long notes like this one easy to skim. If anything feels crowded, we can simplify it before sharing the pattern with other teams.",
    "One more thing for the review: please try the same conversation with a few messages arriving while the drawer is open. We should check whether the reading position stays predictable, whether the latest message control is easy to find, and whether the date markers still make sense as we move through older parts of the conversation. If you notice any confusing transitions, leave a note so we can refine the behavior before this pattern is reused elsewhere in the app.",
  ].join("\n\n"),
  dateLabel: "Today",
  time: "10:52",
  reactions: [],
};

export function toggleReaction(
  reactions: ChatReaction[],
  emoji: string,
): ChatReaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji);
  if (!existing) return [...reactions, { emoji, members: ["you"] }];
  return reactions.flatMap((reaction) => {
    if (reaction.emoji !== emoji) return [reaction];
    const members: MemberId[] = reaction.members.includes("you")
      ? reaction.members.filter((member) => member !== "you")
      : [...reaction.members, "you"];
    if (members.length === 0) return [];
    return [{ ...reaction, members }];
  });
}

export const CHAT_SCENARIOS = [
  { value: "conversation", label: "Conversation" },
  { value: "long-message", label: "Long message" },
  { value: "pinned", label: "Pinned message" },
  { value: "typing", label: "Someone typing" },
  { value: "typing-multiple", label: "Multiple people typing" },
  { value: "empty", label: "First message" },
  { value: "loading", label: "Loading conversation" },
  { value: "error", label: "History error" },
  { value: "offline", label: "Disconnected" },
  { value: "access-lost", label: "Access lost" },
  { value: "removed", label: "Removed from chat" },
  { value: "banned", label: "Banned from chat" },
  { value: "left", label: "Left chat" },
  { value: "unread", label: "Unread messages" },
  { value: "receipts", label: "Delivery & retry" },
] as const;

export type ChatScenario =
  | (typeof CHAT_SCENARIOS)[number]["value"]
  | "reconnecting";

export function getScenarioMessages(scenario: ChatScenario): ChatMessage[] {
  if (
    [
      "empty",
      "loading",
      "error",
      "access-lost",
      "removed",
      "banned",
      "left",
    ].includes(scenario)
  )
    return [];
  if (scenario === "long-message")
    return [...INITIAL_CHAT_MESSAGES, LONG_CHAT_MESSAGE];
  if (scenario !== "receipts") return INITIAL_CHAT_MESSAGES;
  return [
    ...INITIAL_CHAT_MESSAGES.slice(0, 1),
    ...(["sending", "sent", "delivered", "read", "failed"] as const).map(
      (delivery, index) => ({
        id: 20 + index,
        author: "you" as const,
        text:
          [
            "Sending the latest update…",
            "The notes are on their way.",
            "The group has received the notes.",
            "Ready for our next review.",
            "Shall we meet at two?",
          ][index] ?? "A new update.",
        dateLabel: "Today",
        time: "10:51",
        reactions: [],
        delivery,
      }),
    ),
  ];
}
