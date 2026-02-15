import { supabaseAdmin } from "./supabaseAdmin";

export type UploadProjectInput = {
  title: string;
  client: string;
  location: string;
  description: string;
  aspect: "portrait" | "landscape";
  files: File[];
};

export async function uploadProject(data: UploadProjectInput): Promise<{ id: string }> {
  if (!data.files?.length) {
    throw new Error("At least one image is required.");
  }

  const coverFile = data.files[0];
  const coverPath = `covers/${Date.now()}-${coverFile.name.replace(/\s+/g, "-")}`;

  const { error: uploadCoverError } = await supabaseAdmin.storage
    .from("project-images")
    .upload(coverPath, coverFile, { upsert: false });

  if (uploadCoverError) {
    throw new Error(`Cover upload failed: ${uploadCoverError.message}`);
  }

  const { data: coverUrlData } = supabaseAdmin.storage
    .from("project-images")
    .getPublicUrl(coverPath);
  const coverUrl = coverUrlData.publicUrl;

  const { data: project, error: insertError } = await supabaseAdmin
    .from("projects")
    .insert({
      title: data.title,
      client: data.client,
      location: data.location,
      description: data.description,
      aspect: data.aspect,
      cover_image: coverUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(`Project create failed: ${insertError.message}`);
  }
  if (!project?.id) {
    throw new Error("Project created but no id returned.");
  }

  for (let i = 0; i < data.files.length; i++) {
    const file = data.files[i];
    const path = `gallery/${project.id}-${i}-${file.name.replace(/\s+/g, "-")}`;

    const { error: galleryUploadError } = await supabaseAdmin.storage
      .from("project-images")
      .upload(path, file, { upsert: false });

    if (galleryUploadError) {
      throw new Error(`Image ${i + 1} upload failed: ${galleryUploadError.message}`);
    }

    const { data: imageUrlData } = supabaseAdmin.storage
      .from("project-images")
      .getPublicUrl(path);

    const { error: linkError } = await supabaseAdmin.from("project_images").insert({
      project_id: project.id,
      image_url: imageUrlData.publicUrl,
      position: i,
    });

    if (linkError) {
      throw new Error(`Image ${i + 1} link failed: ${linkError.message}`);
    }
  }

  return { id: String(project.id) };
}
