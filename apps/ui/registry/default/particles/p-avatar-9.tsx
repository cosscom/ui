import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";

export default function Particle() {
  return (
    <div className="relative">
      <Avatar className="rounded-lg">
        <AvatarImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        />
        <AvatarFallback className="rounded-lg">LT</AvatarFallback>
      </Avatar>
      <span className="sr-only">Online</span>
      <span
        aria-hidden="true"
        className="absolute -end-0.5 -top-0.5 size-2 rounded-full bg-emerald-500 outline-2 outline-background"
      />
    </div>
  );
}
