import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { uploadProject } from "@/lib/uploadProject";

const categoryPathMap: Record<string, string> = {
  wedding: "/",
  music: "/music",
  commercial: "/commercial",
};

async function computeSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!secret) return "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("admin-v1"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_session="))
    ?.split("=")[1];

  const expected = await computeSessionToken();
  if (!expected || sessionCookie !== expected) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const category = formData.get("category");
    const title = formData.get("title");
    const client = formData.get("client");
    const location = formData.get("location");
    const description = formData.get("description");
    const aspect = formData.get("aspect");

    const validCategories = ["wedding", "music", "commercial"] as const;
    type ValidCategory = (typeof validCategories)[number];
    const isValidCategory = (v: unknown): v is ValidCategory =>
      validCategories.includes(v as ValidCategory);
    const categoryStr = isValidCategory(category) ? category : "wedding";
    const titleStr = typeof title === "string" ? title.trim() : "";
    const clientStr = typeof client === "string" ? client.trim() : "";
    const locationStr = typeof location === "string" ? location.trim() : "";
    const descriptionStr = typeof description === "string" ? description.trim() : "";
    const aspectStr = aspect === "portrait" || aspect === "landscape" ? aspect : "portrait";

    if (!titleStr) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!clientStr) {
      return NextResponse.json({ error: "Client is required." }, { status: 400 });
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
    }

    const result = await uploadProject({
      category: categoryStr,
      title: titleStr,
      client: clientStr,
      location: locationStr,
      description: descriptionStr,
      aspect: aspectStr,
      files,
    });

    // Bust the public gallery cache immediately so the new project appears right away
    const path = categoryPathMap[categoryStr] ?? "/";
    revalidatePath(path);

    return NextResponse.json({
      success: true,
      project: {
        id: result.id,
        title: titleStr,
        client: clientStr,
        location: locationStr,
        category: categoryStr,
        cover_image: result.coverImage,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
