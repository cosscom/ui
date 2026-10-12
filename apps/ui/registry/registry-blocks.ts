import type { Registry } from "shadcn/schema";

export const blocks: Registry["items"] = [
  {
    name: "agent-chat",
    type: "registry:block",
    description:
      "Optional AI SDK conversation with streaming, cancellation, and retry",
    dependencies: ["@ai-sdk/react@^4.0.112", "ai@^7.0.109", "lucide-react"],
    registryDependencies: [
      "@coss/agent-status-indicator",
      "@coss/agent-composer",
      "@coss/agent-conversation",
      "@coss/agent-message",
      "@coss/agent-message-actions",
      "@coss/button",
    ],
    files: [
      {
        path: "blocks/agent-chat/agent-chat.tsx",
        type: "registry:component",
        target: "components/agent-chat.tsx",
      },
      {
        path: "blocks/agent-chat/route.ts",
        type: "registry:file",
        target: "app/api/chat/route.ts",
      },
    ],
  },
];
