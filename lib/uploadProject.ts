import { supabaseAdmin } from "./supabaseAdmin";
import { generateSlug } from "./slug";

export type UploadProjectInput = {
  title: string;
  client: string;
  location: string;
  description: string;
  aspect: "portrait" | "landscape";
  files: File[];
};

function sanitize(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

/**
 * Storage layout per project:
 *   project-images/
 *     projects/<title-slug>/
 *       cover.<ext>
 *       gallery/
 *         00-<filename>
 *         01-<filename>
 *         ...
 */
export async function uploadProject(data: UploadProjectInput): Promise<{ id: string }> {
  if (!data.files?.length) {
    throw new Error("At least one image is required.");
  }

  const slug = generateSlug(data.title);
  if (!slug) {
    throw new Error("Title must produce a valid folder name.");
  }
  const folder = `projects/${slug}`;

  // 1. Insert project row
  const { data: project, error: insertError } = await supabaseAdmin
    .from("projects")
    .insert({
      title: data.title,
      client: data.client,
      location: data.location,
      description: data.description,
      aspect: data.aspect,
      cover_image: "",
    })
    .select("id")
    .single();

  if (insertError || !project?.id) {
    throw new Error(`Project create failed: ${insertError?.message}`);
  }

  const projectId = project.id;

  // 2. Upload cover (first file)
  const coverFile = data.files[0];
  const ext = coverFile.name.split(".").pop() ?? "jpg";
  const coverPath = `${folder}/cover.${ext}`;

  const { error: coverErr } = await supabaseAdmin.storage
    .from("project-images")
    .upload(coverPath, coverFile, { upsert: true });

  if (coverErr) {
    await supabaseAdmin.from("projects").delete().eq("id", projectId);
    throw new Error(`Cover upload failed: ${coverErr.message}`);
  }

  const coverUrl = supabaseAdmin.storage
    .from("project-images")
    .getPublicUrl(coverPath).data.publicUrl;

  const { error: updateErr } = await supabaseAdmin
    .from("projects")
    .update({ cover_image: coverUrl })
    .eq("id", projectId);

  if (updateErr) {
    throw new Error(`Cover URL update failed: ${updateErr.message}`);
  }

  // 3. Upload gallery images (all files including cover as first gallery image)
  for (let i = 0; i < data.files.length; i++) {
    const file = data.files[i];
    const idx = String(i).padStart(2, "0");
    const path = `${folder}/gallery/${idx}-${sanitize(file.name)}`;

    const { error: galleryErr } = await supabaseAdmin.storage
      .from("project-images")
      .upload(path, file, { upsert: true });

    if (galleryErr) {
      throw new Error(`Image ${i + 1} upload failed: ${galleryErr.message}`);
    }

    const imageUrl = supabaseAdmin.storage
      .from("project-images")
      .getPublicUrl(path).data.publicUrl;

    const { error: linkErr } = await supabaseAdmin.from("project_images").insert({
      project_id: projectId,
      image_url: imageUrl,
      position: i,
    });

    if (linkErr) {
      throw new Error(`Image ${i + 1} link failed: ${linkErr.message}`);
    }
  }

  return { id: String(projectId) };
}