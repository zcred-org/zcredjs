import * as randomNodeBytes from "randombytes";

export { randomBytes };

function randomBytes(n: number) {
  return new Uint8Array(randomNodeBytes.default(n));
}
