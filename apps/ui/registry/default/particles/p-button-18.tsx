import { Button } from "@/registry/default/ui/button";
import { Spinner } from "@/registry/default/ui/spinner";

export default function Particle() {
  return (
    <Button disabled focusableWhenDisabled>
      <Spinner />
      Loading...
    </Button>
  );
}
