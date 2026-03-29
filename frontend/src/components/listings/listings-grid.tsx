import ListingCard from "@/components/listings/listing-card";
import type { ListingCard as ListingCardType } from "@/types/listings";

type ListingsGridProps = {
  listings: ListingCardType[];
};

export default function ListingsGrid({ listings }: ListingsGridProps) {
  if (listings.length === 0) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <h2 className="text-2xl">No matching listings</h2>
        <p className="mt-2 text-sm text-[#5c5750]">Try broadening your filters and search terms.</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {listings.map((listing, index) => (
        <ListingCard key={listing.id} listing={listing} isPriority={index === 0} />
      ))}
    </section>
  );
}
