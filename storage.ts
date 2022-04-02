export interface ICell<T> {
  put(t: T): Promise<T>;
  get(): Promise<T | undefined>;
  delete(): Promise<boolean>;
}

export interface ICachedCell<T> extends ICell<T> {
  value: T | undefined;
}

interface WithState {
  state: DurableObjectState;
}

export function cell<T>(obj: WithState, name: string): ICell<T> {
  return {
    put: async (t: T) => {
      await obj.state.storage.put(name, t);
      return t;
    },
    get: async () => {
      return obj.state.storage.get(name);
    },
    delete: async () => {
      return obj.state.storage.delete(name);
    },
  };
}

export function cachedCell<T>(state: DurableObjectState, name: string): ICachedCell<T> {
  let lastValue: T | undefined;
  state.blockConcurrencyWhile(async () => {
    lastValue = await state.storage.get(name);
  }).catch((e) => console.error("unexpected error", e));
  return {
    get value() {
      return lastValue; 
    },
    put: async (t: T) => {
      lastValue = t;
      await state.storage.put(name, t);
      return t;
    },
    get: async () => {
      lastValue = await state.storage.get(name);
      return lastValue;
    },
    delete: async () => {
      lastValue = undefined;
      return state.storage.delete(name);
    },
  };
}

export function getFromString(ns: DurableObjectNamespace, id: string): DurableObjectStub {
  return ns.get(ns.idFromString(id));
}
