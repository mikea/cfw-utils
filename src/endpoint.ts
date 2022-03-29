import { GetTag, WithTag } from "@mikea/ts-types/src/Tag";
import * as t from "./io";

type HttpMethod = "GET" | "POST";

type HttpContentType = "text/javascript" | "text/json";

type Types<TRequest, TResponse> = {
  request?: t.Decoder<TRequest>;
  response?: t.Decoder<TResponse>;
};

type EndpointParms<TRequest, TResponse> = {
  path: string;
  method?: HttpMethod;
  responseContentType?: HttpContentType;
} & Partial<Types<TRequest, TResponse>>;

export type Endpoint<TRequest, TResponse> = EndpointParms<TRequest, TResponse> &
  WithTag<"_req", TRequest> &
  WithTag<"_res", TResponse>;

export type ResponseType<EndpointType extends Endpoint<unknown, unknown>> = GetTag<"_res", EndpointType>;
export type RequestType<EndpointType extends Endpoint<unknown, unknown>> = GetTag<"_req", EndpointType>;

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
