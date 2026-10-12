"use client";

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
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAutocompleteFilter } from "@/registry/default/ui/autocomplete";
import { Button, buttonVariants } from "@/registry/default/ui/button";
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
} from "@/registry/default/ui/command";
import { EmptyMedia } from "@/registry/default/ui/empty";
import { Input } from "@/registry/default/ui/input";
import { Kbd, KbdGroup } from "@/registry/default/ui/kbd";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { Spinner } from "@/registry/default/ui/spinner";

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
        keywords: ["dash"],
        label: "Dashboard",
        shortcut: "d",
        value: "dashboard",
      },
      {
        keywords: ["proj"],
        label: "Projects",
        shortcut: "p",
        value: "projects",
      },
      { keywords: ["team"], label: "Team", shortcut: "t", value: "team" },
    ],
    value: "Pages",
  },
  {
    items: [
      {
        keywords: ["prof"],
        label: "Profile",
        shortcut: "p s",
        value: "profile",
      },
      {
        keywords: ["acc"],
        label: "Account",
        shortcut: "a s",
        value: "account",
      },
      {
        keywords: ["pref"],
        label: "Preferences",
        shortcut: "p r",
        value: "preferences",
      },
    ],
    value: "Settings",
  },
  {
    items: [
      {
        keywords: ["docs"],
        label: "Documentation",
        shortcut: "d o",
        value: "docs",
      },
      {
        keywords: ["sup"],
        label: "Support",
        shortcut: "s u",
        value: "support",
      },
      {
        keywords: ["feed"],
        label: "Feedback",
        shortcut: "f b",
        value: "feedback",
      },
    ],
    value: "Help",
  },
];

const MOCK_AI_RESPONSE = `To create a new project, navigate to the Projects page and click the "New Project" button in the top right corner. You'll be prompted to enter a project name and description.

Once created, you can invite team members by clicking the "Share" button and entering their email addresses. Team members will receive an invitation link via email or you can add them manually by clicking the "Add Team Member" button in the project settings.

You can customize project settings at any time by clicking the settings icon in the project header. For more information, see the Project Settings documentation.`;

const MOCK_REFERENCE_LINKS = [
  { title: "Creating Projects", url: "/docs/projects/create" },
  { title: "Team Collaboration", url: "/docs/team/collaborate" },
  { title: "Project Settings", url: "/docs/projects/settings" },
];

export const commandHandle: ReturnType<typeof CommandCreateHandle> =
  CommandCreateHandle();

interface AIState {
  mode: boolean;
  query: string;
  submittedQuery: string;
  response: string;
  referenceLinks: Array<{ title: string; url: string }>;
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

function markdownToSafeHTML(markdown: string): string {
  // Simple markdown to HTML converter for demo purposes
  return markdown
    .split("\n\n")
    .map((para) => `<p>${para}</p>`)
    .join("");
}

export default function PCommand2() {
  const [open, setOpen] = useState(false);
  const [aiState, setAIState] = useState<AIState>(initialAIState);
  const [searchQuery, setSearchQuery] = useState("");
  const aiInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const commandResetKeyRef = useRef(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const resetAIState = useCallback(() => {
    abortControllerRef.current?.abort();
    setAIState(initialAIState);
  }, []);

  const handleItemClick = useCallback(() => {
    setOpen(false);
  }, []);

  const handleBackToSearch = useCallback(() => {
    resetAIState();
    setSearchQuery("");
    commandResetKeyRef.current += 1;
    searchInputRef.current?.focus();
  }, [resetAIState]);

  const handleGenerateAI = useCallback(
    async (queryOverride?: string) => {
      const query = queryOverride || aiState.query;
      if (!query.trim()) return;

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
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(resolve, 1500);
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("aborted"));
          });
        });

        if (controller.signal.aborted) return;

        setAIState((prev) => ({
          ...prev,
          isGenerating: false,
          referenceLinks: MOCK_REFERENCE_LINKS,
          response: MOCK_AI_RESPONSE,
        }));
      } catch (error) {
        if (error instanceof Error && error.message === "aborted") {
          return;
        }

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

  const handleAskAI = useCallback(() => {
    const currentQuery = searchQuery;
    setSearchQuery("");

    if (currentQuery.trim()) {
      setAIState((prev) => ({ ...prev, mode: true }));
      handleGenerateAI(currentQuery);
    } else {
      setAIState((prev) => ({ ...prev, mode: true, query: "" }));
      aiInputRef.current?.focus();
    }
  }, [searchQuery, handleGenerateAI]);

  const { contains } = useAutocompleteFilter({ sensitivity: "base" });

  const filterItem = useCallback(
    (itemValue: unknown, query: string): boolean => {
      if (typeof itemValue !== "object" || itemValue === null) {
        return false;
      }

      const item = itemValue as Item;

      if (contains(item.label, query)) {
        return true;
      }

      if (contains(item.value, query)) {
        return true;
      }

      if (item.keywords?.some((keyword) => contains(keyword, query))) {
        return true;
      }

      return false;
    },
    [contains],
  );

  useEffect(() => {
    if (!open || !aiState.mode) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleBackToSearch();
      }
    };

    document.addEventListener("keydown", handleEscape, true);
    return () => document.removeEventListener("keydown", handleEscape, true);
  }, [open, aiState.mode, handleBackToSearch]);

  useEffect(() => {
    if (aiState.mode && !aiState.isGenerating) {
      aiInputRef.current?.focus();
    }
  }, [aiState.mode, aiState.isGenerating]);

  const hasResults = useMemo(
    () =>
      !searchQuery.trim() ||
      commandGroups.some((group) =>
        group.items.some((item) => filterItem(item, searchQuery)),
      ),
    [searchQuery, filterItem],
  );

  const handleOpenChange = useCallback(
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
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Cmdk with AI
      </Button>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      handleAskAI();
                    }
                    if (
                      e.key === "Enter" &&
                      !hasResults &&
                      searchQuery.trim()
                    ) {
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
                  {(group: Group) => (
                    <Fragment key={group.value}>
                      <CommandGroup items={group.items}>
                        <CommandGroupLabel>{group.value}</CommandGroupLabel>
                        <CommandCollection>
                          {(item: Item) => (
                            <CommandItem
                              key={item.value}
                              onClick={handleItemClick}
                              value={item}
                            >
                              <span className="flex-1">{item.label}</span>
                              {item.shortcut && (
                                <CommandShortcut>
                                  {item.shortcut}
                                </CommandShortcut>
                              )}
                            </CommandItem>
                          )}
                        </CommandCollection>
                      </CommandGroup>
                      <CommandSeparator />
                    </Fragment>
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
                      onChange={(e) =>
                        setAIState((prev) => ({
                          ...prev,
                          query: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
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
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/5" />
                        </div>
                      </div>
                    )}

                    {aiState.response && !aiState.isGenerating && (
                      <>
                        <div
                          aria-live="polite"
                          className="text-muted-foreground text-sm **:[a]:underline **:[a]:underline-offset-4 **:[code]:rounded-md **:[code]:bg-muted **:[code]:px-[0.3rem] **:[code]:py-[0.2rem] **:[code]:font-mono **:[p]:not-first:mt-3 **:[p]:leading-relaxed **:[strong,a]:font-medium **:[strong,a]:text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: markdownToSafeHTML(aiState.response),
                          }}
                        />
                        {aiState.referenceLinks.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
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
    </>
  );
}
