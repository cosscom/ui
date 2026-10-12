import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
  validateUIMessages,
} from "ai";

export async function POST(request: Request) {
  let messages: UIMessage[];
  let fail: boolean;
  try {
    const body = await request.json();
    messages = await validateUIMessages({ messages: body.messages });
    fail = body.demoFailure === true;
    if (
      messages.length === 0 ||
      messages.length > 100 ||
      messages.some(
        (message) =>
          message.role === "system" ||
          message.parts.some(
            (part) => part.type !== "text" || part.text.length > 20000,
          ),
      )
    ) {
      return new Response("Invalid messages.", { status: 400 });
    }
  } catch {
    return new Response("Invalid messages.", { status: 400 });
  }

  const prompt =
    messages
      .at(-1)
      ?.parts.filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")
      .toLowerCase() ?? "";
  const reply = prompt.includes("short")
    ? "Hi Alex, just a reminder about our meeting tomorrow at 10 AM. Looking forward to it!"
    : prompt.includes("warm") || prompt.includes("friendly")
      ? "Hi Alex,\n\nI’m looking forward to catching up tomorrow at 10 AM! Just sending a quick reminder in case it helps with planning your day.\n\nSee you then!"
      : "Hi Alex,\n\nJust a quick reminder about our meeting tomorrow at 10 AM. Let me know if you need to reschedule.\n\nSee you then!";
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "start", messageId: crypto.randomUUID() });
      writer.write({ type: "text-start", id: "reply" });
      const words = reply.match(/\S+\s*/g) ?? [];
      for (const [index, word] of words.entries()) {
        // The delay is a server-side sample stream, not a client typing animation.
        try {
          await new Promise<void>((resolve, reject) => {
            const abort = () => {
              clearTimeout(timer);
              reject(request.signal.reason);
            };
            const timer = setTimeout(() => {
              request.signal.removeEventListener("abort", abort);
              resolve();
            }, 90);
            if (request.signal.aborted) abort();
            else
              request.signal.addEventListener("abort", abort, { once: true });
          });
        } catch {
          return;
        }
        if (fail && index === 10) throw new Error("Demo interruption");
        writer.write({ type: "text-delta", id: "reply", delta: word });
      }
      writer.write({ type: "text-end", id: "reply" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
    onError: () => "The sample response was interrupted.",
  });
  return createUIMessageStreamResponse({ stream });
}
