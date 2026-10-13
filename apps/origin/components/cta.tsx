import { Button } from "@/registry/default/ui/button";

export default function Cta() {
  return (
    <div className="mt-16 text-center md:mt-20">
      <h2 className="mb-6 font-heading text-3xl/[1.1] text-foreground">
        Didn&apos;t find what you were looking for?
      </h2>
      <Button asChild className="rounded-full">
        <a
          href="https://github.com/cosscom/ui/discussions/categories/suggestions"
          rel="noreferrer"
          target="_blank"
        >
          <span className="text-primary-foreground">Suggest component</span>
        </a>
      </Button>
    </div>
  );
}
