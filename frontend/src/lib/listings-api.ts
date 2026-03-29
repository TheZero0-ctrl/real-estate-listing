import { toListingsQueryParams } from "@/lib/listings-search-params";
import type {
  ListingDetail,
  ListingsFilters,
  PaginatedResponse,
  ViewerMode,
} from "@/types/listings";
import type { ListingCard } from "@/types/listings";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "http://127.0.0.1:3000";

function viewerHeaders(viewerMode: ViewerMode): HeadersInit {
  if (viewerMode === "admin") {
    return { "X-Admin": "true" };
  }

  return {};
}

export async function fetchListings(
  filters: ListingsFilters,
  viewerMode: ViewerMode,
): Promise<PaginatedResponse<ListingCard>> {
  const query = toListingsQueryParams(filters);
  const response = await fetch(`${API_BASE_URL}/api/v1/listings?${query.toString()}`, {
    headers: {
      Accept: "application/json",
      ...viewerHeaders(viewerMode),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listings (${response.status})`);
  }

  return (await response.json()) as PaginatedResponse<ListingCard>;
}

export async function fetchListingDetail(
  listingId: string,
  viewerMode: ViewerMode,
): Promise<{ status: number; data: ListingDetail | null }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/listings/${listingId}`, {
    headers: {
      Accept: "application/json",
      ...viewerHeaders(viewerMode),
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return { status: 404, data: null };
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch listing detail (${response.status})`);
  }

  const payload = (await response.json()) as { data: ListingDetail };
  return { status: response.status, data: payload.data };
}
