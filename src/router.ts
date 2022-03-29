import { Endpoint, RequestType, ResponseType } from "./endpoint";

export class HttpError extends Error {
  constructor(public readonly status: 404, message?: string) {
    super(message);
  }
}

export type EndpointHandler<TRequest, TResponse, TArg = unknown> = (
  request: TRequest,
  httpRequest: Request,
  arg: TArg,
) => Promise<TResponse | HttpError | Error>;


export type Handler<EndpointType extends Endpoint<unknown, unknown>, TArg = unknown> = EndpointHandler<
  RequestType<EndpointType>,
  ResponseType<EndpointType>,
  TArg
>;

type EndpointWithHandler<TRequest, TResponse> = [Endpoint<TRequest, TResponse>, EndpointHandler<TRequest, TResponse>];

export class Router<TArg = unknown> {
  private readonly endpoints: Array<EndpointWithHandler<unknown, unknown>> = [];

  public add<TRequest, TResponse>(
    endpoint: Endpoint<TRequest, TResponse>,
    handler: EndpointHandler<TRequest, TResponse, TArg>,
  ): Router<TArg> {
    this.endpoints.push([endpoint, handler] as EndpointWithHandler<unknown, unknown>);
    return this;
  }

  public async fetch(request: Request, arg: TArg): Promise<Response> {
    const url = new URL(request.url);

    for (const endpointWithHandler of this.endpoints) {
      const endpoint = endpointWithHandler[0];
      const method = endpoint.method ?? "POST";
      if (endpoint.path === url.pathname && request.method === method) {
        return this.fetchEndpoint(endpoint, endpointWithHandler[1], request, arg);
      }
    }

    console.error(`not found: ${request.method} ${url.pathname}`);
    return new Response("", { status: 404 });
  }

  private async fetchEndpoint<TRequest, TResponse>(
    endpoint: Endpoint<TRequest, TResponse>,
    handler: EndpointHandler<TRequest, TResponse>,
    request: Request,
    arg: TArg,
  ): Promise<Response> {
    const method = endpoint.method ?? "POST";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = method == "GET" ? (undefined as any as TRequest) : await request.json<TRequest>();
    if (endpoint.request) {
      const validation = endpoint.request.decode(body);
      if (validation instanceof Error) {
        return new Response("", { status: 400 });
      }
    }
    const response = await handler(body, request, arg);
    const responseContentType = endpoint.responseContentType ?? "text/json";

    if (response instanceof HttpError) {
      return new Response("", { status: response.status });
    }

    if (response instanceof Error) {
      return new Response("", { status: 500 });
    }

    // todo: validate response

    return new Response(stringify(response, responseContentType), {
      headers: { "content-type": responseContentType },
    });
  }
}

function stringify<TResponse>(response: TResponse, responseContentType: string): string {
  return responseContentType === "text/json" ? JSON.stringify(response) : String(response);
}

export function router(): Router {
  return new Router();
}
