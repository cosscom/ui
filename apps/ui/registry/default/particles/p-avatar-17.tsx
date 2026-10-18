import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";

export default function Particle() {
  return (
    <Avatar
      className="cursor-pointer outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
      render={<button aria-label="Open Frida Kahlo's profile" type="button" />}
    >
      <AvatarImage
        alt="Frida Kahlo"
        src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
      />
      <AvatarFallback>FK</AvatarFallback>
    </Avatar>
  );
}
