import {
  ID_TYPES,
  IdType,
  MINA_CHAINIDS,
  MinaChainId,
  SIGNATURE_PROOFS,
  SignatureProof,
  SignProofType,
  StrictId
} from "../types/index.js";

function isIdType(id: string): id is IdType {
  return ID_TYPES
    // @ts-ignore
    .includes(id);
}

function isSignProofType(proofType: string): proofType is SignProofType {
  return SIGNATURE_PROOFS
    // @ts-ignore
    .includes(proofType);
}

function normalizeId(id: StrictId): StrictId {
  if (id.type === "ethereum:address") {
    let key = id.key.toLowerCase();
    key = key.startsWith("0x") ? key : `0x${key}`;
    return { type: id.type, key: key };
  }
  return id;
}

function isMinaChainId(chainId: string): chainId is MinaChainId {
  return MINA_CHAINIDS
    // @ts-expect-error
    .includes(chainId);
}

function isSignatureProof(proof: any): proof is SignatureProof {
  return typeof proof?.issuer?.id?.key === "string" &&
    typeof proof?.issuer?.id?.type === "string" &&
    typeof proof?.signature === "string" &&
    typeof proof?.type === "string" &&
    typeof proof?.schema === "object" &&
    typeof proof?.schema?.attributes === "object" &&
    Array.isArray(proof?.schema?.signature) &&
    Array.isArray(proof?.schema?.issuer?.id?.key) &&
    Array.isArray(proof?.schema?.issuer?.id?.type) &&
    Array.isArray(proof?.schema?.type);
}

export const zcredjs = {
  isIdType,
  isSignProofType,
  normalizeId,
  isMinaChainId,
  isSignatureProof,
  chainIdReqexp: "^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}$"
};

export { repeatUtil } from "./repeat.js";