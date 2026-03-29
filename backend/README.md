# Backend (Rails API)

Rails API for the real-estate listing.

## Requirements

- Ruby (project is configured with Ruby 4.0.0)
- Bundler
- PostgreSQL

## Setup

```bash
cd backend
bundle install
bin/rails db:prepare
bin/rails db:seed
```

Default seed creates deterministic local development data.

## Run the API

```bash
cd backend
bin/rails server
```

API base URL: `http://localhost:3000/api/v1`

## Endpoints

- `GET /api/v1/listings`
- `GET /api/v1/listings/:id`

## Query parameters (`GET /api/v1/listings`)

- `price_min`
- `price_max`
- `beds`
- `baths`
- `property_type`
- `suburb`
- `keyword`
- `page`
- `per_page`
- `sort[key]`
- `sort[direction]`

## Admin mode behavior

- Admin mode is controlled by request header `X-Admin: true`.
- Public mode is default (header omitted or false).
- Admin mode includes admin-only fields like `internal_status_notes` in detail responses.

Example:

```bash
curl -H "X-Admin: true" "http://localhost:3000/api/v1/listings/1"
```

## API examples

```bash
# listings index
curl "http://localhost:3000/api/v1/listings?suburb=kathmandu&sort%5Bkey%5D=created&sort%5Bdirection%5D=desc"

# listings detail
curl "http://localhost:3000/api/v1/listings/1"
```

## Run tests

```bash
cd backend
bin/rails test
```

## Performance dataset

Seed a large deterministic dataset for benchmarking:

```bash
cd backend
bin/rails data:seed_large_listings
```

## Notes

- Root project instructions are in `README.md`.
