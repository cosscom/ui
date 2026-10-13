import type { Registry } from "shadcn/schema";

export const chat: Registry["items"] = [
  {
    name: "chat",
    type: "registry:ui",
    description:
      "Composable chat components with messages, reactions, replies, and a composer.",
    dependencies: [
      "motion@14.0.0",
      "lucide-react",
      "@base-ui/react@1.8.0",
      "class-variance-authority",
    ],
    registryDependencies: [
      "@coss/avatar",
      "@coss/button",
      "@coss/collapsible",
      "@coss/composer",
      "@coss/empty",
      "@coss/menu",
      "@coss/popover",
      "@coss/scroll-area",
      "@coss/skeleton",
      "@coss/toggle",
      "@coss/toolbar",
      "@coss/tooltip",
      "@coss/use-media-query",
      "@coss/utils",
    ],
    files: [
      {
        path: "chat/chat-bubble.tsx",
        type: "registry:component",
        target: "@components/chat/chat-bubble.tsx",
      },
      {
        path: "chat/chat-collapsible-message.tsx",
        type: "registry:component",
        target: "@components/chat/chat-collapsible-message.tsx",
      },
      {
        path: "chat/chat-conversation.tsx",
        type: "registry:component",
        target: "@components/chat/chat-conversation.tsx",
      },
      {
        path: "chat/chat-date-pill.tsx",
        type: "registry:component",
        target: "@components/chat/chat-date-pill.tsx",
      },
      {
        path: "chat/chat-delivery-indicator.tsx",
        type: "registry:component",
        target: "@components/chat/chat-delivery-indicator.tsx",
      },
      {
        path: "chat/chat-jump-to-latest-button.tsx",
        type: "registry:component",
        target: "@components/chat/chat-jump-to-latest-button.tsx",
      },
      {
        path: "chat/chat-members.tsx",
        type: "registry:component",
        target: "@components/chat/chat-members.tsx",
      },
      {
        path: "chat/chat-message-actions.tsx",
        type: "registry:component",
        target: "@components/chat/chat-message-actions.tsx",
      },
      {
        path: "chat/chat-message-bubble.tsx",
        type: "registry:component",
        target: "@components/chat/chat-message-bubble.tsx",
      },
      {
        path: "chat/chat-message-info.tsx",
        type: "registry:component",
        target: "@components/chat/chat-message-info.tsx",
      },
      {
        path: "chat/chat-message-layout.tsx",
        type: "registry:component",
        target: "@components/chat/chat-message-layout.tsx",
      },
      {
        path: "chat/chat-message-text.tsx",
        type: "registry:component",
        target: "@components/chat/chat-message-text.tsx",
      },
      {
        path: "chat/chat-message.tsx",
        type: "registry:component",
        target: "@components/chat/chat-message.tsx",
      },
      {
        path: "chat/chat-reaction-chip.tsx",
        type: "registry:component",
        target: "@components/chat/chat-reaction-chip.tsx",
      },
      {
        path: "chat/chat-reaction-picker.tsx",
        type: "registry:component",
        target: "@components/chat/chat-reaction-picker.tsx",
      },
      {
        path: "chat/chat-reply-preview.tsx",
        type: "registry:component",
        target: "@components/chat/chat-reply-preview.tsx",
      },
      {
        path: "chat/chat-reply-reference.tsx",
        type: "registry:component",
        target: "@components/chat/chat-reply-reference.tsx",
      },
      {
        path: "chat/chat-states.tsx",
        type: "registry:component",
        target: "@components/chat/chat-states.tsx",
      },
      {
        path: "chat/chat-typing-indicator.tsx",
        type: "registry:component",
        target: "@components/chat/chat-typing-indicator.tsx",
      },
      {
        path: "chat/chat-unread-divider.tsx",
        type: "registry:component",
        target: "@components/chat/chat-unread-divider.tsx",
      },
      {
        path: "chat/hooks/use-chat-popup-dismissal.ts",
        type: "registry:component",
        target: "@components/chat/hooks/use-chat-popup-dismissal.ts",
      },
      {
        path: "chat/hooks/use-chat-scroll.ts",
        type: "registry:component",
        target: "@components/chat/hooks/use-chat-scroll.ts",
      },
      {
        path: "chat/lib/split-chat-message-preview.ts",
        type: "registry:component",
        target: "@components/chat/lib/split-chat-message-preview.ts",
      },
    ],
  },
  {
    name: "chat-demo",
    type: "registry:block",
    description:
      "An interactive group chat with a responsive drawer and conversation states.",
    dependencies: ["motion@14.0.0", "lucide-react"],
    registryDependencies: [
      "@coss/alert-dialog",
      "@coss/avatar",
      "@coss/badge",
      "@coss/button",
      "@coss/composer",
      "@coss/drawer",
      "@coss/menu",
      "@coss/tooltip",
      "@coss/use-media-query",
      "@coss/utils",
      "@coss/chat",
    ],
    files: [
      {
        path: "chat-demo/chat-demo-composer.tsx",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-composer.tsx",
      },
      {
        path: "chat-demo/chat-demo-message-info.tsx",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-message-info.tsx",
      },
      {
        path: "chat-demo/chat-demo-message.tsx",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-message.tsx",
      },
      {
        path: "chat-demo/chat-demo-receipts.ts",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-receipts.ts",
      },
      {
        path: "chat-demo/chat-demo-reply-focus.tsx",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-reply-focus.tsx",
      },
      {
        path: "chat-demo/chat-demo-scenarios.tsx",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-scenarios.tsx",
      },
      {
        path: "chat-demo/chat-demo-state.ts",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo-state.ts",
      },
      {
        path: "chat-demo/chat-demo.tsx",
        type: "registry:component",
        target: "@components/chat-demo/chat-demo.tsx",
      },
    ],
  },
];
