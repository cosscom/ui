import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";

export default function Particle() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="[--avatar-size:--spacing(4)]">
          <AvatarImage
            alt="User"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=48&h=48&dpr=2&q=80"
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(6)]">
          <AvatarImage
            alt="User"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=72&h=72&dpr=2&q=80"
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(8)]">
          <AvatarImage
            alt="User"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(10)]">
          <AvatarImage
            alt="User"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=120&h=120&dpr=2&q=80"
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(12)]">
          <AvatarImage
            alt="User"
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=144&h=144&dpr=2&q=80"
          />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="[--avatar-size:--spacing(4)]">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(6)]">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(8)]">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(10)]">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <Avatar className="[--avatar-size:--spacing(12)]">
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
