"use client";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export async function fetchJson<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    auth?: boolean;
  } = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${getApiBaseUrl()}${path}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth) {
    const token = getStoredToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export async function loginWithEmailPassword(email: string, password: string) {
  const result = await fetchJson<{ accessToken: string; user: { id: string; email: string; fullName: string; role: string } }>(
    "/users/login",
    { method: "POST", body: { email, password } }
  );
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("currentUser", JSON.stringify(result.user));
  }
  return result;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
  }
}

export function getCurrentUser(): { id: string; email: string; fullName: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

