"use client";

import { useAutocompleteFilter } from "@coss/ui/components/autocomplete";
import { Button, buttonVariants } from "@coss/ui/components/button";
import {
  Command,
  CommandCollection,
  CommandCreateHandle,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@coss/ui/components/command";
import { EmptyMedia } from "@coss/ui/components/empty";
import { Input } from "@coss/ui/components/input";
import { Kbd, KbdGroup } from "@coss/ui/components/kbd";
import { ScrollArea } from "@coss/ui/components/scroll-area";
import { Skeleton } from "@coss/ui/components/skeleton";
import { Spinner } from "@coss/ui/components/spinner";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  CircleQuestionMarkIcon,
  CornerDownLeftIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { markdownToSafeHTML } from "@/lib/markdown-to-safe-html";
import {
  MOCK_AI_RESPONSE,
  MOCK_REFERENCE_LINKS,
  type ReferenceLink,
} from "@/lib/mock-ai-data";

interface Item {
  value: string;
  label: string;
  shortcut?: string;
  keywords?: string[];
}

interface Group {
  value: string;
  items: Item[];
}

const commandGroups: Group[] = [
  {
    items: [
      {
        keywords: ["wf"],
        label: "Workflows",
        shortcut: "w f",
        value: "workflows",
      },
    ],
    value: "Workflows",
  },
  {
    items: [
      {
        keywords: ["et"],
        label: "Event Types",
        shortcut: "e t",
        value: "event-types",
      },
      { label: "15 Min Meeting", value: "15-min-meeting" },
      { label: "30 Min Meeting", value: "30-min-meeting" },
      { label: "Secret Meeting", value: "secret-meeting" },
    ],
    value: "Event Types",
  },
  {
    items: [
      {
        keywords: ["as"],
        label: "App Store",
        shortcut: "a s",
        value: "app-store",
      },
    ],
    value: "Apps",
  },
  {
    items: [
      {
        keywords: ["ub"],
        label: "Upcoming",
        shortcut: "u b",
        value: "upcoming",
      },
      {
        keywords: ["rb"],
        label: "Recurring",
        shortcut: "r b",
        value: "recurring",
      },
      { keywords: ["pb"], label: "Past", shortcut: "p b", value: "past" },
      {
        keywords: ["cb"],
        label: "Canceled",
        shortcut: "c b",
        value: "canceled",
      },
    ],
    value: "Bookings",
  },
  {
    items: [
      {
        keywords: ["sa"],
        label: "Availability",
        shortcut: "s a",
        value: "availability",
      },
    ],
    value: "Availability",
  },
  {
    items: [
      {
        keywords: ["ps"],
        label: "Profile",
        shortcut: "p s",
        value: "profile",
      },
      {
        keywords: ["ca"],
        label: "Change Avatar",
        shortcut: "c a",
        value: "change-avatar",
      },
      {
        keywords: ["ct"],
        label: "Timezone",
        shortcut: "c t",
        value: "timezone",
      },
      {
        keywords: ["bc"],
        label: "Brand Color",
        shortcut: "b c",
        value: "brand-color",
      },
      { keywords: ["ts"], label: "Teams", shortcut: "t s", value: "teams" },
    ],
    value: "Profile",
  },
  {
    items: [
      {
        keywords: ["cp"],
        label: "Change Password",
        shortcut: "c p",
        value: "change-password",
      },
      {
        keywords: ["tfa"],
        label: "Two factor authentication",
        shortcut: "t f a",
        value: "two-factor-auth",
      },
      {
        keywords: ["ui"],
        label: "User Impersonation",
        shortcut: "u i",
        value: "user-impersonation",
      },
    ],
    value: "Security",
  },
  {
    items: [
      {
        keywords: ["ul"],
        label: "Choose a license",
        shortcut: "u l",
        value: "choose-license",
      },
    ],
    value: "Admin",
  },
  {
    items: [
      {
        keywords: ["wh"],
        label: "Webhooks",
        shortcut: "w h",
        value: "webhooks",
      },
      {
        keywords: ["api"],
        label: "API keys",
        shortcut: "a p i",
        value: "api-keys",
      },
    ],
    value: "Developer",
  },
  {
    items: [
      {
        keywords: ["mb"],
        label: "Manage billing",
        shortcut: "m b",
        value: "manage-billing",
      },
    ],
    value: "Billing",
  },
  {
    items: [
      { label: "Alby", value: "alby" },
      { label: "Amie", value: "amie" },
      { label: "Apple Calendar", value: "apple-calendar" },
      { label: "Attio", value: "attio" },
      { label: "Autocheckin", value: "autocheckin" },
      { label: "BAA for HIPAA", value: "baa-hipaa" },
    ],
    value: "Installable Apps",
  },
];

interface AIState {
  mode: boolean;
  query: string;
  submittedQuery: string;
  response: string;
  referenceLinks: ReferenceLink[];
  isGenerating: boolean;
  error: string | null;
}

const initialAIState: AIState = {
  error: null,
  isGenerating: false,
  mode: false,
  query: "",
  referenceLinks: [],
  response: "",
  submittedQuery: "",
};

export const commandHandle: ReturnType<typeof CommandCreateHandle> =
  CommandCreateHandle();

export function AppCommand(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [aiState, setAIState] = React.useState<AIState>(initialAIState);
  const [searchQuery, setSearchQuery] = React.useState("");
  const aiInputRef = React.useRef<HTMLInputElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const commandResetKeyRef = React.useRef(0);

  // Cleanup on unmount
  React.useEffect((): (() => void) => {
    return (): void => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const resetAIState = React.useCallback(() => {
    abortControllerRef.current?.abort();
    setAIState(initialAIState);
  }, []);

  const handleItemClick = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleBackToSearch = React.useCallback(() => {
    resetAIState();
    setSearchQuery("");
    // Force Command remount to reset Autocomplete's internal query state
    commandResetKeyRef.current += 1;
    // Focus search input after state updates
    searchInputRef.current?.focus();
  }, [resetAIState]);

  const handleGenerateAI = React.useCallback(
    async (queryOverride?: string) => {
      const query = queryOverride || aiState.query;
      if (!query.trim()) return;

      // Abort any ongoing request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setAIState((prev) => ({
        ...prev,
        error: null,
        isGenerating: true,
        query: "",
        referenceLinks: [],
        response: "",
        submittedQuery: query,
      }));

      try {
        // Simulate AI response - in production, this would call an API
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(resolve, 1500);
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("aborted"));
          });
        });

        // Don't update state if request was aborted
        if (controller.signal.aborted) return;

        setAIState((prev) => ({
          ...prev,
          isGenerating: false,
          referenceLinks: MOCK_REFERENCE_LINKS,
          response: MOCK_AI_RESPONSE,
        }));
      } catch (error) {
        // Ignore abort errors - component cleanup handles this
        if (error instanceof Error && error.message === "aborted") {
          return;
        }

        // Only update if not aborted
        if (controller.signal.aborted) return;

        setAIState((prev) => ({
          ...prev,
          error: "Failed to generate response. Please try again.",
          isGenerating: false,
        }));
      }
    },
    [aiState.query],
  );

  const handleAskAI = React.useCallback(() => {
    const currentQuery = searchQuery;
    setSearchQuery("");

    if (currentQuery.trim()) {
      // If there's a query, ask AI immediately
      setAIState((prev) => ({ ...prev, mode: true }));
      handleGenerateAI(currentQuery);
    } else {
      // If no query, just switch to AI mode
      setAIState((prev) => ({ ...prev, mode: true, query: "" }));
      aiInputRef.current?.focus();
    }
  }, [searchQuery, handleGenerateAI]);

  const { contains } = useAutocompleteFilter({ sensitivity: "base" });

  const filterItem = React.useCallback(
    (itemValue: unknown, query: string): boolean => {
      if (typeof itemValue !== "object" || itemValue === null) {
        return false;
      }

      const item = itemValue as Item;

      // Search in label
      if (contains(item.label, query)) {
        return true;
      }

      // Search in value
      if (contains(item.value, query)) {
        return true;
      }

      // Search in keywords
      if (item.keywords?.some((keyword) => contains(keyword, query))) {
        return true;
      }

      return false;
    },
    [contains],
  );

  React.useEffect((): (() => void) => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => {
          if (!open) {
            setSearchQuery("");
          }
          return !open;
        });
      }
    };

    document.addEventListener("keydown", down);
    return (): void => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect((): (() => void) | undefined => {
    if (!open || !aiState.mode) return;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleBackToSearch();
      }
    };

    document.addEventListener("keydown", handleEscape, true);
    return (): void =>
      document.removeEventListener("keydown", handleEscape, true);
  }, [open, aiState.mode, handleBackToSearch]);

  React.useEffect(() => {
    if (aiState.mode && !aiState.isGenerating) {
      // Focus AI input when switching to AI mode or after response
      aiInputRef.current?.focus();
    }
  }, [aiState.mode, aiState.isGenerating]);

  const hasResults = React.useMemo(
    () =>
      !searchQuery.trim() ||
      commandGroups.some((group) =>
        group.items.some((item) => filterItem(item, searchQuery)),
      ),
    [searchQuery, filterItem],
  );

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSearchQuery("");
        resetAIState();
      }
    },
    [resetAIState],
  );

  return (
    <CommandDialog
      handle={commandHandle}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <CommandDialogPopup>
        {!aiState.mode ? (
          <Command
            filter={filterItem}
            items={commandGroups}
            key={commandResetKeyRef.current}
          >
            <div className="relative flex items-center *:first:flex-1">
              <CommandInput
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  setSearchQuery(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    handleAskAI();
                  }
                  if (e.key === "Enter" && !hasResults && searchQuery.trim()) {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
                placeholder="Type a command or search..."
                ref={searchInputRef}
                value={searchQuery}
              />
              <Button
                className="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
                onClick={handleAskAI}
                size="sm"
                variant="ghost"
              >
                <SparklesIcon className="size-4 sm:size-3.5" />
                Ask AI
                <Kbd className="ms-0.5 -me-1.5">Tab</Kbd>
              </Button>
            </div>
            <CommandPanel>
              <CommandEmpty className="not-empty:py-12">
                {searchQuery.trim() && (
                  <div className="wrap-break-word flex flex-col flex-wrap items-center gap-2">
                    <EmptyMedia variant="icon">
                      <SearchIcon />
                    </EmptyMedia>
                    <p>No results found.</p>
                    <p>
                      Press <Kbd>Enter</Kbd> to ask AI about:
                      <br />{" "}
                      <strong className="font-medium text-foreground">
                        {searchQuery}
                      </strong>
                    </p>
                  </div>
                )}
              </CommandEmpty>
              <CommandList>
                {(group: Group): React.ReactElement => (
                  <React.Fragment key={group.value}>
                    <CommandGroup items={group.items}>
                      <CommandGroupLabel>{group.value}</CommandGroupLabel>
                      <CommandCollection>
                        {(item: Item): React.ReactElement => (
                          <CommandItem
                            key={item.value}
                            onClick={handleItemClick}
                            value={item.value}
                          >
                            <span className="flex-1">{item.label}</span>
                            {item.shortcut && (
                              <CommandShortcut>{item.shortcut}</CommandShortcut>
                            )}
                          </CommandItem>
                        )}
                      </CommandCollection>
                    </CommandGroup>
                    <CommandSeparator />
                  </React.Fragment>
                )}
              </CommandList>
            </CommandPanel>
            <CommandFooter>
              {hasResults ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <KbdGroup>
                        <Kbd>
                          <ArrowUpIcon />
                        </Kbd>
                        <Kbd>
                          <ArrowDownIcon />
                        </Kbd>
                      </KbdGroup>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Kbd>
                        <CornerDownLeftIcon />
                      </Kbd>
                      <span>Open</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Kbd>Esc</Kbd>
                    <span>Close</span>
                  </div>
                </>
              ) : (
                <div className="ms-auto flex items-center gap-2">
                  <Kbd>Esc</Kbd>
                  <span>Close</span>
                </div>
              )}
            </CommandFooter>
          </Command>
        ) : (
          <Command>
            <div className="flex items-center *:first:flex-1">
              <div className="px-2.5 py-1.5">
                <div className="relative w-full">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 start-px z-10 flex items-center ps-[calc(--spacing(3)-1px)] opacity-80 has-[+[data-size=sm]]:ps-[calc(--spacing(2.5)-1px)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:-mx-0.5"
                    data-slot="autocomplete-start-addon"
                  >
                    <SparklesIcon />
                  </div>
                  <Input
                    aria-label="AI query input"
                    className="border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0 *:data-[slot=input]:ps-[calc(--spacing(8.5)-1px)] sm:*:data-[slot=input]:ps-[calc(--spacing(8)-1px)]"
                    disabled={aiState.isGenerating}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                      setAIState((prev) => ({ ...prev, query: e.target.value }))
                    }
                    onKeyDown={(
                      e: React.KeyboardEvent<HTMLInputElement>,
                    ): void => {
                      if (e.key === "Enter" && !aiState.isGenerating) {
                        handleGenerateAI();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        handleBackToSearch();
                      }
                    }}
                    placeholder="Ask AI anything…"
                    ref={aiInputRef}
                    size="lg"
                    value={aiState.query}
                  />
                </div>
              </div>
              <Button
                className="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs"
                onClick={handleBackToSearch}
                size="sm"
                variant="ghost"
              >
                <ArrowLeftIcon className="size-4 sm:size-3.5" />
                Back to search
                <Kbd className="ms-0.5 -me-1.5">Esc</Kbd>
              </Button>
            </div>
            <CommandPanel>
              <ScrollArea overscrollContain scrollbarGutter scrollFade>
                <div className="p-5">
                  {!aiState.isGenerating &&
                    !aiState.response &&
                    !aiState.error && (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-muted-foreground text-sm">
                          Ask AI anything and press <Kbd>Enter</Kbd> to get
                          started.
                        </p>
                      </div>
                    )}

                  {aiState.error && (
                    <div
                      aria-live="polite"
                      className="text-destructive text-sm"
                      role="alert"
                    >
                      {aiState.error}
                    </div>
                  )}

                  {aiState.isGenerating && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/4" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  )}

                  {aiState.response && !aiState.isGenerating && (
                    <>
                      <div
                        aria-live="polite"
                        className="text-muted-foreground text-sm **:[a]:underline **:[a]:underline-offset-4 **:[code]:rounded-md **:[code]:bg-muted **:[code]:px-[0.3rem] **:[code]:py-[0.2rem] **:[code]:font-mono **:[h1,h2,h3,strong,a]:font-medium **:[h1,h2,h3,strong,a]:text-foreground **:[h1,h2,h3]:not-first:mt-4 **:[h1,h2,h3]:text-base **:[p]:not-first:mt-3 **:[p]:leading-relaxed **:[ul]:my-3 **:[ul]:ms-4 **:[ul]:list-disc"
                        dangerouslySetInnerHTML={{
                          __html: markdownToSafeHTML(aiState.response),
                        }}
                      />
                      {aiState.referenceLinks.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                          {aiState.referenceLinks.map((link, index) => (
                            <Link
                              className={buttonVariants({
                                size: "sm",
                                variant: "secondary",
                              })}
                              href={link.url}
                              key={`${link.url}-${index}`}
                            >
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </CommandPanel>

            <CommandFooter>
              {aiState.isGenerating ? (
                <div aria-live="polite" className="flex items-center gap-2">
                  <div className="flex h-5 items-center justify-center">
                    <Spinner className="size-3" />
                  </div>
                  <span className="animate-pulse">Generating response…</span>
                </div>
              ) : aiState.response ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-5 items-center justify-center">
                    <CircleQuestionMarkIcon className="size-3" />
                  </div>
                  You asked: <span>&quot;{aiState.submittedQuery}&quot;</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Kbd>
                    <CornerDownLeftIcon />
                  </Kbd>
                  <span>Ask AI</span>
                </div>
              )}
            </CommandFooter>
          </Command>
        )}
      </CommandDialogPopup>
    </CommandDialog>
  );
}
