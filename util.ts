export function checked<T>(fn: () => T): T | Error {
    try {
      return fn();
    } catch (err: unknown) {
      if (err instanceof Error) {
        return err;
      }
      return new Error(`Unknown error: ${err}`);
    }
  }
  