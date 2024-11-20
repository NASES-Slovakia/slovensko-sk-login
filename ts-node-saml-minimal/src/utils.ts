import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
export const __dirname = path.dirname(__filename); // get the name of the directory

export function assertIsDefined<T>(
  val: T,
  failureMessage?: string
): NonNullable<T> {
  if (val === undefined || val === null) {
    if (failureMessage) {
      console.log({ val });
      throw new Error(failureMessage);
    }
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
  return val;
}

export function awaitable(fn: Function) {
  return function (...args: any[]) {
    return new Promise((resolve, reject) => {
      fn(...args, (err: any, ...args) => {
        if (err) {
          reject(err);
        } else {
          resolve(args);
        }
      });
    });
  };
}
