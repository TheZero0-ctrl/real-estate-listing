"use client";

import Link from "next/link";
import ViewerModeToggle from "@/components/listings/viewer-mode-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <section className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[0_12px_35px_rgba(30,26,19,0.08)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Real Estate Search
        </p>
        <h1 className="mt-3 text-4xl leading-tight text-[var(--foreground)]">
          Real Estate Listings
        </h1>
        <p className="mt-3 text-sm text-[color:color-mix(in_oklab,var(--foreground)_68%,white)]">
          Browse listings and open details in one clean flow.
        </p>

        <div className="mt-6 flex justify-center">
          <ViewerModeToggle />
        </div>

        <div className="mt-8">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-full border border-[#163835] bg-[#1f4f4a] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,79,74,0.2)] transition-all hover:bg-[#183f3b] hover:shadow-[0_10px_24px_rgba(24,63,59,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4f4a] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          >
            Browse Listings
          </Link>
        </div>
      </section>
    </main>
  );
}
