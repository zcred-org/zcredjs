import { suite } from "uvu";
import * as a from "uvu/assert";
import {
  Challenge,
  ChallengeReq,
  Info,
  isCanIssue,
  isCanIssueReq,
  isChallenge,
  isChallengeOptions,
  isChallengeReq,
  isInfo,
  isIssueReq,
  isStrictChallengeReq,
  StrictChallengeReq
} from "../../src/index.js";

const test = suite("Issuer types tests");

test("challenge options", () => {
  a.ok(isChallengeOptions({
    chainId: "eip155:1",
  }), "Is not challenge options (chainId)");
  a.ok(isChallengeOptions({}), "Is not challenge options (empty)");
  a.not.ok(isChallengeOptions(null), "Challenge options");
});

test("challenge request", () => {
  a.ok(isChallengeReq({
    subject: {
      id: {
        type: "ethereum:address",
        key: "0x123...123"
      }
    }
  }), "Invalid challenge req (subject id)");

  a.ok(isChallengeReq({
    subject: {
      id: {
        type: "ethereum:address",
        key: "0x123...123"
      }
    },
    validFrom: new Date().toISOString(),
    validUntil: new Date().toISOString(),
    options: {
      chainId: "eip155:1"
    }
  } satisfies ChallengeReq), "Invalid challenge req (subject id, validFrom, validUntil, options)");

  a.not.ok(isChallengeReq({
    subject: {
      id: {}
    }
  }), "Valid challenge req");
});

test("challenge", () => {
  a.ok(isChallenge({
    sessionId: "session-123123123",
    message: "message for signature",
    verifyURL: "https://example.com"
  } satisfies Challenge), "Invalid challenge req");
  a.ok(isChallenge({
    sessionId: "session-123123123",
    message: "message for signature"
  } satisfies Challenge), "Invalid challenge req");
  a.not.ok(isChallenge({
    sessionId: "session-123123123",
    message: "message for signature",
    verifyURL: "http"
  } satisfies Challenge), "Valid challenge req (invalid verifyURL)");
});

test("can issue req", () => {
  a.ok(isCanIssueReq({
    sessionId: "sessionId-123123123"
  }), "Invalid can issue req");
  a.not.ok(isCanIssueReq({}), "Valid can issue req");
});

test("can issue", () => {
  a.ok(isCanIssue({
    canIssue: true
  }), "Invalid can issue (true)");
  a.ok(isCanIssue({
    canIssue: false
  }), "Invalid can issue (false)");
  a.not.ok(isCanIssue({}), "Valid can issue");
});

test("issue req", () => {
  a.ok(isIssueReq({
    sessionId: "sessionid-123123123",
    signature: "signature"
  }), "invalid issue req");
  a.not.ok(isIssueReq({
    sessionId: "sessionId123123123"
  }), "Valid issue req (no signature)");
  a.not.ok(isIssueReq({
    signature: "asdfasdf"
  }), "Valid issue req (no session id)");
});

test("info", () => {
  a.ok(isInfo({
    protection: {
      jws: {
        kid: "jws-kid"
      }
    },
    issuer: {
      type: "http",
      uri: "https://issuer.com/"
    },
    credential: {
      type: "passport",
      attributesPolicy: {
        validUntil: "custom",
        validFrom: "strict"
      }
    },
    definitions: {
      attributes: {}
    },
    proofs: {
      updatable: false,
      updatedAt: new Date(2024, 0, 1, 0, 0, 0).toISOString(),
      types: {
        "mina:poseidon-pasta": ["mina:publickey:basdbasdf"]
      }
    }
  } satisfies Info), "Invalid issuer info");
  a.not.ok(isInfo({
    protection: {
      jws: {
        kid: "jws-kid"
      }
    },
    issuer: {
      type: "http",
      uri: "https://issuer.com/"
    },
    credential: {
      type: "passport",
      attributesPolicy: {
        validUntil: "invalid",
        validFrom: "strict"
      }
    },
    definitions: {
      attributes: {}
    },
    proofs: {
      updatable: false,
      updatedAt: new Date(2024, 0, 1, 0, 0, 0).toISOString(),
      types: {
        "mina:poseidon-pasta": ["mina:publickey:basdbasdf"]
      }
    }
  }), "Valid issuer info (credential.attributesPolicy.validUntil)");
  a.not.ok(isInfo({
    protection: {
      jws: {
        kid: "jws-kid"
      }
    },
    issuer: {
      type: "http",
      uri: "https://issuer.com/"
    },
    credential: {
      type: "passport",
      attributesPolicy: {
        validUntil: "custom",
        validFrom: "invalid"
      }
    },
    definitions: {
      attributes: {}
    },
    proofs: {
      updatable: false,
      updatedAt: new Date(2024, 0, 1, 0, 0, 0).toISOString(),
      types: {
        "mina:poseidon-pasta": ["mina:publickey:basdbasdf"]
      }
    }
  }), "Valid issuer info (credential.attributesPolicy.validFrom)");
  a.not.ok(isInfo({
    protection: {
      jws: {
        kid: "jws-kid"
      }
    },
    issuer: {
      type: "http",
      uri: "asdf"
    },
    credential: {
      type: "passport",
      attributesPolicy: {
        validUntil: "custom",
        validFrom: "strict"
      }
    },
    definitions: {
      attributes: {}
    },
    proofs: {
      updatable: false,
      updatedAt: new Date(2024, 0, 1, 0, 0, 0).toISOString(),
      types: {
        "mina:poseidon-pasta": ["mina:publickey:basdbasdf"]
      }
    }
  } satisfies Info), "Valid issuer info (issuer uri)");
});

test("strict challenge req", () => {
  a.ok({
    subject: {
      id: {
        type: "ethereum:address",
        key: "0x123...123"
      }
    }
  } satisfies StrictChallengeReq, "Invalid strict challenge req");
  a.ok(isStrictChallengeReq({
    subject: {
      id: {
        type: "mina:publickey",
        key: "5342...5342"
      }
    }
  } satisfies StrictChallengeReq), "Invalid strict challenge req");
  a.ok({
    subject: {
      id: {
        type: "as:address",
        key: "0x123...123"
      }
    }
  }, "Valid strict challenge req");
});

test.run();