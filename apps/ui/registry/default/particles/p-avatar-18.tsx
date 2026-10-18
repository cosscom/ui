import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";

const profileLink = (
  // biome-ignore lint/a11y/useAnchorContent: Avatar supplies the link content through the render prop.
  <a aria-label="View Nadia Ekman's profile" href="#people" />
);

export default function Particle() {
  return (
    <Avatar
      className="cursor-pointer outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring"
      render={profileLink}
    >
      <AvatarImage
        alt="Nadia Ekman"
        src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=96&h=96&dpr=2&q=80"
      />
      <AvatarFallback>NE</AvatarFallback>
    </Avatar>
  );
}
