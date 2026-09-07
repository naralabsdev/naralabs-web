# Naralabs Web

Official web frontend for **[Naralabs](https://naralabs.io)** — a Stellar blockchain explorer for ledgers, transactions, and Soroban contracts.

**Live:** [https://naralabs.io](https://naralabs.io)

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript

## Features

- Marketing landing page with network stats and recent activity
- Event detail explorer (`/events/[id]`)
- Contract detail explorer (`/contracts/[id]`)
- Atlas API proxy via `/api/atlas/*` (BFF)

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

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (webpack) |
| `npm run dev:turbo` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run validate` | Full CI validation pipeline |
| `npm run generate:favicons` | Regenerate favicon assets |
| `npm run clean:assets-cache` | Clear Next.js image optimizer cache |

## Environment

See [`.env.example`](./.env.example) for available variables.

| Variable | Description |
|----------|-------------|
| `ATLAS_API_URL` | Backend Atlas URL (server-only) |
| `NEXT_PUBLIC_APP_URL` | Public app origin |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Stellar network (`testnet` / `mainnet`) |

## Repository

- **GitHub:** [github.com/naralabsdev/naralabs-web](https://github.com/naralabsdev/naralabs-web)
- **Website:** [https://naralabs.io](https://naralabs.io)
- **Backend:** [github.com/naralabsdev/naralabs-atlas](https://github.com/naralabsdev/naralabs-atlas)

## Deploy on Vercel

1. Import the [naralabs-web](https://github.com/naralabsdev/naralabs-web) repository
2. Set **Root Directory** to `.` (repository root)
3. Add environment variables:

| Variable | Required | Example |
|----------|----------|---------|
| `ATLAS_API_URL` | Yes | `https://api.naralabs.io` |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://naralabs.io` |
| `NEXT_PUBLIC_STELLAR_NETWORK` | No | `testnet` |

4. Deploy — build command: `npm run build`, output: Next.js default
