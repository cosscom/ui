import { CircleCheckIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/default/ui/alert";

export default function Particle() {
  return (
    <Alert variant="success">
      <CircleCheckIcon aria-label="Success" role="img" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
    </Alert>
  );
}
