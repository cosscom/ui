"use client";

import { Badge } from "@coss/ui/components/badge";
import { Button } from "@coss/ui/components/button";
import {
  Drawer,
  DrawerPanel,
  DrawerPopup,
  DrawerTrigger,
} from "@coss/ui/components/drawer";
import { Menu09Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { PAGES_NEW } from "@/lib/docs";
import type { source } from "@/lib/source";
import { cn } from "@/lib/utils";

export function MobileNav({
  tree,
  items,
  className,
}: {
  tree: typeof source.pageTree;
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer onOpenChange={setOpen} open={open} position="left">
      <DrawerTrigger
        render={
          <Button
            className={cn("relative -ms-1.5 size-8", className)}
            size="icon"
            variant="ghost"
          >
            <HugeiconsIcon
              className="size-5"
              icon={Menu09Icon}
              strokeWidth={2}
            />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        }
      />
      <DrawerPopup showCloseButton variant="straight">
        <DrawerPanel
          className="flex flex-col gap-12 p-6 pt-8"
          scrollFade={false}
        >
          <div className="flex flex-col gap-3">
            <div className="font-medium text-sm">Menu</div>
            <div className="flex flex-col gap-1">
              <MobileLink href="/" onOpenChange={setOpen}>
                Home
              </MobileLink>
              {items.map((item) => (
                <MobileLink
                  href={item.href}
                  key={item.label}
                  onOpenChange={setOpen}
                >
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {tree?.children?.map((group, index) => {
              if (group.type === "folder") {
                return (
                  <div className="flex flex-col gap-3" key={group.$id}>
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="flex flex-col gap-0.5">
                      {group.children.map((item) => {
                        if (item.type === "page") {
                          return (
                            <MobileLink
                              href={item.url}
                              key={`${item.url}-${index}`}
                              onOpenChange={setOpen}
                            >
                              {item.name}
                              {PAGES_NEW.includes(item.url) && (
                                <Badge variant="info">New</Badge>
                              )}
                            </MobileLink>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={cn("flex items-center gap-2 text-muted-foreground", className)}
      href={href}
      onClick={() => onOpenChange?.(false)}
      {...props}
    >
      {children}
    </Link>
  );
}
