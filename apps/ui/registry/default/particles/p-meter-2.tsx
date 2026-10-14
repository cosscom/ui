import { Meter } from "@/registry/default/ui/meter";

export default function Particle() {
  return <Meter aria-label="Storage usage" value={50} />;
}
