# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Next.js)
npm run build     # Production build
npm run start     # Run production server (custom server.js on port 3000)
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16 App Router** photography portfolio with Supabase as the backend. There is no CMS — projects are uploaded via `/admin` and stored in Supabase Postgres + Storage.

### Data flow

- **Server components** (`app/page.tsx`, `app/music/page.tsx`, `app/projects/[slug]/page.tsx`, `app/music/[slug]/page.tsx`) call `lib/getProjects.ts`, which reads from Supabase using the anon key (`lib/supabase.ts`).
- **Writes** go through `POST /api/projects` → `lib/uploadProject.ts`, which uses the service-role key (`lib/supabaseAdmin.ts`). Never import `supabaseAdmin` in client components.
- The `Project` type and `getProjectHref()` helper live in `data/project.ts` — this is the single source of truth for routing and type shape.

### Category-based routing

| Category     | Landing  | Detail                 | Theme           |
|--------------|----------|------------------------|-----------------|
| `wedding`    | `/`      | `/projects/[slug]`     | Light `#faf9f6` |
| `music`      | `/music` | `/music/[slug]`        | Dark `#0a0a0a`  |
| `commercial` | TBD      | TBD                    | TBD             |

Always use `getProjectHref(project)` for links — never hardcode category paths.

Slugs are generated from the `client` field via `lib/slug.ts`, not from the `title`.

### Key conventions

- **DB naming is snake_case** (`cover_image`, `project_id`); the `Project` TS type uses camelCase (`coverImage`). The mapping happens in `lib/getProjects.ts`.
- **Storage layout:** `projects/<slug>/cover.<ext>` and `projects/<slug>/gallery/00-<filename>`, etc.
- `ProjectView` is shared across all category detail pages — it handles both horizontal scroll (desktop) and vertical snap (mobile).
- `SmoothScroll` wraps the root layout with Lenis. It also includes an auto-scroll that starts after 5 seconds of user inactivity (cinematic idle behavior).
- `GSAP` is available globally via `app/components/providers/GSAPWrapper.tsx`.

### Adding a new category

1. Add the value to `ProjectCategory` in `data/project.ts` and to the DB check constraint.
2. Add the route entry to `categoryRouteMap` in `data/project.ts`.
3. Create `app/<category>/page.tsx` (landing) and `app/<category>/[slug]/page.tsx` (detail).
4. Fetch with `getProjects("<category>")`.

## Environment variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — anon key (public reads)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, never expose to client

The Supabase storage hostname must also be listed in `next.config.js` under `images.remotePatterns`.

## Database schema

See `supabase-tables.sql` for the full schema. Key tables:
- `public.projects` — one row per project, includes `category`, `aspect`, `cover_image` URL.
- `public.project_images` — gallery images with `position` ordering, FK to `projects.id`.
- RLS: public SELECT, service-role-only INSERT/UPDATE/DELETE.
