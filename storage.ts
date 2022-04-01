export interface ICell<T> {
  put(t: T): Promise<T>;
  get(): Promise<T | undefined>;
  delete(): Promise<boolean>;
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

export function getFromString(ns: DurableObjectNamespace, id: string): DurableObjectStub {
  return ns.get(ns.idFromString(id));
}