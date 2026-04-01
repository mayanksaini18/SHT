import { cookies } from "next/headers";
import { fetchApiServer } from "./api";
import type { User } from "@/types/user";

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) return null;

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    return await fetchApiServer<User>("/auth/me", cookieHeader);
  } catch {
    return null;
  }
}

export async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}
