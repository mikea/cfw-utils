import * as t from "./io";

type HttpMethod = "GET" | "POST";

type HttpContentType = "text/javascript" | "text/json";

type RequestTag<T> = { _req?: T };
type ResponseTag<T> = { _res?: T };

type Types<TRequest, TResponse> = {
  request?: t.Type<TRequest>;
  response?: t.Type<TResponse>;
};

type EndpointParms<TRequest, TResponse> = {
  path: string;
  method?: HttpMethod;
  responseContentType?: HttpContentType;
} & Partial<Types<TRequest, TResponse>>;

export type Endpoint<TRequest, TResponse> = EndpointParms<TRequest, TResponse> &
  RequestTag<TRequest> &
  ResponseTag<TResponse>;

export type EndpointRequestType<EndpointType extends Endpoint<unknown, unknown>> = NonNullable<EndpointType["_req"]>;
export type EndpointResponseType<EndpointType extends Endpoint<unknown, unknown>> = NonNullable<EndpointType["_res"]>;

type GetEndpointParams<TRequest, TResponse> = Omit<EndpointParms<TRequest, TResponse>, "method"> & { method: "GET" };
type NotGet = Exclude<HttpMethod, "GET">;
type NotGetEndpointParams<TRequest, TResponse> = Omit<EndpointParms<TRequest, TResponse>, "method"> & {
  method?: NotGet;
};

export function endpoint<TResponse>(params: GetEndpointParams<unknown, TResponse>): Endpoint<unknown, TResponse>;
export function endpoint<TRequest, TResponse>(
  params: NotGetEndpointParams<TRequest, TResponse>,
): Endpoint<TRequest, TResponse>;
export function endpoint<TRequest, TResponse>(
  params: EndpointParms<TRequest, TResponse>,
): Endpoint<TRequest, TResponse> {
  return params;
}

type IOEndpointParams<TRequest, TResponse> = EndpointParms<TRequest, TResponse> & Types<TRequest, TResponse>;
export function ioEndpoint<TRequest, TResponse>(
  params: IOEndpointParams<TRequest, TResponse>,
): Endpoint<TRequest, TResponse> {
  return params;
}

export class HttpError extends Error {
  constructor(public readonly status: 404, message?: string) {
    super(message);
  }
}
