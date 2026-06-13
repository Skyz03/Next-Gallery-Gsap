import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateSlug } from "@/lib/slug";

async function deleteStorageFolder(slug: string) {
  const bucket = "project-images";
  const folder = `projects/${slug}`;

  // List and delete top-level files (cover image)
  const { data: topFiles } = await supabaseAdmin.storage
    .from(bucket)
    .list(folder);

  const topPaths =
    topFiles
      ?.filter((f) => f.name && !f.id?.endsWith("/"))
      .map((f) => `${folder}/${f.name}`) ?? [];

  // List and delete gallery subfolder
  const { data: galleryFiles } = await supabaseAdmin.storage
    .from(bucket)
    .list(`${folder}/gallery`);

  const galleryPaths =
    galleryFiles
      ?.filter((f) => f.name)
      .map((f) => `${folder}/gallery/${f.name}`) ?? [];

  const allPaths = [...topPaths, ...galleryPaths];
  if (allPaths.length > 0) {
    await supabaseAdmin.storage.from(bucket).remove(allPaths);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch title before deleting so we can build the storage path
  const { data: project } = await supabaseAdmin
    .from("projects")
    .select("title")
    .eq("id", id)
    .single();

  // Delete DB rows
  await supabaseAdmin.from("project_images").delete().eq("project_id", id);

  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Clean up storage (best-effort — DB is already deleted so don't fail the response)
  if (project?.title) {
    const slug = generateSlug(project.title);
    if (slug) {
      await deleteStorageFolder(slug).catch(() => null);
    }
  }

  return NextResponse.json({ ok: true });
}
