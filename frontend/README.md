# Frontend (Next.js)

Real-estate listing frontend.

## Routes

- `/` simple home page
- `/listings` listing search page with filters, URL sync, and pagination
- `/listings/[id]` listing detail page

## Viewer mode

- Viewer mode is stored in localStorage (`user` or `admin`).
- In `admin` mode, API requests include `X-Admin: true`.
- In `user` mode, no admin header is sent.

## Requirements

- Node.js LTS
- npm

## Environment

Set backend API base URL with:

```bash
# frontend/.env.local
NEXT_PUBLIC_BACKEND_API_BASE_URL=http://127.0.0.1:3000
```

If not provided, frontend defaults to `http://127.0.0.1:3000`.

## Install

```bash
cd frontend
npm install
```

## Run

```bash
cd frontend
npm run dev
```

App runs on `http://localhost:4000`.

## Quality checks

```bash
cd frontend
npm run lint
npm run build
```
