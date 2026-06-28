# AuthInsights

Community-sourced prior authorization outcome data for rheumatology practices. See real approval rates by drug, biosimilar, and insurance plan — before you submit.

## What it does

- **Biosimilar lookup** — compare approval rates across Humira, Hadlima, Cyltezo, and other adalimumab biosimilars by payer
- **PA outcome reporting** — submit your own prior auth results to contribute to the dataset
- **Guideline rules** — admin-managed PA requirements and checklists per drug class and insurance plan
- **Appeals tracking** — separate data for initial PAs vs. appeals

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Prisma](https://www.prisma.io) + PostgreSQL (Supabase)
- [NextAuth.js v5](https://authjs.dev) (credentials-based auth with JWT sessions)
- Tailwind CSS

## Local setup

1. **Clone and install**
   ```bash
   git clone https://github.com/DamonChiou/rheumatology-saas.git
   cd rheumatology-saas
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your values in `.env`:
   - `DATABASE_URL` — PostgreSQL connection string (Supabase connection pooling URL recommended)
   - `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `http://localhost:3000` for local dev

3. **Run database migrations and seed**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Database schema

| Table | Description |
|---|---|
| `User` | Practice accounts |
| `Medication` | Drug reference table (generic + brand names) |
| `InsurancePlan` | Payer reference table |
| `GuidelineRule` | PA requirements per drug class + insurance combo |
| `PAOutcomeReport` | Crowdsourced approval/denial outcomes |
| `PriorAuthRequest` | Individual PA lookups with checklist snapshots |

## Notes

- No patient identifiers are stored in outcome reports — only drug, insurance, indication, and result.
- The seed script (`prisma/seed.ts`) populates realistic synthetic outcome data for development.
