# Real Estate Listing

## Set up Backend

### Requirements

- Ruby (project uses Ruby 4.0.0)
- Bundler
- PostgreSQL

### Setup

```bash
cd backend
bundle install
bin/rails db:prepare
bin/rails db:seed
```

The default seed creates a small deterministic dataset for regular local development.

### Run the API

```bash
cd backend
bin/rails server
```

API base URL: `http://localhost:3000/api/v1`

### API examples

```bash
# listings index
curl "http://localhost:3000/api/v1/listings?suburb=kathmandu&sort%5Bkey%5D=created&sort%5Bdirection%5D=desc"

# listings detail
curl "http://localhost:3000/api/v1/listings/1"

# admin mode (shows internal fields in detail)
curl -H "X-Admin: true" "http://localhost:3000/api/v1/listings/1"
```

### Run tests

```bash
cd backend
bin/rails test
```

### Performance data setup

Use this to seed a very large deterministic dataset for performance checks:

```bash
cd backend
bin/rails data:seed_large_listings
```

## Frontend
