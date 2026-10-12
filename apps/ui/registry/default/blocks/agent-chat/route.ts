import {
  convertToModelMessages,
  streamText,
  type UIMessage,
  validateUIMessages,
} from "ai";

export const maxDuration = 30;

export async function POST(request: Request) {
  // Add your application's authentication and rate limits before deploying this route.
  const model = process.env.AI_MODEL;
  if (!model)
    return new Response("Configure AI_MODEL on the server.", { status: 503 });

  let messages: UIMessage[];
  try {
    const body = await request.json();
    messages = await validateUIMessages({ messages: body.messages });
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
      return new Response(
        "Only user and assistant text messages are supported.",
        { status: 400 },
      );
    }
  } catch {
    return new Response("Invalid messages.", { status: 400 });
  }

  const result = streamText({
    model,
    instructions:
      "Give helpful, concise answers in plain text. Do not use Markdown formatting.",
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
  });

  return result.toUIMessageStreamResponse({
    onError: () => "The response could not be completed.",
  });
}
