import { random as randomNodeBytes } from "@lukeed/csprng";

export { randomBytes };

function randomBytes(n: number) {
  return new Uint8Array(randomNodeBytes(n));
}
