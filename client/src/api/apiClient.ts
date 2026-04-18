const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiFetchOptions<TBody = unknown> = {
  method?: HttpMethod;
  body?: TBody;
};

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: ApiFetchOptions<TBody> = {},
): Promise<TResponse> {
  const method = options.method ?? "GET";
  const hasBody = options.body !== undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("API error", {
      status: response.status,
      body: errorText,
    });

    throw new Error(
      errorText || `Request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}
