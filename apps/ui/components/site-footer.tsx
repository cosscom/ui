export function SiteFooter() {
  const gatewayOrigin = process.env.NEXT_PUBLIC_COSS_URL || "https://coss.com";
  const gatewayHome = `${gatewayOrigin.replace(/\/$/, "")}/`;

  return (
    <footer className="flex flex-col gap-0.5">
      <p>
        <a
          className="font-bold font-heading text-lg [font-variation-settings:'GEOM'_50,'opsz'_32]"
          href={gatewayHome}
        >
          coss.com <span className="text-muted-foreground/72">ui</span>
        </a>
      </p>
      <p className="text-muted-foreground text-sm">
        Built by and for the team of{" "}
        <a
          className="font-medium underline-offset-4 hover:underline"
          href="https://cal.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Cal.com
        </a>
        , Inc. — the leading commercial open source company
        (&ldquo;coss&rdquo;).
      </p>
    </footer>
  );
}
