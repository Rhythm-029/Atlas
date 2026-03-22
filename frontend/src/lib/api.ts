export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Fetch helper — points all calls at the backend API base.
 * No auth token is attached (open access mode).
 */
export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(url, { ...options, headers });
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetchWithAuth(path, options);
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(errorText);
  }
  return res.json() as Promise<T>;
}

// --- Event Manager API Types & Functions ---

export type ClubEnum = "Atlas INC" | "AGILE" | "Student Council" | "Highflyers" | "Futurepreneurs" | "Finterest" | "Stage" | "NSS";
export type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EventCreate {
  name: string;
  club_name: ClubEnum;
  description: string;
  event_date: string;
}

export interface EventResponse {
  id: number;
  name: string;
  club_name: ClubEnum;
  description: string;
  event_date: string;
  status: EventStatus;
  submitted_by: number;
  created_at: string;
}

export const createEvent = (data: EventCreate) => 
  api<EventResponse>("/api/events/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getEvents = (status?: EventStatus) => 
  api<EventResponse[]>(`/api/events/${status ? `?status_filter=${status}` : ""}`);

export const updateEventStatus = (id: number, status: EventStatus) =>
  api<EventResponse>(`/api/events/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export interface PolishRequest {
  text: string;
}

export interface PolishResponse {
  polished_text: string;
}

export const polishText = (data: PolishRequest) =>
  api<PolishResponse>("/api/ai/polish", {
    method: "POST",
    body: JSON.stringify(data),
  });
