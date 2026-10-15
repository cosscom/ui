"use client";

import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/registry/default/ui/button";
import { Card, CardPanel } from "@/registry/default/ui/card";
import { Field, FieldLabel } from "@/registry/default/ui/field";
import { Form } from "@/registry/default/ui/form";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FrameTitle,
} from "@/registry/default/ui/frame";
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
    <Frame className="w-full max-w-xs">
      <FrameHeader>
        <FrameTitle>Create project</FrameTitle>
        <FrameDescription>
          Deploy your new project in one-click.
        </FrameDescription>
      </FrameHeader>
      <Card>
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
      </Card>
      <FrameFooter>
        <div className="flex gap-1 text-muted-foreground text-xs">
          <CircleAlertIcon className="size-3 h-lh shrink-0" />
          <p>This will take a few seconds to complete.</p>
        </div>
      </FrameFooter>
    </Frame>
  );
}
