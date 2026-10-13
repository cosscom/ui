"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerItem,
  type ComposerItemValue,
  ComposerList,
  ComposerPopup,
  ComposerStatus,
  ComposerSubmit,
  type ComposerValue,
  useComposerFilter,
} from "@/registry/default/ui/composer";
import { Spinner } from "@/registry/default/ui/spinner";

const people = [
  { id: "alex", label: "Alex Morgan", description: "Design" },
  { id: "sam", label: "Sam Rivera", description: "Engineering" },
  { id: "taylor", label: "Taylor Kim", description: "Product" },
];

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [queryText, setQueryText] = useState<string | null>(null);
  const [resultsFor, setResultsFor] = useState<string>();
  const [items, setItems] = useState<typeof people>([]);
  const [status, setStatus] = useState<"ready" | "loading">("ready");
  const { contains } = useComposerFilter();

  useEffect(() => {
    if (queryText === null) return;
    const timer = window.setTimeout(() => {
      setItems(
        people.filter(
          (person) =>
            contains(person.label, queryText) ||
            contains(person.description, queryText),
        ),
      );
      setResultsFor(queryText);
      setStatus("ready");
    }, 500);
    return () => window.clearTimeout(timer);
  }, [queryText, contains]);

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Composer
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue([])}
        onQueryChange={(query) => {
          setQueryText(query?.text ?? null);
          setStatus(query ? "loading" : "ready");
        }}
        triggers={[
          { character: "@", items, itemsFor: resultsFor, filter: null, status },
        ]}
      >
        <ComposerInput aria-label="Message" placeholder="Mention someone…" />
        <ComposerPopup aria-busy={status === "loading" || undefined}>
          {status === "loading" && (
            <ComposerStatus>
              <span className="flex items-center justify-between gap-2 text-muted-foreground">
                Searching...
                <Spinner className="size-4.5 sm:size-4" />
              </span>
            </ComposerStatus>
          )}
          <ComposerList>
            {(item: ComposerItemValue) => (
              <ComposerItem key={item.id} value={item}>
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  {item.description && (
                    <span className="block truncate text-muted-foreground text-xs">
                      {item.description}
                    </span>
                  )}
                </span>
              </ComposerItem>
            )}
          </ComposerList>
        </ComposerPopup>
        <ComposerActions>
          <ComposerActionGroup align="end">
            <ComposerSubmit
              render={
                <Button aria-label="Send message" size="icon">
                  <ArrowUpIcon aria-hidden="true" />
                </Button>
              }
            />
          </ComposerActionGroup>
        </ComposerActions>
      </Composer>

      <p className="text-muted-foreground text-sm">
        Search by name or team. Try @design, or @zz for no menu.
      </p>
    </div>
  );
}
