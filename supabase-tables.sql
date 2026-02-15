-- Run this in Supabase Dashboard → SQL Editor

-- 1. Projects (gallery projects)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text not null,
  location text,
  description text,
  aspect text not null default 'portrait' check (aspect in ('portrait', 'landscape')),
  cover_image text not null,
  created_at timestamptz not null default now()
);

-- 2. Project images (gallery images per project)
create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  position int not null default 0
);

-- Index for listing images by project and order
create index if not exists project_images_project_id_position
  on public.project_images (project_id, position);

-- 3. RLS (optional but recommended)
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

-- Allow public read for gallery (getProjects uses anon key)
create policy "Allow public read projects"
  on public.projects for select
  to public
  using (true);

create policy "Allow public read project_images"
  on public.project_images for select
  to public
  using (true);

-- Inserts/updates/deletes only via service role (your API uses supabaseAdmin).
-- No insert/update/delete policies for anon = only service role can write.
