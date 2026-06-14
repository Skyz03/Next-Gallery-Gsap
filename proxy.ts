import { NextRequest, NextResponse } from "next/server";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("admin_session");
  if (!cookie?.value) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const expected = await computeSessionToken();
  if (!expected || cookie.value !== expected) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("admin_session");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
