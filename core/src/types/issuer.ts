import {
  AttributesDefValue,
  HttpCredential,
  Identifier,
  isIdentifier,
  isStrictId,
  META_ISSUER_TYPES,
  MetaIssuerType,
  StrictId
} from "./credential.js";
import { SignFn } from "./wallet-adapter.js";
import { isHttpURL, isISODateTime, isObject } from "../utils/index.js";

export type ChallengeOptions = {
  /** Chain id according CAIP-2 */
  chainId?: string;
  /** Redirect URL after document verification process (e.g. after KYC process) */
  redirectURL?: string;
}

export function isChallengeOptions(options: unknown): options is ChallengeOptions {
  return (
    typeof options === "object" && options !== null && (
      !("chainId" in options) || (
        "chainId" in options && (
          typeof options.chainId === "undefined" ||
          typeof options.chainId === "string"
        )
      )
    ) && (
      !("redirectURL" in options) || (
        "redirectURL" in options && (
          typeof options.redirectURL === "undefined" ||
          typeof options.redirectURL === "string"
        )
      )
    )
  );
}

export type ChallengeReq = {
  subject: {
    /** Credential subject identifier */
    id: Identifier;
  }
  /** Date when credential becomes valid */
  validFrom?: string;
  /** Date when credential becomes not valid */
  validUntil?: string;
  options?: ChallengeOptions
}

export function isChallengeReq(req: unknown): req is ChallengeReq {
  return (
    typeof req === "object" && req !== null &&
    "subject" in req && typeof req.subject === "object" &&
    req.subject !== null &&
    "id" in req.subject && typeof req.subject.id === "object" &&
    req.subject.id !== null &&
    isIdentifier(req.subject.id) && (
      !("validFrom" in req) || (
        "validFrom" in req && (
          typeof req.validFrom === "undefined" ||
          (typeof req.validFrom === "string" && isISODateTime(req.validFrom))
        )
      )
    ) && (
      !("validUntil" in req) || (
        "validUntil" in req && (
          typeof req.validUntil === "undefined" ||
          (typeof req.validUntil === "string" && isISODateTime(req.validUntil))
        )
      )
    ) && (
      !("options" in req) || (
        "options" in req && (
          typeof req.options === "undefined" || isChallengeOptions(req.options)
        )
      )
    )
  );
}

export type Challenge = {
  /** Issuing session unique identifier */
  sessionId: string;
  /** Message for signing */
  message: string;
  /** Verification URL */
  verifyURL?: string;
}

export function isChallenge(challenge: unknown): challenge is Challenge {
  return (
    typeof challenge === "object" && challenge !== null &&
    "sessionId" in challenge && typeof challenge.sessionId === "string" &&
    "message" in challenge && typeof challenge.message === "string" && (
      !("verifyURL" in challenge) || (
        "verifyURL" in challenge && (
          typeof challenge.verifyURL === "undefined" ||
          (typeof challenge.verifyURL === "string" && isHttpURL(challenge.verifyURL))
        )
      )
    )
  );
}

export type CanIssueReq = {
  /** Issuing session unique identifier */
  sessionId: string;
}

export function isCanIssueReq(req: unknown): req is CanIssueReq {
  return (
    isObject(req) &&
    "sessionId" in req && typeof req.sessionId === "string"
  );
}

export type CanIssue = {
  canIssue: boolean
}

export function isCanIssue(resp: unknown): resp is CanIssue {
  return (
    typeof resp === "object" && resp !== null &&
    "canIssue" in resp && typeof resp.canIssue === "boolean"
  );
}

export type IssueReq = {
  /** Issuing session unique identifier */
  sessionId: string;
  /** Signature from Challenge message */
  signature: string;
}

export function isIssueReq(req: unknown): req is IssueReq {
  return (
    typeof req === "object" && req !== null &&
    "sessionId" in req && typeof req.sessionId === "string" &&
    "signature" in req && typeof req.signature === "string"
  );
}

export type WindowOptions = {
  feature?: string;
  target?: string;
}

export type BrowserIssueParams = {
  challengeReq: ChallengeReq;
  sign: SignFn;
  windowOptions?: WindowOptions;
}

export const ATTRIBUTE_POLICIES = ["strict", "custom"] as const;
export type AttributePolicy = typeof ATTRIBUTE_POLICIES[number]

