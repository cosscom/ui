import { InfoIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/default/ui/input-group";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

export default function Particle() {
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Set your URL"
        className="*:[input]:ps-0!"
        placeholder="coss.com"
        type="text"
      />
      <InputGroupAddon>https://</InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Popover>
          <PopoverTrigger
            openOnHover
            render={
              <Button aria-label="More info" size="icon-xs" variant="ghost" />
            }
          >
            <InfoIcon />
          </PopoverTrigger>
          <PopoverPopup
            aria-label="Website URL information"
            side="top"
            tooltipStyle
          >
            <p>The URL of your website</p>
          </PopoverPopup>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}
