import { SiteFooter } from "@coss/ui/shared/site-footer";
import type { Metadata } from "next";
import { ChatShowcase } from "./chat-showcase";
import { absoluteUrl } from "@/lib/canonical";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/chat") },
  title: "Chat UI — Make room for conversation — coss ui",
  description:
    "Beautifully crafted React chat components. Explore replies, reactions, mentions, and every state in between. Built with Base UI, Tailwind CSS, and Motion.",
};

export default function ChatPage() {
  return (
    <>
      <main>
        <ChatShowcase />
      </main>
      <SiteFooter />
    </>
  );
}
