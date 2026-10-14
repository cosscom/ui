"use client";

import { ArrowRightIcon, MicIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/registry/default/ui/input-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

export default function Particle() {
  return (
    <InputGroup>
      <InputGroupTextarea placeholder="Type a message…" />
      <InputGroupAddon align="block-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Voice message"
                className="rounded-full"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <MicIcon />
          </TooltipTrigger>
          <TooltipPopup>Record voice message</TooltipPopup>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Send message"
                className="ml-auto rounded-full"
                size="icon-sm"
              />
            }
          >
            <ArrowRightIcon />
          </TooltipTrigger>
          <TooltipPopup>Send</TooltipPopup>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
