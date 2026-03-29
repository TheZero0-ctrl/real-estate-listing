import type { ListingsFilters, SortDirection, SortKey } from "@/types/listings";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 12;
const DEFAULT_SORT_KEY: SortKey = "created";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export const DEFAULT_LISTINGS_FILTERS: ListingsFilters = {
  suburb: "",
  keyword: "",
  property_type: "",
  beds: "",
  baths: "",
  price_min: "",
  price_max: "",
  page: DEFAULT_PAGE,
  per_page: DEFAULT_PER_PAGE,
  sortKey: DEFAULT_SORT_KEY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

type RawSearchParams = Record<string, string | string[] | undefined>;

const SORT_KEYS: SortKey[] = ["created", "published", "price", "beds", "baths"];
const SORT_DIRECTIONS: SortDirection[] = ["asc", "desc"];

function firstParamValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function normalizeText(value: string): string {
  return value.trim();
}

function parsePositiveInteger(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function parseSortKey(value: string): SortKey {
  return SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : DEFAULT_SORT_KEY;
}

function parseSortDirection(value: string): SortDirection {
  const normalized = value.toLowerCase();
  return SORT_DIRECTIONS.includes(normalized as SortDirection)
    ? (normalized as SortDirection)
    : DEFAULT_SORT_DIRECTION;
}

export function parseListingsFilters(raw: RawSearchParams): ListingsFilters {
  return {
    suburb: normalizeText(firstParamValue(raw.suburb)) || DEFAULT_LISTINGS_FILTERS.suburb,
    keyword: normalizeText(firstParamValue(raw.keyword)) || DEFAULT_LISTINGS_FILTERS.keyword,
    property_type:
      normalizeText(firstParamValue(raw.property_type)) || DEFAULT_LISTINGS_FILTERS.property_type,
    beds: normalizeText(firstParamValue(raw.beds)) || DEFAULT_LISTINGS_FILTERS.beds,
    baths: normalizeText(firstParamValue(raw.baths)) || DEFAULT_LISTINGS_FILTERS.baths,
    price_min: normalizeText(firstParamValue(raw.price_min)) || DEFAULT_LISTINGS_FILTERS.price_min,
    price_max: normalizeText(firstParamValue(raw.price_max)) || DEFAULT_LISTINGS_FILTERS.price_max,
    page: parsePositiveInteger(firstParamValue(raw.page), DEFAULT_LISTINGS_FILTERS.page),
    per_page: parsePositiveInteger(firstParamValue(raw.per_page), DEFAULT_LISTINGS_FILTERS.per_page),
    sortKey: parseSortKey(firstParamValue(raw["sort[key]"])) || DEFAULT_LISTINGS_FILTERS.sortKey,
    sortDirection:
      parseSortDirection(firstParamValue(raw["sort[direction]"])) ||
      DEFAULT_LISTINGS_FILTERS.sortDirection,
  };
}

export function parseListingsFiltersFromURLSearchParams(
  searchParams: URLSearchParams,
): ListingsFilters {
  return parseListingsFilters({
    suburb: searchParams.get("suburb") ?? undefined,
    keyword: searchParams.get("keyword") ?? undefined,
    property_type: searchParams.get("property_type") ?? undefined,
    beds: searchParams.get("beds") ?? undefined,
    baths: searchParams.get("baths") ?? undefined,
    price_min: searchParams.get("price_min") ?? undefined,
    price_max: searchParams.get("price_max") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    per_page: searchParams.get("per_page") ?? undefined,
    "sort[key]": searchParams.get("sort[key]") ?? undefined,
    "sort[direction]": searchParams.get("sort[direction]") ?? undefined,
  });
}

export function toListingsQueryParams(filters: ListingsFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.suburb) params.set("suburb", filters.suburb);
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.property_type) params.set("property_type", filters.property_type);
  if (filters.beds) params.set("beds", filters.beds);
  if (filters.baths) params.set("baths", filters.baths);
  if (filters.price_min) params.set("price_min", filters.price_min);
  if (filters.price_max) params.set("price_max", filters.price_max);

  params.set("page", String(filters.page));
  params.set("per_page", String(filters.per_page));
  params.set("sort[key]", filters.sortKey);
  params.set("sort[direction]", filters.sortDirection);

  return params;
}
