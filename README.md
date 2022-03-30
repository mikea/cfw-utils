# cfw-utils

Small supporting library for writing application servers on CloudFlare Workers. 

Primary goal of the library is to encourage writing strictily typed code.

Other library principles:

- no external runtime dependencies
- minimal overhead
- extreme "tree-shakedness": you don't pay for what you use

https://github.com/mikea/ts-types is used heavily for type machinery.

## Provided services

- json schema validation: decoder.ts
- declarative endpoints: endpoints.ts
- router to serve endpoints: router.ts
- calling endpoints: call.ts

### Decoder

Decoder validates json data structures.  Inspired by io-ts, but tiny and tree shakeable.

```typescript
import * as d from "./decoder";
// build decoder up from primitives
const model = d.struct({ a: d.string, b: d.number });
// extract Typescript interface definition from the validator
type IModel = d.TypeOf<typeof modelValidator>;

// objects that pass validation will be cast to the IModel type.
const v1: IModel | Error = model.decode({a: "1", b: 2 });
// objects that don't will decode to Error.
const v2: IModel | Error = model.decode({a: "1" });

```

### Endpoints

Endpoint declaration defines its http properties and holds type information for request and response:

```typescript
import { endpoint, RequestType, ResponseType } from "./endpoint";
// POST is default.
export const Hello = endpoint<IHelloRequest, IHelloResponse>({
  path: "/hello",
});

// request and response types can be extracted back:
let request: RequestType<typeof Hello>;
let response: ResponseType<typeof Hello>;
```

Decoders can be specified, which will validate the request/response:

```typescript
import { endpoint, RequestType, ResponseType } from "./endpoint";

const request = d.struct({ name: d.string });
const response = d.struct({ message: d.string });

export const Hello = endpoint({
  path: "/hello",
  request,
  response,
});
```

#### Calling endpoints

Simple typed wrapper around fetch() to call endpoints of distributed objects.

```typescript
const r: IHelloResponse | Error = call(Hello, { name: "cfw-utils" });
```

#### Serving endpoints

Endpoints can be handled in workers and distributed objects:

```typescript
import { Server, Handler } from "./server";

// define endpoint handler

const helloHandler: Handler<typeof Hello, Env> = async (request, httpRequest, eng) => 
    ({ message: `Hello ${request.name}`});

const server = new Server().add(Hello, helloHandler);

export default {
  fetch: (request: Request, env: Env) => {
    return server.fetch(request, env);
  },
};

```
