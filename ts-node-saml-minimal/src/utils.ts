import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

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

export async function printLoginUrl(login_url: string) {
  const url = new URL(login_url);
  const samlRequest = url.searchParams.get("SAMLRequest");
  console.log({ login_url });
  printSamlRequest(samlRequest);
}

export async function printSamlRequest(samlRequest: string | null) {
  if (!samlRequest) {
    throw new Error("SAMLRequest not found in login_url");
  }
  const buf = Buffer.from(samlRequest, "base64");
  // console.log([buf[0], buf[1]]);
  let samlRequestDecoded;
  // detect if the SAMLRequest is zlib compressed
  if (buf[0] === 125 && buf[1] === 146) {
    samlRequestDecoded = await new Promise((resolve, reject) => {
      zlib.inflateRaw(buf, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer.toString("utf-8"));
      });
    });
  } else {
    samlRequestDecoded = buf.toString("utf-8");
  }

  console.log("\nSAMLRequest decoded START:");
  console.log(samlRequestDecoded);
  console.log("SAMLRequest decoded END\n");
  return samlRequestDecoded;
}

export function pemWrap(header: string, body: string) {
  return `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`;
}
