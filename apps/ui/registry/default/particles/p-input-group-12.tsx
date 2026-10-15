"use client";

import { InfoIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/default/ui/input-group";
import { Label } from "@/registry/default/ui/label";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

export default function Particle() {
  return (
    <InputGroup>
      <InputGroupInput id="email-1" placeholder="team@coss.com" type="email" />
      <InputGroupAddon align="block-start">
        <Label className="text-foreground" htmlFor="email-1">
          Email
        </Label>
        <Popover>
          <PopoverTrigger
            aria-label="Email information"
            className="ml-auto"
            openOnHover
            render={<Button className="-m-1" size="icon-xs" variant="ghost" />}
          >
            <InfoIcon />
          </PopoverTrigger>
          <PopoverPopup aria-label="Email information" side="top" tooltipStyle>
            <p>We&apos;ll use this to send you notifications</p>
          </PopoverPopup>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
