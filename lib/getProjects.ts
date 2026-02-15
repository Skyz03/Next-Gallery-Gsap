import { supabase } from "./supbase";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_images (*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data?.map((project) => ({
    id: String(project.id),
    title: project.title,
    client: project.client,
    location: project.location,
    description: project.description,
    coverImage: project.cover_image,
    gallery: project.project_images
      ?.sort((a: any, b: any) => a.position - b.position)
      .map((img: any) => img.image_url),
    aspect: project.aspect,
  }));
}
