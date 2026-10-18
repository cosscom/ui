import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

const people = [
  {
    initials: "FK",
    name: "Frida Kahlo",
    photo: "photo-1543610892-0b1f7e6d8ac1",
  },
  {
    initials: "NE",
    name: "Nadia Ekman",
    photo: "photo-1628157588553-5eeea00af15c",
  },
  {
    initials: "EW",
    name: "Eli Wren",
    photo: "photo-1655874819398-c6dfbec68ac7",
  },
];

export default function Particle() {
  return (
    <AvatarGroup>
      {people.map((person) => (
        <Tooltip key={person.initials}>
          <TooltipTrigger render={<Avatar />}>
            <AvatarImage
              alt={person.name}
              src={`https://images.unsplash.com/${person.photo}?w=96&h=96&dpr=2&q=80`}
            />
            <AvatarFallback>{person.initials}</AvatarFallback>
          </TooltipTrigger>
          <TooltipPopup>{person.name}</TooltipPopup>
        </Tooltip>
      ))}
      <AvatarGroupCount>+2</AvatarGroupCount>
    </AvatarGroup>
  );
}
