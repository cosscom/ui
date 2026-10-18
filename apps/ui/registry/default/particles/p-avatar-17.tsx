import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/default/ui/avatar";

export default function Particle() {
  return (
    <div className="rounded-xl bg-linear-to-br from-indigo-300 via-fuchsia-300 to-amber-200 p-6">
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            alt="Frida Kahlo"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
          />
          <AvatarFallback>FK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            alt="Nadia Ekman"
            src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=96&h=96&dpr=2&q=80"
          />
          <AvatarFallback>NE</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            alt="Eli Wren"
            src="https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=96&h=96&dpr=2&q=80"
          />
          <AvatarFallback>EW</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}
