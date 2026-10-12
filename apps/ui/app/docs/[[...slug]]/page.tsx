import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/registry/default/ui/button";
import { Card, CardFrame, CardPanel } from "@/registry/default/ui/card";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import { DocsCopyPage } from "@/components/docs-copy-page";
import { DocsTableOfContents } from "@/components/docs-toc";
import { SiteFooter } from "@/components/site-footer";
import { source } from "@/lib/source";
import { mdxComponents } from "@/mdx-components";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const doc = page.data;

  if (!doc.title || !doc.description) {
    notFound();
  }

  return {
    description: doc.description,
    title: `${doc.title} - coss ui`,
  };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const doc = page.data;
  const rawContent = await page.data.getText("raw");
  const MDX = doc.body;

  const links = doc.links;

  return (
    <div className="flex items-stretch xl:w-full" data-slot="docs">
      <div className="relative flex w-full min-w-0 flex-1 flex-col lg:mt-8 lg:mr-4 lg:mb-8">
        <CardFrame className="border-sidebar-border shadow-lg/5 max-lg:border-none dark:bg-background">
          <Card className="max-lg:rounded-none! dark:bg-background max-lg:[clip-path:none]!">
            <CardPanel className="px-4 py-6 sm:px-6 lg:p-8">
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex min-w-0 flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="scroll-m-20 font-bold font-heading text-3xl xl:text-4xl">
                        {doc.title}
                      </h1>
                      {doc.description && (
                        <p className="text-muted-foreground sm:text-lg">
                          {doc.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                      {links?.doc && (
                        <Link
                          className={buttonVariants({
                            size: "xs",
                            variant: "outline",
                          })}
                          href={links.doc}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <HugeiconsIcon
                            icon={LinkSquare02Icon}
                            strokeWidth={2.5}
                          />
                          API Reference
                        </Link>
                      )}
                      <DocsCopyPage page={rawContent} />
                    </div>
                  </div>
                  <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
                    <MDX components={mdxComponents} />
                  </div>
                </div>
              </div>
            </CardPanel>
          </Card>
          <div className="px-4 py-6 lg:rounded-b-2xl lg:px-8">
            <SiteFooter />
          </div>
        </CardFrame>
      </div>
      <div className="sticky top-(--header-height) z-30 ms-auto hidden h-[calc(100svh-var(--header-height))] w-72 flex-col overflow-hidden overscroll-none xl:flex">
        <ScrollArea
          className="**:data-[slot=scroll-area-scrollbar]:hidden"
          overscrollContain
          scrollFade
        >
          <div className="flex min-h-0 flex-col gap-2 py-2">
            <div className="h-(--top-spacing) shrink-0" />
            {doc.toc?.length ? <DocsTableOfContents toc={doc.toc} /> : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
