"use client";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@coss/ui/components/alert-dialog";
import { Button, buttonVariants } from "@coss/ui/components/button";
import {
  Card,
  CardFrame,
  CardFrameAction,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@coss/ui/components/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@coss/ui/components/empty";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@coss/ui/components/menu";
import { Switch } from "@coss/ui/components/switch";
import { toastManager } from "@coss/ui/components/toast";
import {
  EllipsisIcon,
  PencilIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemHeader,
  ListItemSpanningTrigger,
  ListItemTitle,
} from "@/components/list-item";

export type AttributeItem = {
  details: string;
  enabled?: boolean;
  id: string;
  name: string;
};

/** Empty state when there are no attributes, or the Custom list + remove dialog when there are. */
export function AttributesSection({
  attributes,
}: {
  attributes: AttributeItem[];
}) {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [attributeToRemove, setAttributeToRemove] =
    useState<AttributeItem | null>(null);

  const visibleAttributes = useMemo(
    () => attributes.filter((a) => !removedIds.includes(a.id)),
    [attributes, removedIds],
  );

  const [enabledById, setEnabledById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(attributes.map((a) => [a.id, a.enabled ?? true])),
  );

  function handleRemoveDialogOpenChange(open: boolean) {
    setRemoveDialogOpen(open);
  }

  function handleRemoveDialogOpenChangeComplete(open: boolean) {
    if (!open) {
      setAttributeToRemove(null);
    }
  }

  function requestRemove(attribute: AttributeItem) {
    setAttributeToRemove(attribute);
    setRemoveDialogOpen(true);
  }

  function handleRemoveConfirm() {
    if (!attributeToRemove) return;
    setRemovedIds((prev) => [...prev, attributeToRemove.id]);
    setRemoveDialogOpen(false);
  }

  function handleEnabledChange(attributeId: string, checked: boolean) {
    setEnabledById((prev) => ({
      ...prev,
      [attributeId]: checked,
    }));
    toastManager.add({
      title: "Attribute updated successfully",
      type: "success",
    });
  }

  if (visibleAttributes.length === 0) {
    return (
      <Empty className="rounded-xl border border-dashed py-8 md:py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TagIcon />
          </EmptyMedia>
          <EmptyTitle>Add attributes</EmptyTitle>
          <EmptyDescription>
            Add attributes to your team members
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            className={buttonVariants()}
            href="/settings/organizations/attributes/new"
          >
            <PlusIcon aria-hidden="true" />
            New attribute
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <CardFrame>
        <CardFrameHeader>
          <CardFrameTitle>Custom</CardFrameTitle>
          <CardFrameAction>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/settings/organizations/attributes/new"
            >
              <PlusIcon aria-hidden="true" />
              Add
            </Link>
          </CardFrameAction>
        </CardFrameHeader>
        <Card className="rounded-b-none!">
          <CardPanel className="p-0">
            {visibleAttributes.map((attribute) => {
              const editHref = `/settings/organizations/attributes/${encodeURIComponent(attribute.id)}/edit`;

              return (
                <ListItem key={attribute.id}>
                  <ListItemContent>
                    <ListItemHeader>
                      <ListItemTitle className="truncate">
                        <ListItemSpanningTrigger
                          render={<Link href={editHref} />}
                        >
                          {attribute.name}
                        </ListItemSpanningTrigger>
                      </ListItemTitle>
                      <ListItemDescription className="line-clamp-2">
                        {attribute.details}
                      </ListItemDescription>
                    </ListItemHeader>
                  </ListItemContent>

                  <div className="flex items-center gap-4 max-md:hidden">
                    <Switch
                      className="relative"
                      checked={enabledById[attribute.id] ?? true}
                      onCheckedChange={(checked) =>
                        handleEnabledChange(attribute.id, checked)
                      }
                    />
                    <Menu>
                      <MenuTrigger
                        render={
                          <Button
                            aria-label="Attribute options"
                            size="icon"
                            type="button"
                            variant="outline"
                          />
                        }
                      >
                        <EllipsisIcon aria-hidden="true" />
                      </MenuTrigger>
                      <MenuPopup align="end" alignOffset={-4} sideOffset={8}>
                        <MenuItem render={<Link href={editHref} />}>
                          <PencilIcon aria-hidden="true" />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => requestRemove(attribute)}
                          variant="destructive"
                        >
                          <TrashIcon aria-hidden="true" />
                          Delete
                        </MenuItem>
                      </MenuPopup>
                    </Menu>
                  </div>

                  <Menu>
                    <MenuTrigger
                      className="md:hidden"
                      render={
                        <Button
                          aria-label="Attribute options"
                          size="icon"
                          type="button"
                          variant="outline"
                        />
                      }
                    >
                      <EllipsisIcon aria-hidden="true" />
                    </MenuTrigger>
                    <MenuPopup align="end" alignOffset={-4} sideOffset={8}>
                      <MenuItem render={<Link href={editHref} />}>
                        <PencilIcon aria-hidden="true" />
                        Edit
                      </MenuItem>
                      <MenuSeparator />
                      <MenuGroup>
                        <MenuCheckboxItem
                          checked={enabledById[attribute.id] ?? true}
                          onCheckedChange={(checked) =>
                            handleEnabledChange(attribute.id, checked)
                          }
                          variant="switch"
                        >
                          Enabled
                        </MenuCheckboxItem>
                      </MenuGroup>
                      <MenuSeparator />
                      <MenuItem
                        onClick={() => requestRemove(attribute)}
                        variant="destructive"
                      >
                        <TrashIcon aria-hidden="true" />
                        Delete
                      </MenuItem>
                    </MenuPopup>
                  </Menu>
                </ListItem>
              );
            })}
          </CardPanel>
        </Card>
      </CardFrame>

      <AlertDialog
        onOpenChange={handleRemoveDialogOpenChange}
        onOpenChangeComplete={handleRemoveDialogOpenChangeComplete}
        open={removeDialogOpen}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove attribute</AlertDialogTitle>
            <AlertDialogDescription>
              {attributeToRemove
                ? `Are you sure you want to remove the attribute '${attributeToRemove.name}'? All users currently assigned to it will be unassigned.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              Cancel
            </AlertDialogClose>
            <AlertDialogClose
              onClick={handleRemoveConfirm}
              render={<Button variant="destructive">Remove attribute</Button>}
            />
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}
