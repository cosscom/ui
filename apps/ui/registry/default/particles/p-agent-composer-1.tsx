"use client";

import { useState } from "react";
import { AgentComposer } from "@/registry/default/ui/agent-composer";

export default function Particle() {
  const [value, setValue] = useState("");
  return (
    <AgentComposer
      inputLabel="Message"
      onStop={() => {}}
      onSubmit={() => {}}
      onValueChange={setValue}
      sendLabel="Send message"
      stopLabel="Stop response"
      textareaProps={{ placeholder: "Ask anything…" }}
      value={value}
    />
  );
}
