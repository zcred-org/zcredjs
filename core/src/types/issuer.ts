import { HttpCredential, Identifier, MetaIssuerType, StrictId } from "./credential.js";
import { SignFn } from "./wallet-adapter.js";

export type ChallengeOptions = {
  /** Chain id according CAIP-2 */
  chainId?: string;
  /** Redirect URL after issuing or authorization */
  redirectURL?: string;
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

export type Challenge = {
  /** Issuing session unique identifier */
  sessionId: string;
  /** Message for signing */
  message: string;
  /** Verification URL */
  verifyURL?: string;
}

export type CanIssueReq = {
  /** Issuing session unique identifier */
  sessionId: string;
}

export type CanIssue = {
  canIssue: boolean
}

export type IssueReq = {
  /** Issuing session unique identifier */
  sessionId: string;
  /** Signature from Challenge message */
  signature: string;
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
      validFrom: "strict" | "custom";
      validUntil: "strict" | "custom";
    }
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

/** Http issuer interface */
export interface IHttpIssuer {
  /** Issuer endpoint */
  uri: URL;
  /** Info method */
  getInfo(): Promise<Info>;
  /** Challenge method */
  getChallenge(challengeReq: ChallengeReq): Promise<Challenge>;
  /** Can issue method */
  canIssue(canIssueReq: CanIssueReq): Promise<CanIssue>;
  /** Issue method */
  issue<
    TCred extends HttpCredential = HttpCredential
  >(issueReq: IssueReq): Promise<TCred>;
  /** Update proofs method */
  updateProofs?<
    TCred extends HttpCredential = HttpCredential
  >(cred: TCred): Promise<TCred>;
  /** Issue from browser */
  browserIssue?<
    TCred extends HttpCredential = HttpCredential
  >(args: BrowserIssueParams): Promise<TCred>;
}

export interface StrictChallengeReq extends ChallengeReq {
  subject: {
    id: StrictId;
  };
}


export interface IStrictHttpIssuer extends IHttpIssuer {
  getChallenge(challengeReq: StrictChallengeReq): Promise<Challenge>;
}