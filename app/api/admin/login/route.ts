import { NextResponse } from "next/server";
import { createHmac } from "crypto";

function computeSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!secret) return "";
  return createHmac("sha256", secret).update("admin-v1").digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || !password || password !== expected) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = computeSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
