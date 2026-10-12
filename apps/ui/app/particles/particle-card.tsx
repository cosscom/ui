import { Icons } from "@coss/ui/shared/icons";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cache } from "react";
import { Index } from "@/registry/__index__";
import { Button, buttonVariants } from "@/registry/default/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerPopup,
  DrawerTrigger,
} from "@/registry/default/ui/drawer";
import { ParticleCardContainer } from "./particle-card-container";
import { CodeBlockCommand } from "@/components/code-block-command";
import { ComponentSource } from "@/components/component-source";
import { CopyRegistry } from "@/components/copy-registry";
import { getRegistryItem } from "@/lib/registry";

const getCachedRegistryItem = cache(async (name: string) => {
  return await getRegistryItem(name);
});

function ParticleRenderer({ name }: { name: string }) {
  const item = Index[name];
  const Component = item?.component;

  if (!Component) {
    return (
      <p className="text-muted-foreground text-sm">
        Component {name} not found
      </p>
    );
  }

  return <Component currentPage={1} totalPages={10} totalResults={100} />;
}

export async function ParticleCard({
  name,
  className,
  colSpan,
}: {
  name: string;
  className?: string;
  colSpan?: number;
}) {
  const cossuiUrl = process.env.NEXT_PUBLIC_APP_URL || "https://coss.com/ui";

  const particle = await getCachedRegistryItem(name);

  if (!particle) {
    return null;
  }

  return (
    <ParticleCardContainer
      className={className}
      colSpan={colSpan}
      footer={
        <>
          <p className="flex flex-1 gap-1 truncate text-muted-foreground text-xs">
            <HugeiconsIcon
              className="size-3 h-lh shrink-0"
              icon={InformationCircleIcon}
              strokeWidth={2}
            />
            <span className="truncate">{particle.description}</span>
          </p>
          <div className="flex items-center gap-1.5">
            {process.env.NODE_ENV === "development" && (
              <Button
                className="text-xs"
                disabled
                size="sm"
                title="Particle name"
                variant="outline"
              >
                {particle.name}
              </Button>
            )}
            <CopyRegistry
              value={`${cossuiUrl}/r/${name}.json`}
              variant="outline"
            />
            <Drawer position="right">
              <DrawerTrigger
                className={buttonVariants({
                  className: "text-sm",
                  size: "sm",
                  variant: "outline",
                })}
              >
                View code
              </DrawerTrigger>
              <DrawerPopup
                className="max-w-4xl"
                showBar
                showCloseButton={false}
                variant="straight"
              >
                <DrawerContent className="flex flex-1 flex-col overflow-hidden p-6">
                  <div>
                    <h2 className="mb-4 font-heading font-semibold text-xl">
                      Installation
                    </h2>
                    <figure data-rehype-pretty-code-figure>
                      <CodeBlockCommand
                        __bun__={`bunx --bun shadcn@latest add @coss/${name}`}
                        __npm__={`npx shadcn@latest add @coss/${name}`}
                        __pnpm__={`pnpm dlx shadcn@latest add @coss/${name}`}
                        __yarn__={`yarn dlx shadcn@latest add @coss/${name}`}
                      />
                    </figure>
                  </div>
                  <div className="flex h-full flex-1 flex-col overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="mt-6 mb-4 font-heading font-semibold text-xl">
                        Code
                      </h2>
                      <a
                        className={buttonVariants({ variant: "outline" })}
                        href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(`${cossuiUrl}/r/${name}.json`)}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Open in<span className="sr-only">v0</span>
                        <Icons.v0 className="size-5" />
                      </a>
                    </div>
                    <ComponentSource
                      className="flex min-h-0 flex-1 flex-col *:data-rehype-pretty-code-figure:mt-0"
                      collapsible={false}
                      name={name}
                    />
                  </div>
                </DrawerContent>
              </DrawerPopup>
            </Drawer>
          </div>
        </>
      }
    >
      <div data-particle data-slot="preview">
        <ParticleRenderer name={name} />
      </div>
    </ParticleCardContainer>
  );
}
