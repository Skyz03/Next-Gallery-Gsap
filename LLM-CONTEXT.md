# Next Gallery (Supabase) — LLM context doc

Use this doc to onboard any LLM or developer and take the codebase forward. It describes the app, stack, structure, data model, flows, and conventions.

---

## 1. Project overview

- **What it is:** A wedding/portfolio photo gallery built with Next.js (App Router). The main page shows a hero and a 3-column masonry-style grid of projects; clicking a project opens a full-screen overlay with cover + gallery and horizontal scroll. An admin page at `/admin` lets you create projects by uploading images and metadata; data and images are stored in Supabase.
- **Public routes:** `/` (home = hero + gallery).
- **Admin route:** `/admin` (create project form). No auth yet; protect in production (e.g. Supabase Auth or middleware).
- **Data source:** Supabase (Postgres + Storage). The gallery reads via the anon key; uploads use the service role key so RLS can stay strict.

---

## 2. Tech stack

- **Framework:** Next.js 16 (App Router), React 19.
- **Styling:** Tailwind CSS v4.
- **Animation:** Framer Motion (scroll-linked hero, card stagger, project overlay, horizontal scroll).
- **Backend/DB:** Supabase (Postgres, Storage, anon + service role keys).
- **Language:** TypeScript throughout.

---

## 3. Repository structure (relevant paths)

```
app/
  page.tsx                 # Home: server component, fetches projects, renders Hero + GallerySection
  layout.tsx               # Root layout
  globals.css              # Global styles
  components/
    Hero.tsx               # Full-height hero, scroll-linked scale/opacity (Framer Motion)
    GallerySection.tsx      # Client: 3-column grid + ProjectView overlay, receives projects prop
    ProjectCard.tsx        # Single project card (cover image, title, location, aspect, onClick)
    ProjectView.tsx        # Full-screen overlay: cover + metadata, then horizontal gallery (next/image)
  admin/
    page.tsx               # Admin layout + “Back to gallery” + ProjectUploadForm
    ProjectUploadForm.tsx  # Client form: title, client, location, description, aspect, files → POST /api/projects
  api/
    projects/
      route.ts             # POST: formData → uploadProject(), returns { success, id } or { error }
lib/
  supbase.ts               # Supabase client with anon key (NEXT_PUBLIC_*). Used for public read (getProjects).
  supabaseAdmin.ts         # Supabase client with service role key. Server-only; used for uploads/inserts.
  getProjects.ts           # Fetches projects + project_images from Supabase, returns Project[] shape
  uploadProject.ts         # Uploads cover + gallery to storage, inserts projects + project_images (uses supabaseAdmin)
data/
  project.ts               # Project type and optional static projects array (fallback/seed)
supabase-tables.sql        # SQL to create projects + project_images + RLS (run in Supabase SQL Editor)
next.config.ts             # images.remotePatterns for Supabase storage host
.env                       # Supabase URL + anon key + service role key (see below)
```

---

## 4. Data model

### 4.1 TypeScript type (app/data/project.ts)

```ts
interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  coverImage: string;   // URL
  gallery: string[];    // array of image URLs
  location: string;
  aspect: "portrait" | "landscape";
}
```

- **Frontend and API** use this shape. `getProjects()` maps DB rows into this (e.g. `cover_image` → `coverImage`, `project_images` → `gallery` ordered by `position`).

### 4.2 Supabase (Postgres)

- **Table `public.projects`**  
  `id` (uuid, PK), `title`, `client`, `location`, `description`, `aspect` ('portrait' | 'landscape'), `cover_image` (text URL), `created_at` (timestamptz).  
  Ordered by `created_at desc` when listing.

- **Table `public.project_images`**  
  `id` (uuid, PK), `project_id` (FK → projects.id, on delete cascade), `image_url` (text), `position` (int).  
  Gallery order = order by `position`.

- **Storage bucket**  
  `project-images` (public read). Paths: `covers/<timestamp>-<filename>` for cover; `gallery/<project_id>-<index>-<filename>` for gallery.  
  App uses Supabase public URL for these (e.g. `next/image` with configured host).

### 4.3 RLS

- **projects** and **project_images**: RLS enabled.  
  - **SELECT** allowed for `public` (anon key) so the gallery can read.  
  - **INSERT/UPDATE/DELETE**: no policies for anon; only the **service role** (used in API) can write.  
- **Storage**: bucket `project-images` must allow uploads (service role used in API); public read for `getPublicUrl()`.

---

## 5. Main flows

### 5.1 Home page (gallery)

