# CSV — Policy & Data Crawler

Monitor regulatory and policy updates across PH and SEA markets. Extract key datapoints for research and financial models. Generate weekly digests and newsletters.

## Architecture

- **DB**: PostgreSQL with migrations
- **API**: Express (TypeScript, port 3001)
- **Web**: Next.js 14 with App Router, Tailwind, Turbopack
- **Testing**: Jest, Playwright, TDD-first
- **Linting**: ESLint, Prettier, Husky hooks
- **Build**: Turbo for monorepo orchestration; pnpm workspaces

## Project Structure

```
.
├── apps/
│   ├── api/          # Express REST API
│   └── web/          # Next.js web UI
├── packages/
│   ├── db/           # PostgreSQL schema & migrations
│   └── types/        # Shared TypeScript types
├── turbo.json        # Turbo monorepo config
├── pnpm-workspace.yaml
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS)
- **pnpm** 8+
- **PostgreSQL** 14+ (or use Docker)
- **macOS/Linux** (development tested on zsh)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL connection string
```

### Running Locally

```bash
# Start all dev servers (API + Web with Turbopack)
pnpm dev

# In separate terminals:
# API server (http://localhost:3001)
cd apps/api && pnpm dev

# Web server (http://localhost:3000)
cd apps/web && pnpm dev
```

### Database Setup

```bash
# Start PostgreSQL (via Docker)
docker-compose up -d postgres

# Run migrations
pnpm db:migrate

# (Optional) Rollback
pnpm db:rollback
```

## Development

### Building

```bash
pnpm build
```

### Testing

```bash
# Unit tests (Jest)
pnpm test

# Watch mode
pnpm test:watch

# E2E tests (Playwright)
pnpm e2e
pnpm e2e:ui  # open UI mode

# Coverage
pnpm test -- --coverage
```

### Linting & Formatting

```bash
# Check linting
pnpm lint

# Format code
pnpm format

# Check format only
pnpm format:check

# Type check
pnpm type-check
```

### Git Workflow

Husky pre-commit hooks run:
- `pnpm lint-staged` (lint changed files)
- commitlint validation (enforces conventional commits)

Commit message format: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(api): add document classification endpoint`

## Design System

Brand: **CSV** — clean, neutral, professional.

- **Font**: Plus Jakarta Sans (400, 700)
- **Primary color**: #202020 (brand-neutral)
- **Text**: copy #202020, secondary #727272, captions #A0A0A0
- **Backgrounds**: white, page #FAFAFA, contrast #EFEFEF
- **Borders**: #DCDCDC (1px)
- **UI Framework**: shadcn/ui components + Tailwind

## Core Workflows

### Crawling & Watchlists

Track official sites, regulators, exchanges, FX/macro bulletins.

```bash
POST /api/v1/sources          # Add watchlist
GET  /api/v1/documents        # List crawled documents
```

### Policy Intelligence

Classify documents (policy/regulation/news/data); extract datapoints.

```bash
GET  /api/v1/documents?classification=policy&country=PH
GET  /api/v1/datapoints?key=solar_fit_rate
```

### Weekly Digest

Auto-generate and send newsletters Monday 08:00 Asia/Manila.

```bash
GET  /api/v1/digests
POST /api/v1/subscriptions
```

## Environment Variables

See `.env.example` for full list. Key variables:

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/csv_crawler
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## Docker (Development)

```bash
docker-compose up -d
# Starts PostgreSQL on port 5432
# Connect: postgresql://postgres:postgres@localhost:5432/csv_crawler
```

## Deployment (Next Steps)

- [ ] Add GitHub Actions CI/CD
- [ ] Set up Vercel for Next.js (web)
- [ ] Deploy Express API to Railway/Fly.io
- [ ] Configure Prisma or Drizzle ORM
- [ ] Set up LangGraph AI pipeline (optional)
- [ ] Email service integration (Sendgrid/Resend)

## API Reference

See `apps/api/README.md` (will be generated).

## Contributing

1. Create a branch: `git checkout -b feat/your-feature`
2. Follow conventional commits
3. Run `pnpm test` and `pnpm lint` before pushing
4. Open a PR

## License

Proprietary — CSV Team.

## Support

For issues or questions, reach out to the team.
