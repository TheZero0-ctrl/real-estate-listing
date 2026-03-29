"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { fetchListingDetail } from "@/lib/listings-api";
import { getViewerModeSnapshot, subscribeToViewerMode } from "@/lib/viewer-mode";
import type { ListingDetail } from "@/types/listings";
import type { ViewerMode } from "@/types/listings";

function formatPrice(amount: number, currency: string): string {
  if (currency === "RS") {
    return `RS ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(amount)}`;
  }

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listingId = params.id;
  const viewerMode = useSyncExternalStore<ViewerMode>(
    subscribeToViewerMode,
    getViewerModeSnapshot,
    (): ViewerMode => "user",
  );

  const [response, setResponse] = useState<{ key: string; listing: ListingDetail } | null>(null);
  const [statusByKey, setStatusByKey] = useState<Record<string, "error" | "not_found">>({});
  const requestKey = `${viewerMode}:${listingId}`;
  const listing = response?.key === requestKey ? response.listing : null;
  const keyedStatus = statusByKey[requestKey];
  const isLoading = !keyedStatus && !listing;
  const isError = keyedStatus === "error";
  const isNotFound = keyedStatus === "not_found" || !listing;

  useEffect(() => {
    let cancelled = false;

    fetchListingDetail(listingId, viewerMode)
      .then((payload) => {
        if (cancelled) return;

        if (payload.status === 404 || !payload.data) {
          setStatusByKey((previous) => ({ ...previous, [requestKey]: "not_found" }));
          setResponse(null);
          return;
        }

        setResponse({ key: requestKey, listing: payload.data });
        setStatusByKey((previous) => {
          if (!previous[requestKey]) {
            return previous;
          }

          const next = { ...previous };
          delete next[requestKey];
          return next;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setStatusByKey((previous) => ({ ...previous, [requestKey]: "error" }));
          setResponse(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [listingId, viewerMode, requestKey]);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-sm text-[#5c5750]">Loading listing...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <h1 className="text-3xl leading-tight">Listing detail</h1>
        <p className="mt-2 text-sm text-[#7a342a]">We could not load this listing right now.</p>
      </section>
    );
  }

  if (isNotFound) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <h1 className="text-3xl leading-tight">Listing not found</h1>
        <p className="mt-2 text-sm text-[#5c5750]">This listing is unavailable or not visible in current mode.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Listing Detail
      </p>
      <h1 className="mt-2 text-3xl leading-tight">{listing.title}</h1>
      {listing.headline ? <p className="mt-2 text-sm text-[#5c5750]">{listing.headline}</p> : null}

      <div className="mt-5 relative h-64 w-full overflow-hidden rounded-xl bg-[var(--surface-muted)] sm:h-80">
        {listing.thumbnail_url ? (
          <Image
            src={listing.thumbnail_url}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#6f695f]">
            No image available
          </div>
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold text-[#183f3b]">
        {formatPrice(listing.price, listing.currency)}
      </p>
      <p className="mt-1 text-sm text-[#5c5750]">
        {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.property_type}
      </p>

      <p className="mt-3 text-sm text-[#5c5750]">
        {listing.street_address ? `${listing.street_address}, ` : ""}
        {listing.suburb}
        {listing.state ? `, ${listing.state}` : ""}
        {listing.postcode ? ` ${listing.postcode}` : ""}
      </p>

      {listing.description ? <p className="mt-4 text-sm leading-7">{listing.description}</p> : null}

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
        <h2 className="text-xl">Agent</h2>
        <p className="mt-1 text-sm">{listing.agent.full_name}</p>
        {listing.agent.agency_name ? <p className="mt-1 text-sm">{listing.agent.agency_name}</p> : null}
        {listing.agent.phone ? <p className="mt-1 text-sm">{listing.agent.phone}</p> : null}
      </div>

      {listing.internal_status_notes ? (
        <div className="mt-4 rounded-xl border border-[#c9b8a7] bg-[#f6ede3] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b4b2f]">Internal Notes</p>
          <p className="mt-1 text-sm text-[#4c3927]">{listing.internal_status_notes}</p>
        </div>
      ) : null}

    </section>
  );
}
