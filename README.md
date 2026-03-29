# Real Estate Listing Search

## Stack

- Backend: Ruby on Rails API + PostgreSQL
- Frontend: Next.js 16 (App Router) + TypeScript
- Role behavior: request header `X-Admin: true` controls admin-only fields

## Features

- `GET /api/v1/listings` with filters for price range, beds, baths, property type, suburb, and keyword
- `GET /api/v1/listings/:id` for listing detail
- Admin-aware API fields (`internal_status_notes` visible in admin mode)
- Frontend routes:
  - `/` simple home page
  - `/listings` search + filters + pagination
  - `/listings/[id]` detail page
- Viewer mode toggle (`user`/`admin`) persisted in localStorage and sent as `X-Admin` from frontend requests

## Requirements

- Ruby (project is configured with Ruby 4.0.0)
- Bundler
- PostgreSQL
- Node.js (LTS recommended) + npm

## Getting Started

### Option A: Quick setup + run (recommended)

From the project root:

```bash
./bin/setup
./bin/dev
```

- `./bin/setup` installs backend/frontend dependencies and prepares + seeds the database.
- `./bin/dev` starts both servers via `Procfile.dev` and Foreman.
- Frontend: `http://localhost:4000`
- Backend API: `http://localhost:3000/api/v1`

### Option B: Manual setup + run

#### 1) Backend setup

```bash
cd backend
bundle install
bin/rails db:prepare
bin/rails db:seed
```

#### 2) Frontend setup

```bash
cd frontend
npm install
```

Optional environment variable for frontend API base URL:

```bash
# frontend/.env.local
NEXT_PUBLIC_BACKEND_API_BASE_URL=http://127.0.0.1:3000
```

If omitted, frontend defaults to `http://127.0.0.1:3000`.

#### 3) Run the apps

Run backend and frontend in separate terminals.

Backend terminal:

```bash
cd backend
bin/rails server
```

Backend base URL: `http://localhost:3000/api/v1`

Frontend terminal:

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:4000`

## API Examples

```bash
# listings index
curl "http://localhost:3000/api/v1/listings?suburb=kathmandu&sort%5Bkey%5D=created&sort%5Bdirection%5D=desc"

# listings detail
curl "http://localhost:3000/api/v1/listings/1"

# admin mode
curl -H "X-Admin: true" "http://localhost:3000/api/v1/listings/1"
```

## Testing

### Backend tests

```bash
cd backend
bin/rails test
```

## Seed Notes

- Default seed creates a small deterministic dataset for local development.
- Large performance dataset:

```bash
cd backend
bin/rails data:seed_large_listings
```

## Tradeoffs

- Offset pagination (`page`, `per_page`) for simplicity and readability.
- Header-based admin mode (`X-Admin`) instead of full authentication, to avoid extra scope.
