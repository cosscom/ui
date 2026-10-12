export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/shipyard";

export const appConfig = {
  description:
    "Shipyard runs Claude Code, Codex and other coding agents on your own dev boxes. Work with them from your laptop; close it, and they keep going.",
  github: {
    href: "https://github.com/cosscom/shipyard",
    repo: "cosscom/shipyard",
  },
  name: "Shipyard",
  navItems: [
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/#install-now",
      label: "Download",
    },
  ],
  // The app's downloads, the live demo and the box's install line stay on
  // berthd.app, built and published from the cosscom/shipyard repository.
  links: {
    demo: "https://berthd.app/demo/",
    install: "https://berthd.app/install",
    linuxAppImage:
      "https://github.com/cosscom/shipyard/releases/latest/download/Berth-linux-x86_64-alpha.AppImage",
    linuxDeb:
      "https://github.com/cosscom/shipyard/releases/latest/download/Berth-linux-x86_64-alpha.deb",
    macDmg:
      "https://github.com/cosscom/shipyard/releases/latest/download/Berth-macos-universal.dmg",
  },
  url: "https://coss.com/shipyard",
};
