"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import FiltersForm from "@/components/listings/filters-form";
import ListingsGrid from "@/components/listings/listings-grid";
import Pagination from "@/components/listings/pagination";
import { fetchListings } from "@/lib/listings-api";
import { parseListingsFiltersFromURLSearchParams } from "@/lib/listings-search-params";
import { getViewerModeSnapshot, subscribeToViewerMode } from "@/lib/viewer-mode";
import type { PaginatedResponse } from "@/types/listings";
import type { ListingCard } from "@/types/listings";
import type { ViewerMode } from "@/types/listings";

export default function ListingsPageClient() {
  const searchParams = useSearchParams();
  const viewerMode = useSyncExternalStore<ViewerMode>(
    subscribeToViewerMode,
    getViewerModeSnapshot,
    (): ViewerMode => "user",
  );
  const [response, setResponse] = useState<{
    key: string;
    payload: PaginatedResponse<ListingCard>;
  } | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const filters = useMemo(
    () => parseListingsFiltersFromURLSearchParams(searchParams),
    [searchParams],
  );
  const requestKey = `${viewerMode}:${searchParams.toString()}`;
  const payload = response?.key === requestKey ? response.payload : null;
  const hasError = errorKey === requestKey;
  const isLoading = !hasError && !payload;

  useEffect(() => {
    let cancelled = false;

    fetchListings(filters, viewerMode)
      .then((nextPayload) => {
        if (!cancelled) {
          setResponse({ key: requestKey, payload: nextPayload });
          setErrorKey(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorKey(requestKey);
          setResponse(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, viewerMode, requestKey]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <h1 className="text-3xl leading-tight">Listings</h1>
        <p className="mt-2 text-sm text-[#5c5750]">Search by suburb, budget, and property details.</p>
        {payload ? (
          <p className="mt-3 text-sm font-medium">
            {payload.meta.total_count} result{payload.meta.total_count === 1 ? "" : "s"}
          </p>
        ) : null}
      </section>

      <FiltersForm key={searchParams.toString()} filters={filters} />

      {hasError ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-sm text-[#7a342a]">We could not load listings right now. Please try again.</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-sm text-[#5c5750]">Loading listings...</p>
        </section>
      ) : null}

      {payload ? <ListingsGrid listings={payload.data} /> : null}
      {payload ? <Pagination meta={payload.meta} filters={filters} /> : null}
    </div>
  );
}
