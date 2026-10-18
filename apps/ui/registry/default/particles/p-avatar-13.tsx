import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/default/ui/avatar";

export default function Particle() {
  return (
    <AvatarGroup className="[--avatar-size:--spacing(6)]">
      <Avatar>
        <AvatarImage
          alt="Frida Kahlo"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80"
        />
        <AvatarFallback>FK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          alt="Nadia Ekman"
          src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=72&h=72&dpr=2&q=80"
        />
        <AvatarFallback>NE</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          alt="Eli Wren"
          src="https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=72&h=72&dpr=2&q=80"
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  );
}
