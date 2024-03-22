import {
  ID_TYPES,
  IdType,
  MINA_CHAINIDS,
  MinaChainId,
  SIGNATURE_PROOFS,
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

export function isStrArray(arr: unknown): arr is string[] {
  return (
    typeof arr === "object" && Array.isArray(arr) &&
    !(arr.find((it) => typeof it !== "string"))
  );
}

export function isObject(obj: unknown): obj is {} {
  return (
    typeof obj === "object" && obj !== null
  );
}

export function isHttpURL(url: unknown): boolean {
  try {
    if (typeof url === "string" && url.startsWith("http")) {
      new URL(url);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// TODO: change this
export function isISODateTime(dateTime: unknown): boolean {
  try {
    if (typeof dateTime === "string") {
      new Date(dateTime).toISOString();
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export const zcredjs = {
  isIdType,
  isSignProofType,
  normalizeId,
  isMinaChainId,
  chainIdReqexp: "^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}$"
};

export { repeatUtil } from "./repeat.js";