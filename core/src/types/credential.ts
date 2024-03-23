import { ID_TYPES, IdType, SIGNATURE_PROOFS, SignProofType } from "./index.js";
import { isHttpURL, isISODateTime, isObject, isStrArray } from "../utils/index.js";

export type Identifier = {
  type: string;
  key: string;
}

export function isIdentifier(id: unknown): id is Identifier {
  return (
    typeof id === "object" && id !== null &&
    "type" in id && typeof id.type === "string" &&
    "key" in id && typeof id.key === "string"
  );
}

export type IdentifierSchema = {
  type: string[];
  key: string[];
}

export function isIdentifierSchema(schema: unknown): schema is IdentifierSchema {
  return (
    typeof schema === "object" && schema !== null &&
    "type" in schema && Array.isArray(schema.type) &&
    !schema.type.find((it) => typeof it !== "string") &&
    "key" in schema && isStrArray(schema.key)
  );
}

export type TrSchemaValue<TLink extends string = string> = TLink[] | { [key: string]: TrSchemaValue<TLink> }

export type TrSchema<TLink extends string = string> = Record<string, TrSchemaValue<TLink>>

export type AttributesSchema = TrSchema

export type SignatureProof = {
  type: string;
  issuer: {
    id: Identifier;
  }
  signature: string;
  schema: {
    type: string[],
    issuer: {
      id: IdentifierSchema
    },
    signature: string[]
    attributes: AttributesSchema
  }
}

export function isSignatureProof(proof: unknown): proof is SignatureProof {
  return (
    typeof proof === "object" && proof !== null &&
    "type" in proof && typeof proof.type === "string" &&
    "issuer" in proof && typeof proof.issuer === "object" && proof.issuer !== null &&
    "id" in proof.issuer && isIdentifier(proof.issuer.id) &&
    "schema" in proof && typeof proof.schema === "object" && proof.schema !== null &&
    "type" in proof.schema && isStrArray(proof.schema.type) &&
    "issuer" in proof.schema && isObject(proof.schema.issuer) &&
    "id" in proof.schema.issuer && isIdentifierSchema(proof.schema.issuer.id) &&
    "signature" in proof.schema && isStrArray(proof.schema.signature) &&
    "attributes" in proof.schema && isObject(proof.schema.attributes)
  );
}


export type Proof = SignatureProof

export function isProof(proof: unknown): proof is Proof {
  return isSignatureProof(proof);
}

export type Attributes = {
  type: string;
  issuanceDate: string;
  validFrom: string;
  validUntil: string;
  subject: {
    id: Identifier
  }
}

export function isAttributes(attr: unknown): attr is Attributes {
  return (
    isObject(attr) &&
    "type" in attr && typeof attr.type === "string" &&
    "issuanceDate" in attr && isISODateTime(attr.issuanceDate) &&
    "validFrom" in attr && isISODateTime(attr.validFrom) &&
    "validUntil" in attr && isISODateTime(attr.validUntil) &&
    "subject" in attr && isObject(attr.subject) &&
    "id" in attr.subject && isIdentifier(attr.subject.id)
  );
}

export type ZkCredential<TAttr extends Attributes = Attributes> = {
  attributes: TAttr,
  proofs: { [key: string]: Record<string, Proof> }
}

export function isZkCredential(cred: unknown): cred is ZkCredential {
  return (
    isObject(cred) &&
    "attributes" in cred && isAttributes(cred.attributes) &&
    "proofs" in cred && isCredProofs(cred.proofs)
  );
}

export function isCredProofs(proofs: unknown): proofs is ZkCredential["proofs"] {
  if (!isObject(proofs)) return false;
  for (const proofType in proofs) {
    const value = (proofs as Record<string, unknown>)[proofType];
    if (!isObject(value)) return false;
    for (const reference in value) {
      const proof = (value as Record<string, unknown>)[reference];
      if (!isProof(proof)) return false;
    }
  }
  return true;
}

export const META_ISSUER_TYPES = ["http"] as const;
export type MetaIssuerType = typeof META_ISSUER_TYPES[number]

export type AttributesDefValue = string | { [key: string]: AttributesDefValue }

export interface HttpCredential<TAttr extends Attributes = Attributes> extends ZkCredential<TAttr> {
  meta: {
    issuer: {
      type: MetaIssuerType;
      uri: string;
    }
    definitions: {
      attributes: { [key: string]: AttributesDefValue }
    }
  };
  protection: {
    jws: string;
  };
}

export function isHttpCredential(cred: unknown): cred is HttpCredential {
  return (
    isZkCredential(cred) &&
    "meta" in cred && isObject(cred.meta) &&
    "issuer" in cred.meta && isObject(cred.meta.issuer) &&
    "type" in cred.meta.issuer &&
    //@ts-expect-error
    META_ISSUER_TYPES.includes(cred.meta.issuer.type) &&
    "uri" in cred.meta.issuer && isHttpURL(cred.meta.issuer.uri) &&
    "definitions" in cred.meta && isObject(cred.meta.definitions) &&
    "attributes" in cred.meta.definitions &&
    isObject(cred.meta.definitions.attributes) &&
    "protection" in cred && isObject(cred.protection) &&
    "jws" in cred.protection && typeof cred.protection.jws === "string"
  );
}

export interface StrictId extends Identifier {
  type: IdType;
  key: string;
}

export function isStrictId(id: unknown): id is StrictId {
  return (
    isIdentifier(id) &&
    // @ts-expect-error
    ID_TYPES.includes(id.type)
  );
}

export interface StrictAttributes extends Attributes {
  type: string;
  issuanceDate: string;
  validFrom: string;
  validUntil: string;
  subject: {
    id: StrictId;
  };
}

export function isStrictAttributes(attr: unknown): attr is StrictAttributes {
  return (
    isAttributes(attr) && isStrictId(attr.subject.id)
  );
}

export interface StrictSignatureProof extends SignatureProof {
  type: SignProofType;
  issuer: {
    id: StrictId;
  };
}

export function isStrictSignatureProof(proof: unknown): proof is StrictSignatureProof {
  return (
    isSignatureProof(proof) &&
    // @ts-expect-error
    SIGNATURE_PROOFS.includes(proof.type) &&
    isStrictId(proof.issuer.id)
  );
}
