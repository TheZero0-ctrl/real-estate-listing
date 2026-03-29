"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DEFAULT_LISTINGS_FILTERS,
  toListingsQueryParams,
} from "@/lib/listings-search-params";
import type { ListingsFilters, SortDirection, SortKey } from "@/types/listings";

type FiltersFormProps = {
  filters: ListingsFilters;
};

type FormFields = {
  suburb: string;
  keyword: string;
  property_type: string;
  beds: string;
  baths: string;
  price_min: string;
  price_max: string;
  per_page: number;
  sortKey: SortKey;
  sortDirection: SortDirection;
};

function toFormFields(filters: ListingsFilters): FormFields {
  return {
    suburb: filters.suburb,
    keyword: filters.keyword,
    property_type: filters.property_type,
    beds: filters.beds,
    baths: filters.baths,
    price_min: filters.price_min,
    price_max: filters.price_max,
    per_page: filters.per_page,
    sortKey: filters.sortKey,
    sortDirection: filters.sortDirection,
  };
}

export default function FiltersForm({ filters }: FiltersFormProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormFields>(() => toFormFields(filters));

  const updateField = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setFormValues((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFilters: ListingsFilters = {
      ...DEFAULT_LISTINGS_FILTERS,
      ...formValues,
      page: 1,
    };

    const params = toListingsQueryParams(nextFilters);
    router.push(`/listings?${params.toString()}`);
  };

  const handleClear = () => {
    setFormValues(toFormFields(DEFAULT_LISTINGS_FILTERS));
    router.push("/listings");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Suburb</span>
          <input
            type="text"
            name="suburb"
            value={formValues.suburb}
            onChange={(event) => updateField("suburb", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Keyword</span>
          <input
            type="text"
            name="keyword"
            value={formValues.keyword}
            onChange={(event) => updateField("keyword", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Property Type</span>
          <select
            name="property_type"
            value={formValues.property_type}
            onChange={(event) => updateField("property_type", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          >
            <option value="">Any</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Beds (minimum)</span>
          <input
            type="number"
            min="0"
            name="beds"
            value={formValues.beds}
            onChange={(event) => updateField("beds", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Baths (minimum)</span>
          <input
            type="number"
            min="0"
            step="0.5"
            name="baths"
            value={formValues.baths}
            onChange={(event) => updateField("baths", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Min Price</span>
          <input
            type="number"
            min="0"
            name="price_min"
            value={formValues.price_min}
            onChange={(event) => updateField("price_min", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Max Price</span>
          <input
            type="number"
            min="0"
            name="price_max"
            value={formValues.price_max}
            onChange={(event) => updateField("price_max", event.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Sort</span>
          <div className="grid grid-cols-2 gap-2">
            <select
              name="sort[key]"
              value={formValues.sortKey}
              onChange={(event) => updateField("sortKey", event.target.value as SortKey)}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
            >
              <option value="created">Created</option>
              <option value="published">Published</option>
              <option value="price">Price</option>
              <option value="beds">Beds</option>
              <option value="baths">Baths</option>
            </select>
            <select
              name="sort[direction]"
              value={formValues.sortDirection}
              onChange={(event) =>
                updateField("sortDirection", event.target.value as SortDirection)
              }
              className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="cursor-pointer rounded-full border border-[#163835] bg-[#1f4f4a] px-5 py-2 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
        <button type="button" onClick={handleClear} className="cursor-pointer text-sm font-medium underline">
          Clear
        </button>
      </div>
    </form>
  );
}
