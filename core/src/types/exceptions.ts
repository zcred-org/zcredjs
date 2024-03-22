import { isObject } from "../utils/index.js";

/** Issuer Exception Codes */
export const IEC = {
  /** ENOTFOUND of any required method */
  NO_ISSUER: 10000 as const,
  /** issuer error, http status code is 500 at any method*/
  ISSUER_ERROR: 10001 as const,
  /** Access token required */
  NO_ACCESS_TOKEN: 10002 as const,
  /** Access token is invalid */
  INVALID_ACCESS_TOKEN: 10003 as const,
  /** "getInfo" returns invalid body, not JSON Info type*/
  INFO_BAD_RESP: 11001 as const,
  /** Bad challenge request */
  CHALLENGE_BAD_REQ: 12001 as const,
  /** Challenge response not match expected JSON */
  CHALLENGE_BAD_RESP: 12002 as const,
  /** Bad "canIssue" request */
  CAN_ISSUE_BAD_REQ: 13001 as const,
  /** Can issue response not matched expected JSON */
  CAN_ISSUE_BAD_RESP: 13002 as const,
  /** Session not found during "canIssue" method */
  CAN_ISSUE_NO_SESSION: 13003 as const,
  /** Bad "issue" request */
  ISSUE_BAD_REQ: 14001 as const,
  /** Bad "issue" resp */
  ISSUE_BAD_RESP: 14002 as const,
  /** Session not fount during "issue" method */
  ISSUE_NO_SESSION: 14003 as const,
  /** Client signature is not valid in "issue" request */
  ISSUE_BAD_SIGNATURE: 14004 as const,
  /** Bad "updateProofs" request */
  UPDATE_PROOFS_BAD_REQ: 15001 as const,
  /** Bad credential send in "updateProofs" */
  UPDATE_PROOFS_BAD_RESP: 15002 as const
};

export type IECode = typeof IEC[keyof typeof IEC]

export function isIECode(code: unknown): code is IECode {
  return (
    typeof code === "number" &&
    // @ts-expect-error
    Object.values(IEC).includes(code)
  );
}


/** Subject Exception Codes */
export const SEC = {
  REJECT: 20000 as const
};

export type SECode = typeof SEC[keyof typeof SEC]

export function isSECode(code: unknown): code is SECode {
  return (
    typeof code === "number" &&
    // @ts-expect-error
    Object.values(SEC).includes(code)
  );
}

/** Verifier Exception Codes */
export const VEC = {
  /** When ENOTFOUND at any request */
  NO_VERIFIER: 30000 as const,
  /** When http status code is 5xx at any request*/
  VERIFIER_ERROR: 30001 as const,
  /** Bad proposal request */
  PROPOSAL_BAD_REQ: 31001 as const,
  /** Proposal bad response */
  PROPOSAL_BAD_RESP: 31002 as const,
  /** Verify bad request */
  VERIFY_BAD_REQ: 32001 as const,
  /** Verify bad response, http body is not match expected JSON */
  VERIFY_BAD_RESP: 32002 as const,
  /** Verify no session found */
  VERIFY_NO_SESSION: 32003 as const,
  /** Verify invalid signature send in request */
  VERIFY_INVALID_SIGNATURE: 32004 as const,
  /** Invalid proof send to response */
  VERIFY_INVALID_PROOF: 32005 as const,
  /** session, signature and proof is ok, but for some reason verifier doesn't want to commit verification */
  VERIFY_NOT_PASSED: 32006 as const
};

export type VECode = typeof VEC[keyof typeof VEC]

export function isVECode(code: unknown): code is VECode {
  return (
    typeof code === "number" &&
    // @ts-expect-error
    Object.values(VEC).includes(code)
  );
}

export const ECs = [...Object.values(IEC), ...Object.values(SEC), ...Object.values(VEC)];

export type ECode = typeof ECs[number]

export function isECode(code: unknown): code is ECode {
  return (
    typeof code === "number" &&
    // @ts-expect-error
    ECs.includes(code)
  );
}

export type JsonZcredException<T extends ECode = ECode> = {
  code: T;
  message?: string;
}

export function isJsonZcredException(o: unknown): o is JsonZcredException {
  return (
    isObject(o) &&
    "code" in o && isECode(o.code) && (
      !("message" in o) ||
      ("message" in o && (
          typeof o.message === "undefined" ||
          typeof o.message === "string"
        )
      )
    )
  );
}

export type JsonIssuerException = JsonZcredException<IECode>;

export function isJsonIssuerException(o: unknown): o is JsonIssuerException {
  return (
    isJsonZcredException(o) && isIECode(o.code)
  );
}

export type JsonSubjectException = JsonZcredException<SECode>;

export function isJsonSubjectException(o: unknown): o is JsonSubjectException {
  return (
    isJsonZcredException(o) && isSECode(o.code)
  );
}

export type JsonVerifierException = JsonZcredException<VECode>;

export function isJsonVerifierException(o: unknown): o is JsonVerifierException {
  return (
    isJsonZcredException(o) && isVECode(o.code)
  );
}

export class ZcredException<T extends number = ECode> extends Error {
  constructor(
    public readonly code: T,
    msg?: string
  ) {super(msg);}
}

export function isZcredException(o: unknown): o is ZcredException {
  return o instanceof ZcredException;
}

export class IssuerException extends ZcredException<IECode> {}

export function isIssuerException(o: unknown): o is IssuerException {
  return o instanceof IssuerException;
}

export class SubjectException extends ZcredException<SECode> {}

export function isSubjectException(o: unknown): o is SubjectException {
  return o instanceof SubjectException;
}

export class VerifierException extends ZcredException<VECode> {}

export function isVerifierException(o: unknown): o is VerifierException {
  return o instanceof VerifierException;
}
