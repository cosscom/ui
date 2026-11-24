const COSS_URL = "https://coss.com";

/** coss.com's pages worth knowing about, linked from the footer. */
const COSS_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/products/email", label: "Email API" },
  { href: "/products/sms", label: "SMS API" },
  { href: "/products/scheduling", label: "Scheduling API" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 py-8 before:absolute before:-inset-x-32 before:top-0 before:h-px before:bg-[linear-gradient(to_right,--theme(--color-border/.3),--theme(--color-border)_200px,--theme(--color-border)_calc(100%-200px),--theme(--color-border/.3))] md:mt-20">
      <div
        aria-hidden="true"
        className="before:absolute before:-top-px before:-left-12 before:z-10 before:-ml-px before:size-[3px] before:bg-ring/50 after:absolute after:-top-px after:-right-12 after:z-10 after:-mr-px after:size-[3px] after:bg-ring/50"
      />
      <div className="flex justify-between gap-x-8 gap-y-3 text-muted-foreground text-sm max-sm:text-center max-md:flex-col">
        <div className="flex flex-col gap-1">
          <p>
            Free and open source, funded by{" "}
            <a
              className="font-medium text-foreground underline-offset-4 hover:underline"
              href={`${COSS_URL}/`}
            >
              coss.com
            </a>
            : one API for email, SMS, scheduling and more.
          </p>
          <p>&copy; {new Date().getFullYear()} coss.com</p>
        </div>
        <nav aria-label="coss.com">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 max-sm:justify-center">
            {COSS_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="underline-offset-4 hover:text-foreground hover:underline"
                  href={`${COSS_URL}${link.href}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
