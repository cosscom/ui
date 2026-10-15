"use client";

import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/registry/default/ui/card";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import { Input } from "@/registry/default/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

const frameworkOptions = [
  { label: "Next.js", value: "next" },
  { label: "Vite", value: "vite" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
];

export default function Particle() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardPanel>
        <Form
          className="flex w-full flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder="Name of your project" type="text" />
          </Field>
          <Field>
            <FieldLabel>Framework</FieldLabel>
            <Select defaultValue="next" items={frameworkOptions}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {frameworkOptions.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
          <Button className="w-full" type="submit">
            Deploy
          </Button>
        </Form>
      </CardPanel>
      <CardFooter>
        <div className="flex gap-1 text-muted-foreground text-xs">
          <CircleAlertIcon className="size-3 h-lh shrink-0" />
          <p>This will take a few seconds to complete.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
