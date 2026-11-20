import { getCalApiConfig } from "./env";
import type { ApiResponse } from "./types";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: Method;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  apiVersion?: string;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
  retries?: number;
};

class CalApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "CalApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function buildQuery(query?: RequestOptions["query"]): string {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }
    params.set(key, String(value));
  }

  const str = params.toString();
  return str ? `?${str}` : "";
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function calApi<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { apiKey, apiUrl, apiVersion } = getCalApiConfig();
  const url = `${apiUrl}${path}${buildQuery(options.query)}`;
  const method = options.method ?? "GET";
  const isIdempotent = method === "GET";
  const maxRetries = options.retries ?? (isIdempotent ? 2 : 0);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "cal-api-version": options.apiVersion ?? apiVersion,
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let lastError: CalApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: options.cache,
      headers,
      method,
      next: options.next,
    });

    let payload: ApiResponse<T> | undefined;

    try {
      payload = (await response.json()) as ApiResponse<T>;
    } catch {
      if (!response.ok) {
        lastError = new CalApiError(
          `Cal.com API ${response.status} ${response.statusText}`,
          "UNKNOWN",
          response.status,
        );
      } else {
        throw new CalApiError(
          "Cal.com API returned no body",
          "EMPTY_BODY",
          500,
        );
      }
    }

    if (payload && response.ok && payload.status === "success") {
      return payload.data;
    }

    if (!lastError) {
      const err = payload?.status === "error" ? payload.error : undefined;
      lastError = new CalApiError(
        err?.message ?? `Cal.com API ${response.status}`,
        err?.code ?? `HTTP_${response.status}`,
        response.status,
        err?.details,
      );
    }

    const shouldRetry =
      attempt < maxRetries &&
      (lastError.status === 429 || lastError.status === 503);

    if (!shouldRetry) {
      break;
    }

    const retryAfter = Number(response.headers.get("retry-after"));
    const backoffMs =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 5000)
        : 400 * 2 ** attempt + Math.floor(Math.random() * 200);

    await sleep(backoffMs);
    lastError = null;
  }

  throw (
    lastError ?? new CalApiError("Cal.com API request failed", "UNKNOWN", 500)
  );
}

export { CalApiError };
