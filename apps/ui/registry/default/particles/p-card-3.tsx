"use client";

import { ShieldAlertIcon } from "lucide-react";
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

export default function Particle() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="border-b">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter email and password to login</CardDescription>
      </CardHeader>
      <CardPanel>
        <Form
          className="flex w-full flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input placeholder="Enter your email" type="email" />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input placeholder="Enter your password" type="password" />
          </Field>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </Form>
      </CardPanel>
      <CardFooter className="border-t">
        <div className="flex gap-1 text-muted-foreground text-xs">
          <ShieldAlertIcon className="size-3 h-lh shrink-0" />
          <p>The information you enter is encrypted and stored securely.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
