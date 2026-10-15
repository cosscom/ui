import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";

export default function Particle() {
  return (
    <NumberField defaultValue={42} disabled>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}
