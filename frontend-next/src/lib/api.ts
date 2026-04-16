import { API_URL } from "./constants";

class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;
  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(body.message || "Request failed", res.status, body);
  }
  return res.json();
}

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  return handleResponse<T>(res);
}

export async function fetchApiServer<T>(
  path: string,
  cookieHeader: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...options.headers,
    },
    ...options,
  });
  return handleResponse<T>(res);
}

export { ApiError };
