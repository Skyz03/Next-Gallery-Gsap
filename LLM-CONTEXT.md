# Next Gallery (Supabase) — LLM context doc

Use this doc to onboard any LLM or developer and take the codebase forward. It describes the app, stack, structure, data model, flows, and conventions.

---

## 1. Project overview

- **What it is:** A multi-category photo gallery built with Next.js (App Router). Projects are organized by **category** (`wedding`, `music`, `commercial`), each with its own branded route and aesthetic. An admin page at `/admin` creates projects via Supabase.
- **Public routes:**
  - `/` — Wedding gallery (white/cream `#faf9f6` theme, 3-column masonry grid).
  - `/music` — Music/events landing (dark `#0a0a0a` theme, 2-column grid).
  - `/projects/[slug]` — Wedding project detail (full-screen horizontal gallery).
  - `/music/[slug]` — Music project detail (reuses ProjectView).
- **Admin route:** `/admin` (create project form with category picker). No auth yet.
- **Data source:** Supabase (Postgres + Storage). Public reads via anon key; writes via service role key.

---

## 2. Tech stack

- **Framework:** Next.js 16 (App Router), React 19.
- **Styling:** Tailwind CSS v4.
- **Animation:** Framer Motion (scroll-linked hero, card stagger, project overlay, horizontal scroll).
- **Backend/DB:** Supabase (Postgres, Storage, anon + service role keys).
- **Language:** TypeScript throughout.

---

## 3. Repository structure

```
app/
  page.tsx                   # Home: fetches wedding projects, renders GallerySection
  layout.tsx                 # Root layout (SmoothScroll, Navigation)
  globals.css
  components/
    Navigation.tsx           # Fixed nav: branding, menu, contact (mix-blend-difference)
    SlideMenus.tsx           # Full-screen menu (from top) + contact (from right)
    SmoothScroll.tsx         # Lenis smooth scroll wrapper
    GallerySection.tsx       # Client: 3-col grid (desktop) / 2-col (mobile) + ProjectView overlay
    ProjectCard.tsx          # Single project card (cover, title, location, aspect)
    ProjectView.tsx          # Full-screen overlay: branding, back, menu, slide counter, next project
  admin/
    page.tsx                 # Admin layout + ProjectUploadForm
    ProjectUploadForm.tsx    # Client form: category, title, client, location, description, aspect, files
  music/
    page.tsx                 # Music landing: dark theme, fetches music projects
    MusicGallery.tsx         # Client: 2-col grid for music projects
    [slug]/
      page.tsx               # Music project detail (reuses ProjectView)
  projects/
    [slug]/
      page.tsx               # Wedding project detail (ProjectView, SEO metadata)
  api/
    projects/
      route.ts               # POST: formData → uploadProject(), returns { success, id }
lib/
  supabase.ts                # Supabase client with anon key (public reads)
  supabaseAdmin.ts           # Supabase client with service role key (server-only writes)
  getProjects.ts             # Fetches projects + images, optional category filter, returns Project[]
  uploadProject.ts           # Uploads cover + gallery, inserts project + images (uses supabaseAdmin)
  slug.ts                    # generateSlug("Marco & Brittney") → "marco-and-brittney"
data/
  project.ts                 # Project type, ProjectCategory type, getProjectHref helper, static seed data
supabase-tables.sql          # SQL: projects + project_images + RLS + category column
next.config.ts               # images.remotePatterns for Supabase storage host
.env                         # NEXT_PUBLIC_SUPABASE_URL, anon key, SUPABASE_SERVICE_ROLE_KEY
```

---

## 4. Data model

### 4.1 TypeScript types (data/project.ts)

```ts
type ProjectCategory = "wedding" | "music" | "commercial";

interface Project {
  id: string;
  slug: string;
  category: ProjectCategory;
  title: string;
  client: string;
  description: string;
  coverImage: string;
  gallery: string[];
  location: string;
  aspect: "portrait" | "landscape";
}

// Route helper: wedding → /projects/slug, music → /music/slug, commercial → /commercial/slug
function getProjectHref(project: { category: ProjectCategory; slug: string }): string;
```

### 4.2 Supabase (Postgres)

- **Table `public.projects`**
  `id` (uuid PK), `category` (text, default 'wedding', check in wedding/music/commercial), `title`, `client`, `location`, `description`, `aspect`, `cover_image` (URL), `created_at` (timestamptz).

- **Table `public.project_images`**
  `id` (uuid PK), `project_id` (FK → projects.id, cascade), `image_url` (text), `position` (int).

- **Storage bucket: `project-images`**
  Layout per project:
  ```
  projects/<title-slug>/
    cover.<ext>
    gallery/
      00-<filename>
      01-<filename>
  ```

### 4.3 RLS

