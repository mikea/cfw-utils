import { GetTag, WithTag } from "@mikea/ts-types/Tag";
import { Array2 } from "@mikea/ts-types/Arrays";

export interface Decoder<T> {
  readonly decode: (t: unknown) => T | Error;
}

export type Type<T> = Decoder<T> & WithTag<"t", T>;
export type Unknown = Type<unknown>;

export type TypeOf<T extends Unknown> = GetTag<"t", T>;

export const string: Type<string> = {
  decode: (t) => (typeof t === "string" ? t : new Error("string expected")),
};

export const boolean: Type<boolean> = {
  decode: (t) => (typeof t === "boolean" ? t : new Error("boolean expected")),
};

export const number: Type<number> = {
  decode: (t) => (typeof t === "number" ? t : new Error("number expected")),
};

export const literal = <T extends string | number | boolean>(val: T): Type<T> => ({
  decode: (t) => (t === val ? (t as T) : new Error(`${val} expected`)),
});

export const array = <T>(elem: Type<T>): Type<Array<T>> => ({
  decode: (t) => {
    if (!(t instanceof Array)) return new Error("array expected");
    for (const m of t) {
      const result = elem.decode(m);
      if (result instanceof Error) {
        return result;
      }
    }
    return t as Array<T>;
  },
});

export const union = <CS extends Array2<Unknown>>(members: CS): Type<TypeOf<CS[number]>> => ({
  decode: (t) => {
    for (const m of members) {
      const result = m.decode(t);
      if (!(result instanceof Error)) {
        return result;
      }
    }

    return new Error("union expected");
  },
});

export function record<K extends Type<string>, V extends Unknown>(k: K, v: V): Type<Record<TypeOf<K>, TypeOf<V>>> {
  return {
    decode: (t) => {
      if (typeof t !== "object" || t === null) return new Error("record expected");
      for (const key of Object.keys(t)) {
        const kk = k.decode(key);
        if (kk instanceof Error) return kk;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
        const vv = v.decode((t as any)[key]);
        if (vv instanceof Error) return vv;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
      return t as any;
    },
  };
}

export const struct = <A>(properties: { [K in keyof A]: Type<A[K]> }): Type<{
  [K in keyof A]: A[K];
}> => ({
  decode: (t) => {
    if (typeof t !== "object" || t === null) return new Error("object expected");
    for (const key of Object.keys(properties)) {
      if (!(key in t)) return new Error(`missing ${key}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
      const v = properties[key as keyof A].decode((t as any)[key]);
      if (v instanceof Error) return v;
    }
    return t as { [K in keyof A]: A[K] };
  },
});
