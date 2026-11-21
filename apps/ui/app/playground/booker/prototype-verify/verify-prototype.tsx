"use client";

// PROTOTYPE ONLY. Holds the booking flow's state, decides every API answer
// from the scenario, mounts the Booker card and prints the state. Nothing is
// sent. The code is sent on Continue or Confirm, never earlier. The variant
// that sent it once the email was entered is on the prototype/booker-verify
// branch.

import { useEffect, useRef, useState } from "react";
import { PrototypeSwitcher } from "../../prototype-switcher";
import type { FieldValues } from "../prototype-form/fixtures";
import { startOfMonth } from "../prototype-manage/fixtures";
import {
  checkSaysRequired,
  codeLength,
  correctCode,
  createRefuses,
  eventRequiresCode,
  resendCooldownSeconds,
  type ScenarioKey,
  type Stage,
  scenarios,
  sendSucceeds,
  sendsPerMinute,
  type VariantKey,
  variants,
  wait,
} from "./fixtures";
import { type Flow, type Reason, VerifyBooker } from "./parts";

type Send = { to: string; at: number; sent: boolean };

const pickedDate = new Date(2026, 10, 25);
const pickedTime = "14:00";
const filledValues: FieldValues = {
  email: "dana@example.com",
  name: "Dana Whitfield",
};

