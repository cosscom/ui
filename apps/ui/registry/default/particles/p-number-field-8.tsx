import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";

export default function Particle() {
  return (
    <NumberField
      defaultValue={0}
      format={{ currency: "USD", style: "currency" }}
    >
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Amount in USD" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}
