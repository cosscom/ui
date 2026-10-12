import Link from "next/link";
import { buttonVariants } from "@/registry/default/ui/button";
import {
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerSwipeArea,
  DrawerTitle,
} from "@/registry/default/ui/drawer";

export default function Particle() {
  return (
    <div className="relative min-h-80 w-full overflow-hidden rounded-xl border">
      <Drawer modal={false} position="left">
        <DrawerSwipeArea className="absolute border-input border-e border-dashed bg-muted">
          <span className="pointer-events-none absolute top-1/2 left-0 ms-2 -translate-y-1/2 rotate-90 whitespace-nowrap font-medium text-muted-foreground text-xs uppercase">
            Swipe area
          </span>
        </DrawerSwipeArea>

        <div className="flex min-h-80 items-center justify-center p-6 ps-14 text-center">
          <p className="max-w-56 text-balance text-muted-foreground text-sm">
            Swipe from the left edge to open the menu.
          </p>
        </div>

        <DrawerPopup position="left" showCloseButton variant="straight">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerPanel>
            <nav className="-mx-[calc(--spacing(3)-1px)] flex flex-col gap-0.5">
              <Link
                className={buttonVariants({
                  className: "justify-start",
                  variant: "ghost",
                })}
                href="#"
              >
                Home
              </Link>
              <Link
                className={buttonVariants({
                  className: "justify-start",
                  variant: "ghost",
                })}
                href="#"
              >
                Profile
              </Link>
              <Link
                className={buttonVariants({
                  className: "justify-start",
                  variant: "ghost",
                })}
                href="#"
              >
                Settings
              </Link>
              <Link
                className={buttonVariants({
                  className: "justify-start",
                  variant: "ghost",
                })}
                href="#"
              >
                Sign out
              </Link>
            </nav>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </div>
  );
}