export function VerifyPrototype({
  variant,
  scenario,
  initialStage,
}: {
  variant: VariantKey;
  scenario: ScenarioKey;
  initialStage: Stage;
}) {
  const opensFilled = initialStage === "verify" || initialStage === "booked";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [month, setMonth] = useState(startOfMonth(pickedDate));
  const [date, setDate] = useState<Date | undefined>(
    initialStage === "select" ? undefined : pickedDate,
  );
  const [time, setTime] = useState<string | undefined>(
    initialStage === "select" ? undefined : pickedTime,
  );
  const [is24Hour, setIs24Hour] = useState(false);
  const [values, setValues] = useState<FieldValues>(
    opensFilled ? filledValues : {},
  );
  const [sends, setSends] = useState<Send[]>([]);
  // What the pre-check answered, per address.
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState<Reason>(
    scenario === "foundOnCreate"
      ? "refusedOnCreate"
      : scenario === "perEmail"
        ? "address"
        : "eventType",
  );
  const [reusedCode, setReusedCode] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [sendError, setSendError] = useState<string>();
  const [lastResendAt, setLastResendAt] = useState<number>();
  const [busy, setBusy] = useState<Flow["busy"]>();
  // Zero until mounted, so the server and the browser render the same.
  const [now, setNow] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const note = (line: string) =>
    setLog((current) => [...current.slice(-7), line]);

  // A link that opens on the code step: the code was sent just now.
  // biome-ignore lint/correctness/useExhaustiveDependencies: first mount only
  useEffect(() => {
    if (initialStage === "verify") {
      setSends([
        {
          at: Date.now(),
          sent: sendSucceeds(scenario),
          to: "dana@example.com",
        },
      ]);
    }
  }, []);

  // Ticks the resend countdown.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Start over when the scenario or variant changes, but not on first mount,
  // so a link's stage survives.
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch
  useEffect(() => {
    if (mounted.current) {
      setStage("form");
      setDate(pickedDate);
      setTime(pickedTime);
      setValues({});
      setSends([]);
      setChecked({});
      setCode("");
      setCodeError(undefined);
      setSendError(undefined);
      setLastResendAt(undefined);
      setReusedCode(false);
      setLog([]);
    }
    mounted.current = true;
  }, [scenario, variant]);

  const email = typeof values.email === "string" ? values.email.trim() : "";
  const lastSendTo = (to: string) =>
    [...sends].reverse().find((item) => item.to === to);
  const lastSend = lastSendTo(email);
  const resendIn =
    lastSend?.sent === true
      ? Math.max(
          0,
          Math.ceil(resendCooldownSeconds - (now - lastSend.at) / 1000),
        )
      : 0;
  const knownToNeedCode =
    eventRequiresCode(scenario) || checked[email] === true;

  /** POST /send-code, unless a code for this address still works. */
  const sendCode = async (
    to: string,
    { fresh }: { fresh: boolean },
  ): Promise<"reused" | "sent" | "notSent" | "limited"> => {
    const previous = lastSendTo(to);
    // A code works for 15 to 30 minutes; the prototype treats it as 15.
    if (!fresh && previous?.sent && Date.now() - previous.at < 15 * 60_000) {
      note(`send-code skipped: the code sent to ${to} still works`);
      return "reused";
    }
    const lastMinute = sends.filter((item) => Date.now() - item.at < 60_000);
    if (lastMinute.length >= sendsPerMinute) {
      setSendError("Wait a minute before asking for another code.");
      note("send-code → 429 (three sends a minute)");
      return "limited";
    }
    setBusy("sending");
    await wait();
    const sent = sendSucceeds(scenario);
    setSends((current) => [...current, { at: Date.now(), sent, to }]);
    setBusy(undefined);
    note(`send-code ${to} → sent: ${sent}`);
    return sent ? "sent" : "notSent";
  };

  /** GET /check: does this address need a code? */
  const checkAddress = async (to: string) => {
    if (to in checked) {
      return checked[to] === true;
    }
    await wait(400);
    const required = checkSaysRequired(scenario);
    setChecked((current) => ({ ...current, [to]: required }));
    note(`check ${to} → ${required}`);
    return required;
  };

  const openCodeStep = async (why: Reason) => {
    setReason(why);
    setCode("");
    setCodeError(undefined);
    setSendError(undefined);
    setLastResendAt(undefined);
    const result = await sendCode(email, { fresh: false });
    setReusedCode(result === "reused");
    setStage("verify");
  };

  /** POST /bookings, with the code when there is one. */
  const createBooking = async (withCode?: string) => {
    setBusy("booking");
    await wait();
    setBusy(undefined);
    if (withCode === undefined && createRefuses(scenario)) {
      note("create → 403 (this address needs a verified code)");
      return "refused";
    }
    if (withCode !== undefined && withCode !== correctCode) {
      note("create → 400 invalid_verification_code");
      return "wrongCode";
    }
    note(`create → 201${withCode ? " (with the code)" : ""}`);
    return "created";
  };

  const confirm = async () => {
    if (busy) {
      return;
    }
    if (eventRequiresCode(scenario)) {
      await openCodeStep("eventType");
      return;
    }
    setBusy("checking");
    const required = await checkAddress(email);
    setBusy(undefined);
    if (required) {
      await openCodeStep("address");
      return;
    }
    const result = await createBooking();
    if (result === "refused") {
      await openCodeStep("refusedOnCreate");
      return;
    }
    setStage("booked");
  };

  const submitCode = async (value: string) => {
    if (busy) {
      return;
    }
    if (value.length < codeLength) {
      setCodeError("Enter the 6-digit code.");
      return;
    }
    setCodeError(undefined);
    const result = await createBooking(value);
    if (result === "wrongCode") {
      setCodeError("That code isn’t right. Check it or ask for a new one.");
      setCode("");
      return;
    }
    setStage("booked");
  };

  const flow: Flow = {
    backToSelect: () => setStage("select"),
    busy,
    changeEmail: () => {
      setCodeError(undefined);
      setSendError(undefined);
      setStage("form");
      // Puts the caret in the email field once the form is back.
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          'form input[type="email"]',
        );
        input?.focus();
        input?.select();
      });
    },
    code,
    codeError,
    codeSent: lastSend?.sent !== false,
    confirm: () => void confirm(),
    confirmLabel: knownToNeedCode ? "Continue" : "Confirm",
    date,
    is24Hour,
    lastResendAt,
    month,
    pickTime: (next) => {
      setTime(next);
      setStage("form");
    },
    reason,
    resend: async () => {
      setSendError(undefined);
      const result = await sendCode(email, { fresh: true });
      if (result === "sent") {
        setCode("");
        setCodeError(undefined);
        setLastResendAt(Date.now());
      }
    },
    resendIn,
    reusedCode,
    sendError,
    setCode: (next) => {
      setCode(next);
      setCodeError(undefined);
    },
    setDate,
    setIs24Hour,
    setMonth,
    setValue: (slug, value) =>
      setValues((current) => ({ ...current, [slug]: value })),
    stage,
    submitCode: (value) => void submitCode(value),
    time,
    values,
  };

  return (
    <div className="@container flex w-full flex-col items-center gap-4 pb-24">
      <VerifyBooker flow={flow} />

      <pre className="w-full max-w-3xl overflow-x-auto rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        {JSON.stringify(
          {
            apiCalls: log,
            checkAnswers: checked,
            codeThatWorks: correctCode,
            email,
            eventTypeRequiresVerification: eventRequiresCode(scenario),
            resendIn,
            scenario,
            sends: sends.map(
              (item) =>
                `${item.to} at ${new Date(item.at).toLocaleTimeString("en-GB")}, sent: ${item.sent}`,
            ),
            stage,
            variant,
          },
          null,
          2,
        )}
      </pre>

      <PrototypeSwitcher
        scenario={scenario}
        scenarios={scenarios.map((item) => ({ ...item }))}
        variant={variant}
        variants={variants.map((item) => ({ ...item }))}
      />
    </div>
  );
}
