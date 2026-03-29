import Image from "next/image";
import Link from "next/link";

import type { ListingCard } from "@/types/listings";

type ListingCardProps = {
  listing: ListingCard;
  isPriority?: boolean;
};

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

export default function ListingCard({ listing, isPriority = false }: ListingCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <Link href={`/listings/${listing.id}`} className="mb-4 block">
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-[var(--surface-muted)]">
          {listing.thumbnail_url ? (
            <Image
              src={listing.thumbnail_url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={isPriority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[#6f695f]">
              No image available
            </div>
          )}
        </div>
      </Link>

      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-2xl leading-tight">
          <Link href={`/listings/${listing.id}`} className="hover:underline">
            {listing.title}
          </Link>
        </h2>
        <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-xs font-semibold uppercase tracking-wide">
          {listing.listing_status}
        </span>
      </div>

      {listing.headline ? <p className="text-sm text-[#5c5750]">{listing.headline}</p> : null}

      <p className="mt-3 text-lg font-semibold text-[#183f3b]">
        {formatPrice(listing.price, listing.currency)}
      </p>

      <p className="mt-1 text-sm text-[#5c5750]">
        {listing.bedrooms} bed • {listing.bathrooms} bath • {listing.property_type}
      </p>
      <p className="mt-1 text-sm text-[#5c5750]">
        {listing.suburb}
        {listing.state ? `, ${listing.state}` : ""}
      </p>
      <p className="mt-1 text-sm text-[#5c5750]">Agent: {listing.agent_name}</p>

    </article>
  );
}
