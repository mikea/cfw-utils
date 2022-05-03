import { Endpoint } from "./endpoint.js";

export async function call<TRequest, TResponse>(
  fetcher: Fetcher,
  endpoint: Endpoint<TRequest, TResponse>,
  request: TRequest,
): Promise<TResponse | Error> {
  const resp = await fetcher.fetch(`http://localhost${endpoint.path}`, {
    body: JSON.stringify(request),
    method: "POST",
  });
  if (!resp.ok) {
    return new Error(`HTTP error: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}
