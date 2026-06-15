import { cookies } from "next/headers";

export const API_URL = process.env.API_URL ?? "http://localhost:4000";
export const AUTH_COOKIE = "auth_token";

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

/** Calls the Express API without auth — used for public endpoints. */
export async function publicApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? "Request failed", body.code);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Calls the Express API with the staff JWT from the httpOnly cookie. Server-side only. */
export async function authApi<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? "Request failed", body.code);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
