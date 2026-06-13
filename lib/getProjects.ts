import { cache } from "react";
import { supabase } from "./supabase";
import { generateSlug } from "./slug";
import type { Project, ProjectCategory } from "@/data/project";

export const getProjects = cache(async function getProjects(category?: ProjectCategory): Promise<Project[]> {
  let query = supabase
    .from("projects")
    .select(`*, project_images (*)`)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((project) => ({
    id: String(project.id),
    slug: generateSlug(project.client),
    category: project.category ?? "wedding",
    title: project.title,
    client: project.client,
    location: project.location,
    description: project.description,
    coverImage: project.cover_image,
    gallery: project.project_images
      ?.sort((a: { position: number }, b: { position: number }) => a.position - b.position)
      .map((img: { image_url: string }) => img.image_url) ?? [],
    aspect: project.aspect,
  }));
});