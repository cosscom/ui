import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Badge } from "@/registry/default/ui/badge";

export default function Particle() {
  return (
    <div className="relative">
      <Avatar className="rounded-lg">
        <AvatarImage
          alt="User"
          src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
        />
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
      <Badge
        className="absolute -end-1.5 -top-1.5 rounded-full outline-2 outline-background outline-solid"
        size="sm"
      >
        6
      </Badge>
    </div>
  );
}
