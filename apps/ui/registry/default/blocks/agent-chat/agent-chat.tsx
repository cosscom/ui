"use client";

import { useChat } from "@ai-sdk/react";
import { type ChatTransport, DefaultChatTransport, type UIMessage } from "ai";
import { PencilIcon } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { AgentComposer } from "@/registry/default/ui/agent-composer";
import {
  AgentConversation,
  type AgentConversationHandle,
} from "@/registry/default/ui/agent-conversation";
import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import {
  AgentMessageAction,
  AgentMessageActions,
  AgentMessageCopyAction,
} from "@/registry/default/ui/agent-message-actions";
import { AgentStatusIndicator } from "@/registry/default/ui/agent-status-indicator";
import { Button } from "@/registry/default/ui/button";

const defaultTransport = new DefaultChatTransport({ api: "/api/chat" });

// An editable integration recipe. The UI primitives remain independent of AI SDK.
export default function AgentChat({
  transport = defaultTransport,
  initialDraft = "",
  initialMessages = [],
  renderResponse,
}: {
  transport?: ChatTransport<UIMessage>;
  initialDraft?: string;
  initialMessages?: UIMessage[];
  renderResponse?: (text: string) => ReactNode;
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [startError, setStartError] = useState(false);
  const requestRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conversationRef = useRef<AgentConversationHandle>(null);
  const {
    messages,
    setMessages,
    clearError,
    sendMessage,
    regenerate,
    stop,
    status,
  } = useChat({
    transport,
    messages: initialMessages,
    onFinish: ({ isAbort, isError }) => {
      if (!isError)
        setNotice(isAbort ? "Response stopped." : "Response complete.");
    },
  });
  const isBusy = pending || status === "submitted" || status === "streaming";
  const hasError = status === "error" || startError;
  const lastMessage = messages.at(-1);
  // A stream can start before its first text chunk. Keep the placeholder until
  // visible text replaces it so the transcript does not shrink between chunks.
  const waitingForText =
    (status === "submitted" || status === "streaming") &&
    !(
      lastMessage?.role === "assistant" &&
      lastMessage.parts.some(
        (part) => part.type === "text" && part.text.length > 0,
      )
    );

  async function submit(text?: string) {
    if (requestRef.current || isBusy || (text !== undefined && !text.trim()))
      return;
    requestRef.current = true;
    setPending(true);
    setNotice("");
    setStartError(false);
    inputRef.current?.focus();
    if (text !== undefined) setDraft("");
    conversationRef.current?.scrollToLatest();
    try {
      // Passing parts avoids asynchronous file preparation before the SDK starts the request.
      if (text !== undefined) {
        await sendMessage({ parts: [{ type: "text", text }] });
      } else {
        await regenerate();
      }
    } catch {
      setStartError(true);
    } finally {
      requestRef.current = false;
      setPending(false);
    }
  }

  function stopResponse() {
    void stop();
    setNotice("Response stopped.");
    inputRef.current?.focus();
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div
        className="flex h-[480px] min-h-0 flex-col px-3"
        data-slot="agent-chat"
      >
        <AgentConversation
          apiRef={conversationRef}
          className="flex-1"
          contentClassName="px-1 pt-4 pb-8"
          scrollbarGutter
          label="Conversation"
          scrollToLatestLabel="Scroll to latest message"
        >
          {messages.length === 0 && (
            <div className="flex flex-col gap-2 py-6">
              <p className="font-medium text-sm">How can I help?</p>
              <p className="text-muted-foreground text-sm">
                Ask a question or start with a draft.
              </p>
            </div>
          )}
          {messages.map((message, index) => {
            if (message.role !== "user" && message.role !== "assistant")
              return null;
            const text = message.parts
              .filter((part) => part.type === "text")
              .map((part) => part.text)
              .join("");
            const isLast = index === messages.length - 1;
            if (!text) return null;
            return (
              <AgentMessage
                aria-label={message.role === "user" ? "You" : "Assistant"}
                author={message.role}
                key={message.id}
              >
                <AgentMessageContent>
                  {message.role === "assistant" && renderResponse ? (
                    renderResponse(text)
                  ) : (
                    <div className="whitespace-pre-wrap">{text}</div>
                  )}
                </AgentMessageContent>
                {message.role === "user" && (
                  <AgentMessageActions label="Message actions">
                    <AgentMessageCopyAction
                      text={text}
                      copyLabel="Copy message"
                      copiedLabel="Message copied"
                      errorLabel="Could not copy. Try again."
                    />
                    <AgentMessageAction
                      label="Edit message"
                      disabled={isBusy}
                      onClick={() => {
                        if (requestRef.current || isBusy) return;
                        setDraft(text);
                        setMessages(messages.slice(0, index));
                        clearError();
                        setStartError(false);
                        setNotice("");
                        inputRef.current?.focus({ preventScroll: true });
                      }}
                    >
                      <PencilIcon aria-hidden="true" />
                    </AgentMessageAction>
                  </AgentMessageActions>
                )}
                {message.role === "assistant" && !(isLast && isBusy) && (
                  <AgentMessageActions
                    alwaysVisible={isLast}
                    label="Response actions"
                  >
                    <AgentMessageCopyAction
                      text={text}
                      copyLabel="Copy response"
                      copiedLabel="Response copied"
                      errorLabel="Could not copy. Try again."
                    />
                  </AgentMessageActions>
                )}
              </AgentMessage>
            );
          })}
          {waitingForText && (
            <AgentStatusIndicator
              announce={false}
              status="thinking"
              label="Thinking…"
            />
          )}
          {hasError && (
            <div className="flex flex-col items-start gap-3">
              <div role="alert">
                <AgentStatusIndicator
                  announce={false}
                  status="error"
                  label="Couldn’t finish the response. Try again."
                  className="max-w-full"
                  wrap
                />
              </div>
              <Button
                disabled={isBusy}
                onClick={() => void submit()}
                size="sm"
                type="button"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}
        </AgentConversation>
        <div className="shrink-0 pb-3">
          <AgentComposer
            inputLabel="Message"
            isBusy={isBusy}
            onStop={stopResponse}
            onSubmit={(text) => void submit(text)}
            onValueChange={setDraft}
            sendLabel="Send message"
            stopLabel="Stop response"
            textareaProps={{
              placeholder: "Ask anything…",
              ref: inputRef,
              rows: 2,
            }}
            value={draft}
          />
        </div>
      </div>
      <p className="sr-only" role="status">
        {isBusy ? "Responding…" : notice}
      </p>
    </div>
  );
}