export type Info = {
  protection: {
    /** kid for credential JWS verification */
    jws: { kid: string; }
  }
  issuer: {
    /** Type of issuer */
    type: MetaIssuerType;
    /** Issuer URI */
    uri: string;
  }
  credential: {
    /** credential type provided by issuer */
    type: string;
    /**
     * If attributes policy value is "strict" this mean that only issuer can set value of the property.
     * If attributes policy value is "custom" this mean that subject can set value of the property
     */
    attributesPolicy: {
      validFrom: AttributePolicy;
      validUntil: AttributePolicy;
    }
  },
  definitions: {
    attributes: { [key: string]: AttributesDefValue };
  }
  proofs: {
    /** If true Issuer MUST provide update proofs method */
    updatable: boolean;
    /** ISO date when new proof type was added to credential*/
    updatedAt: string;
    /** key MUST be proof-type and value reference list */
    types: { [key: string]: string[] }
  }
}

export function isInfo(info: unknown): info is Info {
  return (
    typeof info === "object" && info !== null &&
    "protection" in info &&
    typeof info.protection === "object" && info.protection !== null &&
    "jws" in info.protection &&
    typeof info.protection.jws === "object" && info.protection.jws !== null &&
    "kid" in info.protection.jws &&
    typeof info.protection.jws.kid === "string" &&
    "issuer" in info &&
    typeof info.issuer === "object" && info.issuer !== null &&
    "type" in info.issuer && typeof info.issuer.type === "string" &&
    //@ts-expect-error
    META_ISSUER_TYPES.includes(info.issuer.type) &&
    "uri" in info.issuer && typeof info.issuer.uri === "string" &&
    isHttpURL(info.issuer.uri) &&
    "credential" in info && typeof info.credential === "object" &&
    info.credential !== null &&
    "type" in info.credential && typeof info.credential.type === "string" &&
    "attributesPolicy" in info.credential &&
    typeof info.credential.attributesPolicy === "object" &&
    info.credential.attributesPolicy !== null &&
    "validFrom" in info.credential.attributesPolicy &&
    typeof info.credential.attributesPolicy.validFrom === "string" &&
    // @ts-expect-error
    ATTRIBUTE_POLICIES.includes(info.credential.attributesPolicy.validFrom) &&
    "validUntil" in info.credential.attributesPolicy &&
    typeof info.credential.attributesPolicy.validUntil === "string" &&
    // @ts-expect-error
    ATTRIBUTE_POLICIES.includes(info.credential.attributesPolicy.validUntil) &&
    "definitions" in info && typeof info.definitions === "object" &&
    info.definitions !== null &&
    "attributes" in info.definitions &&
    typeof info.definitions.attributes === "object" &&
    info.definitions.attributes !== null &&
    "proofs" in info && typeof info.proofs === "object" && info.proofs !== null &&
    "updatable" in info.proofs && typeof info.proofs.updatable === "boolean" &&
    "updatedAt" in info.proofs && typeof info.proofs.updatedAt === "string" &&
    isISODateTime(info.proofs.updatedAt) &&
    "types" in info.proofs && typeof info.proofs.types === "object" &&
    info.proofs.types !== null
  );
}


/** Http issuer interface */
export interface IHttpIssuer<
  TCred extends HttpCredential = HttpCredential
> {
  /** Issuer endpoint */
  uri: URL;
  /** Info method */
  getInfo(): Promise<Info>;
  /** Challenge method */
  getChallenge(challengeReq: ChallengeReq): Promise<Challenge>;
  /** Can issue method */
  canIssue(canIssueReq: CanIssueReq): Promise<CanIssue>;
  /** Issue method */
  issue(issueReq: IssueReq): Promise<TCred>;
  /** Update proofs method */
  updateProofs?(cred: TCred): Promise<TCred>;
  /** Issue from browser */
  browserIssue?(args: BrowserIssueParams): Promise<TCred>;
}

export interface StrictChallengeReq extends ChallengeReq {
  subject: {
    id: StrictId;
  };
}

export function isStrictChallengeReq(req: unknown): req is StrictChallengeReq {
  return isChallengeReq(req) && isStrictId(req.subject.id);
}

export interface IStrictHttpIssuer<
  TCred extends HttpCredential = HttpCredential
> extends IHttpIssuer<TCred> {
  getChallenge(challengeReq: StrictChallengeReq): Promise<Challenge>;
}