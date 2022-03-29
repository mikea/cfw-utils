# cfw-utils

Small supporting library for writing application servers on CloudFlare Workers. 

Primary goal of the library is to encourage writing strictily typed code.

Other library principles:

- no external runtime dependencies
- minimal overhead
- extreme "tree-shakedness": you don't pay for what you use

https://github.com/mikea/ts-types is used heavily for type machinery.

Provided services:

- json schema validation: io.ts (inspired by io-ts since it is too big nowadays)
- declarative endpoints: endpoints.ts
- router to serve endpoints: router.ts
- calling endpoints: call.ts
