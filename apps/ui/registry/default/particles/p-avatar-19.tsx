import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";

const people = [
  {
    initials: "FK",
    name: "Frida Kahlo",
    photo: "photo-1543610892-0b1f7e6d8ac1",
    role: "Design",
  },
  {
    initials: "NE",
    name: "Nadia Ekman",
    photo: "photo-1628157588553-5eeea00af15c",
    role: "Engineering",
  },
  { initials: "EW", name: "Eli Wren", photo: "", role: "Research" },
];

export default function Particle() {
  return (
    <div className="flex w-full flex-col gap-4 [--avatar-size:--spacing(10)]">
      {people.map((person) => (
        <div className="flex items-center gap-3" key={person.initials}>
          <Avatar>
            {person.photo ? (
              <AvatarImage
                alt={person.name}
                src={`https://images.unsplash.com/${person.photo}?w=120&h=120&dpr=2&q=80`}
              />
            ) : null}
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-sm">{person.name}</span>
            <span className="truncate text-muted-foreground text-xs">
              {person.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
