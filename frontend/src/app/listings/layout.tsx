import Link from "next/link";

import ViewerModeToggle from "@/components/listings/viewer-mode-toggle";

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface-muted)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Real Estate Listings
          </Link>

          <div className="flex items-center gap-3">
            <nav className="text-sm font-medium leading-none">
              <Link href="/listings" className="hover:opacity-70 transition-opacity">
                Listings
              </Link>
            </nav>
            <ViewerModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
