# Naralabs Web

Official web frontend for **[Naralabs](https://naralabs.io)** — a Stellar blockchain explorer for ledgers, transactions, and Soroban contracts.

**Live:** [https://naralabs.io](https://naralabs.io)

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, route groups)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Nextra 4](https://nextra.site/) — docs at `/docs`
- TypeScript

## Features

### Explorer

- Marketing landing page with aurora hero, network stats, recent events, active contracts
- Paginated event list (`/events`) — search, `event_type`, `decode_status` filters
- Paginated contract list (`/contracts`) — search, `schema_status` filter (`decoded` / `raw_only`)
- Event detail (`/events/[id]`) — topics, value, XDR, related links
- Contract detail (`/contracts/[id]`) — activity, type breakdown, event history

### Auth & dashboard

- Sign in / register / email verification (`/login`, `/register`, `/verify-email`)
- Account dashboard (`/dashboard`) — overview, watchlist, tags, notes, verified addresses
- Profile settings (`/dashboard/settings/profile`)
- API dashboard placeholder (`/dashboard/developers`)

Auth flows call Atlas via Next.js route handlers (`/api/auth/*`). Session uses HTTP-only cookies.

### Docs

- Product docs at **`/docs`** (Nextra) — getting started, explorer guides, API reference, decoding / schema registry guide

### Schema registry (Atlas backend)

SEP-0048 event schemas are stored and served by **Atlas** (`naralabs-atlas`), not in this repo:

| Concern | Where |
|---------|--------|
| Publish / list / get schemas | Atlas API `POST/GET /v1/schemas` |
| Explorer decode status UI | This frontend (`schema_status`, `decode_status` badges & filters) |
| How decoding works | `/docs/guides/decoding-events` |

There is no dedicated schema publish UI yet — use Atlas OpenAPI docs (`http://localhost:8080/docs`) or `curl` against `POST /v1/schemas`.

## Architecture

```
Browser
  ├── /events, /contracts, /dashboard  →  Next.js pages
  ├── /api/atlas/*                     →  BFF proxy → ATLAS_API_URL (explore + registry read)
  ├── /api/auth/*                      →  BFF → Atlas /v1/auth/*
  └── /docs                            →  Nextra MDX (src/content/)
```

Atlas must be running for explorer and auth. See [naralabs-atlas README](https://github.com/naralabsdev/naralabs-atlas).

## Getting Started

### Prerequisites

- Node.js 20+
- [Naralabs Atlas](https://github.com/naralabsdev/naralabs-atlas) running locally (default: `http://localhost:8080`)

### Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Docs: [http://localhost:3000/docs](http://localhost:3000/docs)

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (syncs Nextra CSS, then Next dev) |
| `npm run dev:turbo` | Start dev server (Turbopack) |
| `npm run build` | Production build (+ Pagefind search index) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run validate` | Full CI validation pipeline |
| `npm run sync:nextra-css` | Copy Nextra theme CSS to `public/` |
| `npm run generate:favicons` | Regenerate favicon assets |

## Environment

See [`.env.example`](./.env.example).

| Variable | Description |
|----------|-------------|
| `ATLAS_API_URL` | Backend Atlas URL (server-only, proxied via `/api/atlas/*`) |
| `APP_BASE_URL` | Server-side app origin (auth callbacks) |
| `NEXT_PUBLIC_APP_URL` | Public app origin |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Stellar network (`testnet` / `mainnet`) |
| `NEXT_PUBLIC_DOCS_URL` | Docs path (default `/docs`) |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub link for nav/footer |

## Repository layout (high level)

```
src/
├── app/
│   ├── (site)/          # Explorer, auth, dashboard
│   └── (docs)/          # Nextra docs layout + /docs routes
├── content/             # MDX docs (getting-started, explorer, api, guides)
├── modules/             # Feature modules (events, contracts, auth, landing, …)
└── shared/ui/           # Shared components (nav, explorer tables, buttons, …)
```

## Deploy on Vercel

1. Import the [naralabs-web](https://github.com/naralabsdev/naralabs-web) repository
2. Set **Root Directory** to `naralabs-frontend` (or `.` if repo root is the frontend)
3. Add environment variables:

| Variable | Required | Example |
|----------|----------|---------|
| `ATLAS_API_URL` | Yes | `https://api.naralabs.io` |
| `APP_BASE_URL` | Yes | `https://naralabs.io` |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://naralabs.io` |
| `NEXT_PUBLIC_STELLAR_NETWORK` | No | `testnet` |

4. Deploy — build command: `npm run build`, output: Next.js default

Ensure Atlas `CORS_ALLOWED_ORIGINS` and `WEB_APP_URL` include your production frontend URL.

## Related repos

| Repo | Role |
|------|------|
| [naralabs-atlas](https://github.com/naralabsdev/naralabs-atlas) | Indexer + HTTP API (explore, auth, **schema registry**) |
| [naralabs-web](https://github.com/naralabsdev/naralabs-web) | This frontend |

## License

See repository license file.