1. **app/page.tsx** (server): calls `getProjects()` from `lib/getProjects.ts`; on error returns empty array. Passes `projects: Project[]` to `<GallerySection projects={projects} />`.
2. **getProjects.ts**: uses **anon** Supabase client; `select('*, project_images (*)')` on `projects`, `order('created_at', { ascending: false })`; maps to `Project` (e.g. `cover_image` → `coverImage`, `project_images` sorted by `position` → `gallery`).
3. **GallerySection** (client): splits projects into 3 columns by index `i % 3`; renders a grid of **ProjectCard**; on card click sets `selectedProject` and opens **ProjectView** in AnimatePresence.
4. **ProjectView**: shows cover (next/image), title/description/location/client; then horizontal scroll of `project.gallery` (next/image). Uses Framer Motion for horizontal scroll on desktop; mobile scrolls vertically. **Project** type comes from `@/data/project`.

### 5.2 Admin upload (create project)

1. **/admin**: **ProjectUploadForm** submits with fields: `title`, `client`, `location`, `description`, `aspect`, `files` (multiple).
2. Form POSTs **FormData** to **POST /api/projects** (no custom Content-Type).
3. **app/api/projects/route.ts**: parses formData; validates required `title`, `client`, and at least one file; calls **uploadProject()** from `lib/uploadProject.ts`.
4. **uploadProject()** (uses **supabaseAdmin**):
   - Uploads first file to storage `project-images` as cover path `covers/<ts>-<name>`.
   - Gets public URL for cover; inserts into `projects` (title, client, location, description, aspect, cover_image); gets back `id`.
   - For each file: uploads to `gallery/<project_id>-<i>-<name>`, gets public URL, inserts into `project_images` (project_id, image_url, position).
   - Returns `{ id }`. API returns `{ success: true, id }` or `{ error: string }` with 400/500.

---

## 6. Environment variables

- **NEXT_PUBLIC_SUPABASE_URL** — Supabase project URL (used by both anon and admin clients).
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY** — Anon key (public; used in `lib/supbase.ts` for getProjects).
- **SUPABASE_SERVICE_ROLE_KEY** — Service role key (server-only; used in `lib/supabaseAdmin.ts` for uploadProject). Never expose to the client.

---

## 7. Configuration

- **next.config.ts**: `images.remotePatterns` includes the Supabase storage host (e.g. `ryfwotdpvdhiotuhudta.supabase.co`) with path `/storage/v1/object/public/**` so `next/image` can load Supabase storage URLs. If you use another project, add that hostname.
- **Supabase**: Run **supabase-tables.sql** in the SQL Editor once to create tables, index, and RLS policies. Create storage bucket `project-images` and allow public read if you use public URLs.

---

## 8. Conventions and patterns

- **Project type**: Single source of truth in `data/project.ts`; API and getProjects return this shape (id string, coverImage, gallery array, etc.).
- **Supabase clients**:  
  - **Read (public):** `lib/supbase.ts` (anon).  
  - **Write (admin):** `lib/supabaseAdmin.ts` (service role). Use admin only in server/API code.
- **Naming**: DB columns snake_case (`cover_image`, `project_id`); app uses camelCase (`coverImage`, projectId in types).
- **Images**: Use `next/image` for project/cover and gallery images; all remote URLs must be in `next.config` `images.remotePatterns`.
- **Admin**: No auth implemented; add auth (e.g. Supabase Auth + middleware or route guard) before production.

---

## 9. Where to extend

- **New project fields:** Add column in `public.projects`, update **supabase-tables.sql**, **getProjects** mapping, **Project** type in `data/project.ts`, **uploadProject** and **API** (formData + insert), and **ProjectUploadForm** (inputs). Optionally show in **ProjectView** or **ProjectCard**.
- **Edit/delete project:** New API routes (e.g. PATCH/DELETE `/api/projects/[id]`), use **supabaseAdmin**; add RLS policies if you ever write from elsewhere. Add UI in admin (e.g. list projects + edit/delete).
- **Auth for admin:** Supabase Auth (or other provider); protect `/admin` and optionally `/api/projects` (e.g. check session in route handler). Keep using service role in API so RLS stays strict.
- **More storage buckets or tables:** Create in Supabase; add any new hostnames to `next.config` if using `next/image`; use **supabaseAdmin** for server-side writes.
- **Static fallback:** `data/project.ts` still exports a static `projects` array; home page currently uses only `getProjects()`. You could use the static list as fallback when Supabase fails or for demos.

---

## 10. Quick reference

| Concern              | Location / note |
|----------------------|------------------|
| Project type         | `data/project.ts` |
| Fetch gallery data   | `lib/getProjects.ts` (anon client) |
| Create project + uploads | `lib/uploadProject.ts` (admin client) |
| API create project   | `POST /api/projects` → `app/api/projects/route.ts` |
| Gallery UI           | `app/page.tsx` → `GallerySection` → `ProjectCard` / `ProjectView` |
| Admin form           | `app/admin/ProjectUploadForm.tsx` → POST `/api/projects` |
| Supabase anon        | `lib/supbase.ts` |
| Supabase service role| `lib/supabaseAdmin.ts` |
| DB schema + RLS      | `supabase-tables.sql` |
| Remote images        | `next.config.ts` → `images.remotePatterns` |

Use this document to implement new features, fix bugs, or hand off to another LLM/developer with minimal context loss.
