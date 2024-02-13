export * from "./wallet-adapter/index.js";
import * as u8a from "uint8arrays";

export const EthSignature = {
  toBase58(hexSignature: string): string {
    const signature = hexSignature.startsWith("0x")
      ? hexSignature.slice(2).toLowerCase()
      : hexSignature.toLowerCase();
    return u8a.toString(u8a.fromString(signature, "hex"), "base58btc");
  },
  fromBase58(signature: string): string {
    return "0x" + u8a.toString(u8a.fromString(signature, "base58btc"), "hex");
  }
};