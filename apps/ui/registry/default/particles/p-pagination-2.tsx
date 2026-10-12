import Link from "next/link";
import { Button, buttonVariants } from "@/registry/default/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/registry/default/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Particle({ currentPage, totalPages }: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between gap-2">
        <PaginationItem>
          {currentPage === 1 ? (
            <Button disabled variant="outline">
              Previous
            </Button>
          ) : (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`#/page/${currentPage - 1}`}
            >
              Previous
            </Link>
          )}
        </PaginationItem>
        <PaginationItem>
          {currentPage === totalPages ? (
            <Button disabled variant="outline">
              Next
            </Button>
          ) : (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`#/page/${currentPage + 1}`}
            >
              Next
            </Link>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
