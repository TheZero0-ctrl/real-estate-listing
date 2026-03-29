export type ViewerMode = "user" | "admin";

export type SortKey = "created" | "published" | "price" | "beds" | "baths";
export type SortDirection = "asc" | "desc";

export type ListingCard = {
  id: number;
  title: string;
  headline: string | null;
  listing_status: string;
  suburb: string;
  state: string | null;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  thumbnail_url: string | null;
  agent_name: string;
};

export type Agent = {
  id: number;
  full_name: string;
  phone: string | null;
  agency_name: string | null;
};

export type ListingDetail = Omit<ListingCard, "agent_name"> & {
  description: string | null;
  street_address: string | null;
  postcode: string | null;
  country: string | null;
  agent: Agent;
  internal_status_notes?: string | null;
};

export type PaginationMeta = {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type ListingsFilters = {
  suburb: string;
  keyword: string;
  property_type: string;
  beds: string;
  baths: string;
  price_min: string;
  price_max: string;
  page: number;
  per_page: number;
  sortKey: SortKey;
  sortDirection: SortDirection;
};
