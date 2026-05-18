# Workspace

## Overview

Pleasant Beginnings Inc. — a 501(c)(3) nonprofit community web app for a Baltimore, Maryland organization serving youth and families. Founded by Taneisha "TeeLee" Lee. Mission: "Preparing for a Better Tomorrow."

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Routing**: wouter
- **Forms**: react-hook-form + zod
- **Animations**: framer-motion
- **File storage**: Replit Object Storage (GCS-backed, presigned URL uploads)

## Brand

- **Primary color (Navy)**: #0D1B2A
- **Accent color (Gold)**: #C9A84C
- **Heading font**: Cormorant Garamond
- **Body font**: Montserrat

## Pages

- `/` — Home: hero, impact stats, featured programs, upcoming events, PBTV + partners sections
- `/programs` — Programs Directory: all 7 EPK programs grid
- `/events` — Events: upcoming and past community events (live from DB)
- `/gallery` — Photo gallery: live from DB, filterable by category, lightbox viewer
- `/stories` — Success stories / testimonials
- `/volunteer` — Volunteer Sign-Up form
- `/contact` — Intake/Contact form for community members
- `/about` — Organization story, TeeLee + De'Ashia "Black Girl Dee" Gibbs bios, mission/vision
- `/partner` — Partner With Us page with 3 partnership tracks and inquiry form
- `/press` — Press & Media: news coverage, awards, media kit, press inquiry form
- `/impact` — Public Community Impact Report: live stats, all 7 programs, milestone timeline, partners, testimonials, donor/grant CTA, printable
- `/admin` — Admin dashboard (PIN: PBI2024) — manage events, RSVPs, gallery, volunteers, contacts, newsletter, programs, stories

## Programs (seeded in DB, IDs 1–7)

1. Truth University (Entrepreneurship)
2. Podcast Academy (Media & Communication)
3. Supreme Fitness (Youth Wellness)
4. Vocal University (Performing Arts)
5. Mullyvation (Mentorship)
6. Officer-Civilian Engagement (Community Safety)
7. ISA Sports Agency (Sports & Career)

## API Endpoints

- `GET/POST /api/programs` — Programs CRUD
- `GET /api/programs/:id` — Single program
- `GET/POST /api/events` — Events CRUD
- `DELETE /api/events/:id` — Delete event (admin)
- `GET /api/events/upcoming` — Next 3 upcoming events
- `GET/POST /api/events/:id/rsvps` — List/submit RSVPs for an event
- `GET /api/events/:id/rsvp-count` — Live RSVP + guest count for an event
- `GET/POST /api/volunteers` — Volunteer sign-ups
- `GET/POST /api/contacts` — Contact/intake submissions
- `GET/POST /api/gallery` — Gallery images (DB-backed)
- `DELETE /api/gallery/:id` — Delete gallery image (admin)
- `POST /api/storage/uploads/request-url` — Request presigned GCS upload URL
- `GET /api/storage/objects/*` — Serve uploaded objects
- `GET /api/storage/public-objects/*` — Serve public assets
- `GET /api/stats/summary` — Homepage impact stats
- `GET /api/stats/analytics` — Admin analytics dashboard (RSVPs by event, monthly signups, newsletter growth)
- `GET /api/healthz` — Health check

## Shared Libs

- `lib/db` — Drizzle ORM schema + DB client (tables: programs, events, event_rsvps, volunteers, contacts, newsletter, stories, gallery)
- `lib/api-spec` — OpenAPI spec (source of truth). Do NOT change `info.title` from "Api"
- `lib/api-zod` — Generated Zod schemas from OpenAPI
- `lib/api-client-react` — Generated React Query hooks from OpenAPI
- `lib/object-storage-web` — `useUpload` hook + `ObjectUploader` component for presigned URL uploads

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Notes

- The `events/upcoming` route must be registered BEFORE `events/:id` in Express to avoid route conflicts
- Admin PIN: PBI2024 (stored in sessionStorage)
- Object storage bucket: `replit-objstore-1a4a169f-5b07-47e0-ac1e-330be1ef0e31`
- Gallery images are stored in GCS via presigned URL flow; objectPath is saved in DB; served at `/api/storage${objectPath}`
- Pnpm overrides pin `react` and `react-dom` to `19.1.0` to prevent Uppy v5 from pulling a duplicate React
- De'Ashia "Black Girl Dee" Gibbs bio on About page is a placeholder — awaiting real bio text
- EIN: 86-2300371 (in footer and About page)
- Social: @pleasantbeginningsnonprofit (Instagram + Facebook)
- Contact: 410-637-9113 / Admin@pleasantbeginnings.info
- **Donation/payments feature is deferred** — Stripe integration was not connected
- **Email notifications are deferred** — User skipped for now. When ready, use Resend (connector:ccfg_resend_01K69QKYK789WN202XSE3QS17V) or provide a RESEND_API_KEY secret. Send RSVP confirmation emails from the `POST /api/events/:id/rsvps` route after a successful insert.

- **GitHub**: User dismissed the Replit GitHub connector. Use Replit's built-in Version Control panel (git icon in sidebar) to push to a new GitHub repo named `pleasant-beginnings-app`.

## Vercel Deployment

Files added for Vercel full-stack deployment:
- `vercel.json` — root config: builds the Vite frontend, routes `/api/*` to serverless Express function, SPA fallback for all other routes
- `api/index.ts` — serverless entry point; re-exports the Express app from `artifacts/api-server/src/app`
- `.vercelignore` — excludes `mockup-sandbox`, `attached_assets`, `.local`

### Steps to deploy on Vercel
1. Push repo to GitHub (via Replit's Version Control panel)
2. Import repo in [vercel.com](https://vercel.com) → New Project
3. Select the repo; Vercel auto-detects `vercel.json` — no framework preset needed
4. Add these **Environment Variables** in Vercel project settings:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Production PostgreSQL connection string (Neon, Supabase, etc.) |
| `SESSION_SECRET` | A strong random secret string |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | Replit Object Storage bucket ID (if using GCS uploads in prod) |
| `PRIVATE_OBJECT_DIR` | From Replit env |
| `PUBLIC_OBJECT_SEARCH_PATHS` | From Replit env |
| `NODE_ENV` | `production` |

5. Deploy — frontend served from Vercel CDN, API runs as a serverless function at `/api/*`

> Note: The Replit PostgreSQL DB is not accessible from Vercel. You must provision a separate external database (e.g. [Neon.tech](https://neon.tech) free tier) and run `pnpm --filter @workspace/db run push` against the new `DATABASE_URL` to apply the schema.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
