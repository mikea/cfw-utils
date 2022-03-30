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
