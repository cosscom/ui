"use client";

import { ArrowUpIcon } from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerItem,
  type ComposerItemValue,
  ComposerList,
  type ComposerPart,
  ComposerPopup,
  ComposerSubmit,
  ComposerToken,
  type ComposerValue,
  getComposerText,
  useComposerFilter,
} from "@/registry/default/ui/composer";
import { Kbd } from "@/registry/default/ui/kbd";

type Tag = { id: string; label: string; color: string; people: string[] };
type ItemClickEvent = MouseEvent<HTMLButtonElement> & {
  preventBaseUIHandler?: () => void;
};

const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");
const peopleCount = (count: number) =>
  `${count} ${count === 1 ? "person" : "people"}`;

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=96&h=96&dpr=2&q=80`;

const memberData = [
  ["Alex Morgan", "Design", "1543610892-0b1f7e6d8ac1"],
  ["Sam Rivera", "Engineering", "1507003211169-0a1dd7228f2d"],
  ["Taylor Kim", "Product", "1472099645785-5658abf4ff4e"],
  ["Jordan Lee", "Marketing", "1500648767791-00dcc994a43e"],
  ["Casey Chen", "Support", "1494790108377-be9c29b29330"],
  ["Morgan Davis", "Operations", "1655874819398-c6dfbec68ac7"],
  ["Jamie Wilson", "Finance", "1438761681033-6461ffad8d80"],
  ["Riley Patel", "Research", "1628157588553-5eeea00af15c"],
] as const;

const members: ComposerItemValue[] = memberData.map(([label, description]) => ({
  description,
  id: `member:${slug(label)}`,
  kind: "member",
  label,
}));

const photos: Record<string, string> = Object.fromEntries(
  memberData.map(([label, , image]) => [`member:${slug(label)}`, photo(image)]),
);

const tags: Tag[] = [
  {
    color: "bg-sky-500",
    id: "tag:clients",
    label: "Clients",
    people: [
      "Ben Carter",
      "Chloe Martin",
      "Sarah Lim",
      "Tom Okafor",
      "Ava Novak",
    ],
  },
  {
    color: "bg-amber-500",
    id: "tag:newsletter",
    label: "Newsletter",
    people: [
      "Aiden Brooks",
      "Bella Ortiz",
      "Caleb Foster",
      "Daisy Nguyen",
      "Elijah Grant",
      "Fiona Walsh",
      "Gabriel Silva",
      "Hannah Reed",
      "Isaac Moreno",
      "Julia Hart",
      "Kai Thompson",
      "Lena Fischer",
      "Mason Clarke",
      "Nora Bennett",
      "Oscar Diaz",
      "Priya Shah",
      "Quinn Murphy",
      "Rosa Alvarez",
      "Sarah Lim",
      "Tara Quinn",
      "Umar Haddad",
      "Vera Lindqvist",
      "Wes Turner",
      "Xena Park",
      "Yusuf Demir",
    ],
  },
];

const tagsOf = (name: string) =>
  tags.filter((tag) => tag.people.includes(name));

const contacts: ComposerItemValue[] = [
  ...new Set(tags.flatMap((tag) => tag.people)),
]
  .sort((a, b) => a.localeCompare(b))
  .map((label) => ({
    description: `${slug(label).replace("-", ".")}@example.com`,
    id: `contact:${slug(label)}`,
    kind: "contact",
    label,
  }));

const tagItems: ComposerItemValue[] = tags.map((tag) => ({
  description: peopleCount(tag.people.length),
  id: tag.id,
  kind: "tag",
  label: tag.label,
}));

const sections = [
  { kind: "member", label: "Team members" },
  { kind: "contact", label: "Contacts" },
  { kind: "tag", label: "Tags" },
] as const;

function getSegments(input: HTMLElement, value: ComposerValue) {
  const chips = value.filter((part) => part.type !== "text");
  let offset = 0;
  return Array.from(input.childNodes, (node) => {
    const length =
      node instanceof Text
        ? node.length
        : node instanceof HTMLBRElement
          ? 1
          : getComposerText(chips.splice(0, 1)).length;
    offset += length;
    return { end: offset, node, start: offset - length };
  });
}

function spliceText(
  value: ComposerValue,
  start: number,
  end: number,
  insert: readonly ComposerPart[],
): ComposerValue {
  let offset = 0;
  return value.flatMap((part): ComposerPart[] => {
    const from = offset;
    offset += getComposerText([part]).length;
    if (part.type !== "text" || start < from || start >= offset) return [part];
    const text = (cut: string): ComposerPart[] =>
      cut ? [{ text: cut, type: "text" }] : [];
    return [
      ...text(part.text.slice(0, start - from)),
      ...insert,
      ...text(part.text.slice(end - from)),
    ];
  });
}

function PersonAvatar({ item }: { item: ComposerItemValue }) {
  return (
    <Avatar
      aria-hidden="true"
      className="mt-0.5 self-start [--avatar-size:--spacing(5)] sm:mt-0"
    >
      {photos[item.id] && <AvatarImage alt="" src={photos[item.id]} />}
      <AvatarFallback>
        {item.label
          .split(" ")
          .map((word) => word[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}

function Dot({ color, className }: { color?: string; className: string }) {
  return <span className={`shrink-0 rounded-full ${color} ${className}`} />;
}

export default function Particle() {
  const [value, setValue] = useState<ComposerValue>([]);
  const [queryText, setQueryText] = useState("");
  const { contains, startsWith } = useComposerFilter();
  const sectionId = useId();
  const inputRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const caretAfter = useRef<number | null>(null);
  const keptOpen = useRef(false);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const target = caretAfter.current;
    if (!input || target === null) return;
    caretAfter.current = null;
    const segment = getSegments(input, value).find(
      ({ node, start, end }) =>
        node instanceof Text && start <= target && target <= end,
    );
    if (!segment) return;
    window.getSelection()?.collapse(segment.node, target - segment.start);
    document.dispatchEvent(new Event("selectionchange"));
  });

  function findQuery() {
    const input = inputRef.current;
    const selection = window.getSelection();
    if (!input || !selection?.isCollapsed) return null;
    const segment = getSegments(input, value).find(
      ({ node }) => node === selection.anchorNode,
    );
    if (!segment) return null;
    const caret = segment.start + selection.anchorOffset;
    const start = getComposerText(value).lastIndexOf("@", caret - 1);
    return start < 0 ? null : { caret, start };
  }

  function mentionAndKeepOpen(item: ComposerItemValue) {
    const query = findQuery();
    if (!query) return;
    const chip: ComposerPart = {
      id: item.id,
      kind: item.kind,
      label: item.label,
      trigger: "@",
      type: "mention",
    };
    const typed = getComposerText(value).slice(query.start, query.caret);
    const insert: ComposerPart[] = [chip, { text: ` ${typed}`, type: "text" }];
    keptOpen.current = true;
    caretAfter.current = query.start + getComposerText(insert).length;
    setValue(spliceText(value, query.start, query.caret, insert));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.nativeEvent.isComposing) return;
    const highlighted =
      listRef.current?.querySelector<HTMLElement>("[data-highlighted]");
    if (!highlighted) return;
    if (event.key === "Enter" && event.shiftKey) {
      const item = items.find((entry) => entry.id === highlighted.dataset.id);
      if (!item) return;
      event.preventDefault();
      mentionAndKeepOpen(item);
    } else if (event.key === "Escape" && keptOpen.current) {
      const query = findQuery();
      if (!query) return;
      caretAfter.current = query.start;
      setValue(spliceText(value, query.start, query.caret, []));
    }
  }

  const matches = [...members, ...contacts, ...tagItems].filter(
    (item) =>
      contains(item.label, queryText) ||
      (item.kind === "member" && contains(item.description ?? "", queryText)) ||
      (item.kind === "contact" &&
        tagsOf(item.label).some((tag) => contains(tag.label, queryText))),
  );

  const startsTag = (item: ComposerItemValue) =>
    item.kind === "tag" && startsWith(item.label, queryText);
  const tagFirst = queryText.length >= 2 && matches.some(startsTag);
  const visibleSections = (
    tagFirst ? [sections[2], sections[0], sections[1]] : sections
  )
    .map((section) => ({
      ...section,
      items: matches
        .filter((item) => item.kind === section.kind)
        .sort((a, b) => Number(startsTag(b)) - Number(startsTag(a))),
    }))
    .filter((section) => section.items.length);
  const items = visibleSections.flatMap((section) => section.items);

  return (
    <Composer
      className="w-full max-w-xl"
      getSuggestionsAnnouncement={(count) =>
        `${count} suggestion${count === 1 ? "" : "s"} available. Use the up and down arrow keys to navigate. Hold Shift while pressing Enter to mention several.`
      }
      onQueryChange={(query) => {
        if (!query) keptOpen.current = false;
        setQueryText(query?.text ?? "");
      }}
      onSubmit={() => setValue([])}
      onValueChange={setValue}
      triggers={[{ character: "@", filter: null, items }]}
      value={value}
    >
      <ComposerInput
        aria-label="Message"
        onKeyDown={handleKeyDown}
        placeholder="Type @ to mention someone or a tag…"
        ref={inputRef}
        renderToken={(token) =>
          token.kind === "tag" ? (
            <ComposerToken
              icon={
                <Dot
                  className="inline-block size-2"
                  color={tags.find((tag) => tag.id === token.id)?.color}
                />
              }
              token={token}
              variant="chip"
            />
          ) : (
            <ComposerToken token={token} variant="chip">
              {token.trigger}
              {token.label}
            </ComposerToken>
          )
        }
      />
      <ComposerPopup>
        <ComposerList ref={listRef}>
          {visibleSections.map(({ items: sectionItems, kind, label }) => {
            const labelId = `${sectionId}-${kind}`;
            return (
              <div
                aria-labelledby={labelId}
                className="[[role=group]+&]:mt-1.5"
                key={kind}
                role="group"
              >
                <div
                  className="px-2 py-1.5 font-medium text-muted-foreground text-xs"
                  id={labelId}
                >
                  {label}
                </div>
                {sectionItems.map((item) => {
                  const tag = tags.find((entry) => entry.id === item.id);
                  const personTags =
                    item.kind === "contact" ? tagsOf(item.label) : [];
                  return (
                    <ComposerItem
                      data-id={item.id}
                      key={item.id}
                      onClick={(event: ItemClickEvent) => {
                        if (!event.shiftKey) return;
                        event.preventBaseUIHandler?.();
                        mentionAndKeepOpen(item);
                      }}
                      value={item}
                    >
                      {tag ? (
                        <span
                          aria-hidden="true"
                          className="flex size-5 shrink-0 items-center justify-center"
                        >
                          <Dot className="size-2" color={tag.color} />
                        </span>
                      ) : (
                        <PersonAvatar item={item} />
                      )}
                      <span
                        className={`flex min-w-0 flex-auto ${tag ? "items-baseline gap-2" : "flex-col"}`}
                      >
                        <span className="max-w-full shrink-0 truncate">
                          {item.label}
                        </span>
                        <span className="min-w-0 truncate text-muted-foreground text-xs">
                          {item.description}
                        </span>
                      </span>
                      {personTags.length > 0 && (
                        <span className="flex flex-wrap items-center justify-end gap-1">
                          {personTags.map((personTag) => (
                            <Badge key={personTag.id} variant="outline">
                              <Dot
                                className="size-1.5"
                                color={personTag.color}
                              />
                              {personTag.label}
                            </Badge>
                          ))}
                        </span>
                      )}
                    </ComposerItem>
                  );
                })}
              </div>
            );
          })}
        </ComposerList>
        <div
          aria-hidden="true"
          className="flex pointer-coarse:hidden items-center gap-1.5 border-t px-3 py-2 text-muted-foreground text-xs"
        >
          Hold <Kbd>Shift</Kbd> to mention several
        </div>
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
  );
}
