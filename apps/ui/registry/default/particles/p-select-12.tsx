import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const items = [
  { disabled: false, label: "Next.js", value: "next" },
  { disabled: false, label: "Vite", value: "vite" },
  { disabled: true, label: "Astro (coming soon)", value: "astro" },
  { disabled: true, label: "Remix (coming soon)", value: "remix" },
  { disabled: false, label: "Nuxt", value: "nuxt" },
];

export default function Particle() {
  return (
    <Select defaultValue="next" items={items}>
      <SelectTrigger aria-label="Select framework">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {items.map(({ disabled, label, value }) => (
          <SelectItem disabled={disabled} key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
