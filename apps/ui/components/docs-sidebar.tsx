"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/registry/default/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/default/ui/sidebar";
import { GROUPS_NEW, PAGES_NEW } from "@/lib/docs";
import type { source } from "@/lib/source";

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
  const pathname = usePathname();

  return (
    <Sidebar
      className="sticky top-(--header-height) z-30 hidden h-[calc(100svh-var(--header-height))] bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="px-4 py-2">
        <div className="h-(--top-spacing) shrink-0" />
        {tree.children.map((item) => (
          <SidebarGroup className="gap-1" key={item.$id}>
            <SidebarGroupLabel className="h-7 gap-2 px-0 text-sidebar-accent-foreground">
              {item.name}
              {typeof item.name === "string" &&
                GROUPS_NEW.includes(item.name) && (
                  <Badge variant="info">New</Badge>
                )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {item.type === "folder" && (
                <SidebarMenu className="gap-0.5">
                  {item.children.map((item) => {
                    return (
                      item.type === "page" && (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            className="ps-3.5 hover:bg-transparent active:bg-transparent"
                            isActive={item.url === pathname}
                            render={<Link href={item.url} />}
                          >
                            {item.name}
                            {PAGES_NEW.length > 0 &&
                              PAGES_NEW.includes(item.url as never) && (
                                <Badge variant="info">New</Badge>
                              )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    );
                  })}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
