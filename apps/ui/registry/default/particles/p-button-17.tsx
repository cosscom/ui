import Link from "next/link";
import { buttonVariants } from "@/registry/default/ui/button";

export default function Particle() {
  return (
    <Link className={buttonVariants()} href="/">
      Link
    </Link>
  );
}