- `projects` + `project_images`: RLS enabled.
  - **SELECT**: allowed for public (anon).
  - **INSERT/UPDATE/DELETE**: service role only (no anon write policies).
- Storage: service role for uploads; public read for `getPublicUrl()`.

### 4.4 Adding the category column to existing table

```sql
alter table public.projects
  add column if not exists category text not null default 'wedding'
  check (category in ('wedding', 'music', 'commercial'));
```

---

## 5. Main flows

### 5.1 Home page (`/` — weddings)

1. `app/page.tsx` (server): `getProjects("wedding")` → passes to `<GallerySection>`.
2. `getProjects(category?)`: queries Supabase with optional `.eq("category", ...)`, maps to `Project[]`.
3. `GallerySection`: 3-col masonry (desktop), 2-col grid (mobile). Links use `getProjectHref(project)`.
4. Click → `/projects/[slug]` → `ProjectView` with branding, back, menu, slide counter, next project.

### 5.2 Music page (`/music`)

1. `app/music/page.tsx` (server): `getProjects("music")` → `<MusicGallery>`.
2. `MusicGallery`: 2-col grid on dark `#0a0a0a` background. Links → `/music/[slug]`.
3. Detail: `app/music/[slug]/page.tsx` → `ProjectView` (same component, scoped to music projects).

### 5.3 Project detail (`ProjectView`)

- **Top nav:** Back (left), Namaste Studio branding (center), Menu (right).
- **Bottom bar:** Slide number in large font (left), Contact (right).
- **Gallery:** Horizontal scroll (desktop, spring physics) / vertical snap (mobile).
- **Next Project:** Full-screen card at end links to next project in same category (wraps around).
- **Menu/Contact:** Reuses `SlideMenus` component.

### 5.4 Admin upload

1. `/admin` form: **Category** (dropdown), Title, Client, Location, Description, Aspect, Files.
2. POST `/api/projects` → parses formData including `category` → `uploadProject()`.
3. `uploadProject()` inserts row with category, uploads to `projects/<slug>/...`, returns `{ id }`.

---

## 6. Environment variables

- **NEXT_PUBLIC_SUPABASE_URL** — Supabase project URL.
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY** — Anon key (public reads).
- **SUPABASE_SERVICE_ROLE_KEY** — Service role key (server-only writes). Never expose to client.

---

## 7. Configuration

- **next.config.ts**: `images.remotePatterns` for Supabase storage hostname.
- **supabase-tables.sql**: Full schema with category column, tables, index, RLS.

---

## 8. Category-based routing

| Category     | Landing page       | Detail page             | Theme                     |
|-------------|-------------------|------------------------|---------------------------|
| `wedding`    | `/` (home)         | `/projects/[slug]`      | Light cream `#faf9f6`      |
| `music`      | `/music`           | `/music/[slug]`         | Dark `#0a0a0a`             |
| `commercial` | `/commercial` (TBD)| `/commercial/[slug]` (TBD)| TBD                      |

**To add a new category:**
1. Add value to `ProjectCategory` type and DB check constraint.
2. Add route mapping in `categoryRouteMap` in `data/project.ts`.
3. Create `app/<category>/page.tsx` (landing) and `app/<category>/[slug]/page.tsx` (detail).
4. Filter with `getProjects("<category>")`.

---

## 9. Conventions

- **Single Project type** in `data/project.ts`. All routes use the same shape.
- **`getProjectHref(project)`** resolves the correct URL based on category. Use everywhere instead of hardcoded paths.
- **Supabase clients:** `supabase.ts` (anon, reads), `supabaseAdmin.ts` (service role, writes).
- **DB naming:** snake_case (`cover_image`). App naming: camelCase (`coverImage`).
- **Storage:** Folder per project slug: `projects/<slug>/cover.<ext>` + `projects/<slug>/gallery/...`.

---

## 10. Quick reference

| Concern                | Location |
|------------------------|----------|
| Project type + routing | `data/project.ts` |
| Fetch projects         | `lib/getProjects.ts` (accepts optional category filter) |
| Upload project         | `lib/uploadProject.ts` (service role) |
| API route              | `POST /api/projects` → `app/api/projects/route.ts` |
| Wedding gallery        | `app/page.tsx` → `GallerySection` |
| Music gallery          | `app/music/page.tsx` → `MusicGallery` |
| Project detail         | `app/components/ProjectView.tsx` (shared across categories) |
| Admin form             | `app/admin/ProjectUploadForm.tsx` |
| Supabase anon          | `lib/supabase.ts` |
| Supabase admin         | `lib/supabaseAdmin.ts` |
| DB schema              | `supabase-tables.sql` |
| Slug generation        | `lib/slug.ts` |
| Image config           | `next.config.ts` → `images.remotePatterns` |
