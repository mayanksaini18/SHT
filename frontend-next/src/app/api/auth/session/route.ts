import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// POST: Set the access_token cookie on the frontend domain
export async function POST(request: NextRequest) {
  const { accessToken } = await request.json();
  if (!accessToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const isProd = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ ok: true });
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });
  return response;
}

// DELETE: Clear the access_token cookie (logout)
export async function DELETE() {
  const isProd = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ ok: true });
  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
