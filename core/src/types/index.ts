export const ID_TYPES = ["ethereum:address", "mina:publickey"] as const;
export type IdType = typeof ID_TYPES[number];

export const SIGNATURE_PROOFS = [
  "mina:poseidon-pasta",
  // "sha256-secp256k1"
] as const;
export type SignProofType = typeof SIGNATURE_PROOFS[number];

export type ProofType = SignProofType

export const CRED_TYPES = ["passport", "passport-test"] as const;
export type CredType = typeof CRED_TYPES[number];

export const MINA_CHAINIDS = ["mina:mainnet", "mina:berkeley"] as const;
export type MinaChainId = typeof MINA_CHAINIDS[number];

export * from "./credential.js";
export * from "./issuer.js";
export * from "./wallet-adapter.js";
export * from "./credential-verifier.js"