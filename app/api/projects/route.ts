import { NextResponse } from "next/server";
import { uploadProject } from "@/lib/uploadProject";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const client = formData.get("client");
    const location = formData.get("location");
    const description = formData.get("description");
    const aspect = formData.get("aspect");

    const titleStr = typeof title === "string" ? title.trim() : "";
    const clientStr = typeof client === "string" ? client.trim() : "";
    const locationStr = typeof location === "string" ? location.trim() : "";
    const descriptionStr = typeof description === "string" ? description.trim() : "";
    const aspectStr = aspect === "portrait" || aspect === "landscape" ? aspect : "portrait";

    if (!titleStr) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }
    if (!clientStr) {
      return NextResponse.json(
        { error: "Client is required." },
        { status: 400 }
      );
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required." },
        { status: 400 }
      );
    }

    const result = await uploadProject({
      title: titleStr,
      client: clientStr,
      location: locationStr,
      description: descriptionStr,
      aspect: aspectStr,
      files,
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
