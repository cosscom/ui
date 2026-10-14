import { Switch } from "@/registry/default/ui/switch";

export default function Particle() {
  return (
    <Switch
      aria-label="Notifications"
      className="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
    />
  );
}
