
import "server-only";

import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error("UNAUTHENTICATED");
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
