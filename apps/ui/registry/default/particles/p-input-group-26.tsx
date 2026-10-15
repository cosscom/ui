"use client";

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/default/ui/input-group";
import { Label } from "@/registry/default/ui/label";

const requirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
];

export default function Particle() {
  const id = useId();
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const strength = requirements.map((req) => ({
    met: req.regex.test(password),
    text: req.text,
  }));

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>Password</Label>
        <InputGroup>
          <InputGroupInput
            aria-describedby={`${id}-description`}
            id={id}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type={isVisible ? "text" : "password"}
            value={password}
          />
          <InputGroupAddon align="inline-end">
            <Button
              aria-label={isVisible ? "Hide password" : "Show password"}
              onClick={() => setIsVisible(!isVisible)}
              size="icon-xs"
              variant="ghost"
            >
              {isVisible ? (
                <EyeOffIcon aria-hidden="true" />
              ) : (
                <EyeIcon aria-hidden="true" />
              )}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div
        aria-label="Password strength"
        aria-valuemax={4}
        aria-valuemin={0}
        aria-valuenow={strengthScore}
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        tabIndex={-1}
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        />
      </div>

      <p
        className="font-medium text-foreground text-sm"
        id={`${id}-description`}
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul aria-label="Password requirements" className="flex flex-col gap-1.5">
        {strength.map((req) => (
          <li className="flex items-center gap-2" key={req.text}>
            {req.met ? (
              <CheckIcon
                aria-hidden="true"
                className="size-4 text-emerald-500"
              />
            ) : (
              <XIcon
                aria-hidden="true"
                className="size-4 text-muted-foreground/80"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-success-foreground" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
