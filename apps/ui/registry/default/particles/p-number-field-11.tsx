import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";

export default function Particle() {
  return (
    <NumberField defaultValue={0}>
      <NumberFieldGroup className="[--radius-lg:9999px] [--radius:9999px]">
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}
