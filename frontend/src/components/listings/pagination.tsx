import Link from "next/link";

import { toListingsQueryParams } from "@/lib/listings-search-params";
import type { ListingsFilters, PaginationMeta } from "@/types/listings";

type PaginationProps = {
  meta: PaginationMeta;
  filters: ListingsFilters;
};

function hrefForPage(page: number, filters: ListingsFilters): string {
  const params = toListingsQueryParams({ ...filters, page });
  return `/listings?${params.toString()}`;
}

export default function Pagination({ meta, filters }: PaginationProps) {
  if (meta.total_pages <= 1) {
    return null;
  }

  const previousPage = Math.max(meta.page - 1, 1);
  const nextPage = Math.min(meta.page + 1, meta.total_pages);

  return (
    <nav className="mt-6 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      {meta.page > 1 ? (
        <Link href={hrefForPage(previousPage, filters)} className="text-sm font-semibold underline">
          Previous
        </Link>
      ) : (
        <span className="text-sm text-[#8c8578]">Previous</span>
      )}

      <p className="text-sm font-medium">
        Page {meta.page} of {meta.total_pages}
      </p>

      {meta.page < meta.total_pages ? (
        <Link href={hrefForPage(nextPage, filters)} className="text-sm font-semibold underline">
          Next
        </Link>
      ) : (
        <span className="text-sm text-[#8c8578]">Next</span>
      )}
    </nav>
  );
}
