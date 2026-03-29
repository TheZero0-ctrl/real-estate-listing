import { Suspense } from "react";

import ListingsPageClient from "@/components/listings/listings-page-client";

function ListingsPageFallback() {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
      <h1 className="text-3xl leading-tight">Listings</h1>
      <p className="mt-3 text-sm text-[#5c5750]">Loading listings...</p>
    </section>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsPageFallback />}>
      <ListingsPageClient />
    </Suspense>
  );
}
