import { CredType, IdType, SignProofType } from "./index.js";

export type Identifier = {
  type: string;
  key: string;
}

export type IdentifierSchema = {
  type: string[];
  key: string[];
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

export type Proof = SignatureProof

export type Attributes = {
  type: string;
  issuanceDate: string;
  validFrom: string;
  validUntil: string;
  subject: {
    id: Identifier
  }
}

export type ZkCredential<TAttr extends Attributes = Attributes> = {
  attributes: TAttr,
  proofs: { [key: string]: Record<string, Proof> }
}

export const META_ISSUER_TYPES = ["http"] as const;
export type MetaIssuerType = typeof META_ISSUER_TYPES[number]

type AttributesDefValue = string | { [key: string]: AttributesDefValue }

export interface HttpCredential<TAttr extends Attributes = Attributes> extends ZkCredential<TAttr> {
  meta: {
    issuer: {
      type: MetaIssuerType;
      uri: string;
    }
    attributesDefinition: { [key: string]: AttributesDefValue }
  };
  protection: {
    jws: string;
  };
}

export interface StrictId extends Identifier {
  type: IdType;
  key: string;
}

export interface StrictAttributes extends Attributes {
  type: CredType;
  issuanceDate: string;
  validFrom: string;
  validUntil: string;
  subject: {
    id: Identifier;
  };
}

export interface StrictSignatureProof extends SignatureProof {
  type: SignProofType;
  issuer: {
    id: StrictId;
  };
}

export type Gender = "male" | "female" | "other"

export interface PassportAttributes extends StrictAttributes {
  type: CredType;
  issuanceDate: string;
  validFrom: string;
  validUntil: string;
  subject: {
    id: StrictId;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    countryCode: string;
    document: {
      id: string;
    }
  };
}

export type PassportCred = HttpCredential<PassportAttributes>

