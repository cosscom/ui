"use client";

import { DirectionProvider } from "@base-ui/react/direction-provider";
import { useState } from "react";
import { AgentApprovalCard } from "@/registry/default/ui/agent-approval";
import { AgentComposer } from "@/registry/default/ui/agent-composer";
import {
  AgentMessage,
  AgentMessageContent,
} from "@/registry/default/ui/agent-message";
import {
  AgentMessageActions,
  AgentMessageCopyAction,
} from "@/registry/default/ui/agent-message-actions";
import { AgentReasoning } from "@/registry/default/ui/agent-reasoning";
import { AgentResponseFeedback } from "@/registry/default/ui/agent-response-feedback";
import {
  AgentToolActivityGroup,
  AgentToolActivityRow,
} from "@/registry/default/ui/agent-tool-activity";

const long = "Kalenderverfügbarkeitsüberprüfungsanforderung".repeat(4);
const labels = {
  goodResponse: "Good response",
  badResponse: "Bad response",
  cancel: "Abbrechen und zur Antwort zurückkehren",
  submit: "Bewertung verbindlich speichern und fortfahren",
  details: "Weitere Informationen",
  detailsPlaceholder: "Weitere Informationen…",
  dialogTitle: "Was können wir an dieser Antwort verbessern?",
  dialogDescription:
    "Sie können Gründe auswählen und weitere Informationen angeben.",
  reasonPrompt: "Welche Informationen waren nicht hilfreich?",
  submitError: long,
  thankYou: "Saved",
};
export default function StressPage() {
  const [rtl, setRtl] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [draft, setDraft] = useState("");
  return (
    <DirectionProvider direction={rtl ? "rtl" : "ltr"}>
      <main
        dir={rtl ? "rtl" : "ltr"}
        className="mx-auto flex w-full max-w-sm flex-col gap-8 p-4"
        data-testid="stress"
      >
        <label>
          <input
            type="checkbox"
            checked={rtl}
            onChange={(e) => setRtl(e.target.checked)}
          />{" "}
          RTL
        </label>
        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />{" "}
          Disabled
        </label>
        <AgentMessage author="assistant" aria-label="Assistant">
          <AgentMessageContent>{long}</AgentMessageContent>
          <AgentMessageActions
            label="Response actions"
            alwaysVisible
            className="w-full items-start"
          >
            <AgentMessageCopyAction
              disabled={disabled}
              text="Test"
              copyLabel="Copy response"
              copiedLabel="Copied"
              errorLabel="Copy failed"
            />
            <AgentResponseFeedback
              className="flex-1"
              disabled={disabled}
              labels={labels}
              reasons={[{ value: "long", label: long }]}
              onFeedback={async () => {
                throw new Error("fixture failure");
              }}
            />
          </AgentMessageActions>
        </AgentMessage>
        <AgentToolActivityGroup
          summary={long}
          status="working"
          defaultOpen
          disabled={disabled}
        >
          <AgentToolActivityRow>{long}</AgentToolActivityRow>
        </AgentToolActivityGroup>
        <AgentReasoning
          streamingLabel={long}
          completedLabel={long}
          disabled={disabled}
          defaultOpen
        >
          {long}
        </AgentReasoning>
        <AgentApprovalCard
          question={long}
          context={long}
          approveLabel="Alle vorgeschlagenen Änderungen übernehmen"
          rejectLabel="Alle vorgeschlagenen Änderungen verwerfen"
          disabled={disabled}
          onRespond={() => {}}
        />
        <AgentMessage author="user" aria-label="You">
          <AgentMessageContent>
            مرحبا، أريد تحديد موعد جديد غداً.
          </AgentMessageContent>
        </AgentMessage>
        <AgentComposer
          disabled={disabled}
          value={draft}
          onValueChange={setDraft}
          onSubmit={() => {}}
          onStop={() => {}}
          inputLabel="Message"
          sendLabel="Send"
          stopLabel="Stop"
        />
      </main>
    </DirectionProvider>
  );
}
