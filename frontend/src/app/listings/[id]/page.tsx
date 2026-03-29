type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Listing Detail
      </p>
      <h1 className="mt-2 text-3xl leading-tight">Property #{id}</h1>
      <p className="mt-2 text-sm text-[color:color-mix(in_oklab,var(--foreground)_70%,white)]">
        Detail content comes next.
      </p>
    </section>
  );
}
