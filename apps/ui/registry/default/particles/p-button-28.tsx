import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";

export default function Particle() {
  return (
    <Button className="rounded-full ps-1">
      <Avatar className="[--avatar-size:--spacing(6)]">
        <AvatarImage
          alt="Luke Tracy"
          src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=128&h=128&dpr=2&q=80"
        />
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
      @georgelucas
    </Button>
  );
}
