const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export async function api<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...init } = options ?? {};
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(errorText);
  }
  return res.json() as Promise<T>;
}

export async function apiWithSession<T>(
  path: string,
  session: any,
  options?: RequestInit
): Promise<T> {
  return api<T>(path, {
    ...options,
    token: session?.accessToken,
  });
}
