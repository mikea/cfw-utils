import { GetTag, WithTag } from "@mikea/ts-types/Tag";
import { Decoder } from "./decoder.js";

type HttpMethod = "GET" | "POST";
type NotGet = Exclude<HttpMethod, "GET">;

type HttpContentType = "text/javascript" | "text/json";

type Decoders<TRequest, TResponse> = {
  request: Decoder<TRequest>;
  response: Decoder<TResponse>;
};

type EndpointParms<TRequest, TResponse> = {
  path: string;
  method?: HttpMethod;
  responseContentType?: HttpContentType;
} & Partial<Decoders<TRequest, TResponse>>;

export type Endpoint<TRequest, TResponse> = EndpointParms<TRequest, TResponse> &
  WithTag<"_req", TRequest> &
  WithTag<"_res", TResponse>;

export type ResponseType<EndpointType extends Endpoint<unknown, unknown>> = GetTag<"_res", EndpointType>;
export type RequestType<EndpointType extends Endpoint<unknown, unknown>> = GetTag<"_req", EndpointType>;

// GET doesn't have body.
type GetEndpointParams<TRequest, TResponse> = Omit<EndpointParms<TRequest, TResponse>, "method" | "request"> & {
  method: "GET";
};
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

type IOEndpointParams<TRequest, TResponse> = EndpointParms<TRequest, TResponse> & Decoders<TRequest, TResponse>;
export function jsonEndpoint<TRequest, TResponse>(
  params: IOEndpointParams<TRequest, TResponse>,
): Endpoint<TRequest, TResponse> {
  return params;
}
