import { buttonVariants } from "@coss/ui/components/button";
import Link from "next/link";

export function SiteCta() {
  return (
    <section>
      <div className="container flex w-full items-center justify-center gap-2 px-4 sm:px-6">
        <a
          className={buttonVariants()}
          href="https://i.cal.com/forms/0129f2a8-7b15-4850-b3fb-07944dfacb3c"
          rel="noreferrer"
          target="_blank"
        >
          Join the waitlist
        </a>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="https://cal.com/jobs"
        >
          Join the company
        </Link>
      </div>
    </section>
  );
}
