import type { ReactNode } from "react";

export function PageHero({
  children,
  illustration,
}: {
  children: ReactNode;
  illustration: ReactNode;
}) {
  return (
    <section className="container grid w-full items-center gap-6 py-10 md:py-14 lg:grid-cols-2 lg:gap-10 lg:py-16 xl:gap-16">
      <div className="flex min-w-0 flex-col items-start gap-5 [font-optical-sizing:auto] [font-synthesis:none] [&_h1]:text-balance [&_h1]:text-4xl [&_h1]:leading-[1.08] [&_h1]:[font-variation-settings:'GEOM'_50] lg:[&_h1]:text-5xl xl:[&_h1]:text-[3.5rem]">
        {children}
      </div>
      <div className="pointer-events-none mx-auto w-full max-w-140 select-none max-lg:max-w-112">
        {illustration}
      </div>
    </section>
  );
}
