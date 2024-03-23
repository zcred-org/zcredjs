import { suite } from "uvu";
import * as a from "uvu/assert";
import {
  Attributes,
  Identifier,
  isAttributes,
  isHttpCredential,
  isIdentifier,
  isIdentifierSchema,
  isSignatureProof,
  isStrictAttributes,
  isStrictId, isStrictSignatureProof,
  isZkCredential,
  SignatureProof,
  StrictAttributes,
  StrictId, StrictSignatureProof
} from "../../src/index.js";

const test = suite("Credential types tests");

test("identifier type", () => {
  a.ok(isIdentifier({
    type: "mina:publickey",
    key: "bsas..bass"
  } satisfies Identifier), "Invalid identifier");
  a.not.ok(isIdentifier({
    type: "ethereum:address",
  }), "Valid identifier, key is undefined");
  a.not.ok(isIdentifier({
    key: "asdef...asdf"
  }), "Valid identifier, type is undefined");
});

test("identifier schema type", () => {
  a.ok(isIdentifierSchema({
    type: ["123", "213"],
    key: ["123", "123"]
  }), "1");
  a.not.ok(isIdentifierSchema({
    type: ["123", "123"]
  }), "2");
  a.not.ok(isIdentifierSchema({
    key: ["123", "123"]
  }), "3");
  a.not.ok(isIdentifierSchema({
    type: ["123"],
    key: ["123", 123, "123"]
  }), "4");
  a.not.ok(isIdentifierSchema({
    type: ["123", 123, "123"],
    key: ["123"]
  }), "5");
});

test("signature proof type", () => {
  a.ok(isSignatureProof({
    type: "mina:poseidon-pasta",
    issuer: {
      id: {
        type: "mina:publickey",
        key: "zxcv...zxcv"
      }
    },
    signature: "zxcvzxcvzxcv",
    schema: {
      type: ["123123"],
      issuer: {
        id: {
          type: ["123", "123"],
          key: ["123", "123123"]
        }
      },
      signature: ["123123", "543354"],
      attributes: {}
    }
  } satisfies SignatureProof), "1");
  a.not.ok(isSignatureProof({
    issuer: {
      id: {
        type: "mina:publickey",
        key: "zxcv...zxcv"
      }
    },
    signature: "zxcvzxcvzxcv",
    schema: {
      type: ["123123"],
      issuer: {
        id: {
          type: ["123", "123"],
          key: ["123", "123123"]
        }
      },
      signature: ["123123", "543354"],
      attributes: {}
    }
  }), "2");
});

test("attributes type", () => {
  a.ok(isAttributes({
    type: "credential type",
    issuanceDate: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUntil: new Date().toISOString(),
    subject: {
      id: {
        type: "ethereum:address",
        key: "0x123123...123123"
      }
    }
  } satisfies Attributes), "1");
  a.not.ok(isAttributes({
    type: "credential type",
    issuanceDate: "",
    validFrom: new Date().toISOString(),
    validUntil: new Date().toISOString(),
    subject: {
      id: {
        type: "ethereum:address",
        key: "0x123123...123123"
      }
    }
  } satisfies Attributes), "2");
});

test("zk-credential type", () => {
  a.ok(isZkCredential({
    "attributes": {
      "type": "passport",
      "issuanceDate": "2024-02-26T14:13:12.174Z",
      "validFrom": "2015-01-01T00:00:00.000Z",
      "validUntil": "2029-12-30T21:00:00.000Z",
      "subject": {
        "id": {
          "type": "mina:publickey",
          "key": "B62qqXhJ8qgXdApGoAvZHeXrHEg6YGqmThFcRN8xKqAvJsqjmUMVaZE"
        },
        "firstName": "John",
        "lastName": "Smith",
        "birthDate": "1995-01-01T00:00:00.000Z",
        "gender": "male"
      },
      "countryCode": "GBR",
      "document": {
        "id": "test-passport:123456",
        "sybilId": "zqvg9dLUQLpTPCXanojTPRhaFhZ"
      }
    },
    "proofs": {
      "mina:poseidon-pasta": {
        "mina:publickey:B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2": {
          "type": "mina:poseidon-pasta",
          "issuer": {
            "id": {
              "type": "mina:publickey",
              "key": "B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2"
            }
          },
          "signature":
            "7mWycnUuKucN4dt6AaJs4ssQpDLYYY1AnuZjHZkuVhPwyK8rS36wwvThP8DpvtpFoAwBFEGPyheKKN7gSW3veyZexL5h3S1p",
          "schema": {
            "attributes": {
              "countryCode": ["iso3166alpha3-iso3166numeric", "iso3166numeric-uint16", "uint16-mina:field"],
              "document": {
                "id": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "sybilId": ["base58-bytes",
                  "bytes-uint", "mina:mod.order", "uint-mina:field"]
              },
              "issuanceDate": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"],
              "subject": {
                "birthDate": ["isodate-unixtime19", "unixtime19-uint64", "uint64-mina:field"],
                "firstName": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"],
                "gender": ["ascii-bytes",
                  "bytes-uint64", "uint64-mina:field"],
                "id": {
                  "key": ["base58-mina:publickey", "mina:publickey-mina:fields"],
                  "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"]
                },
                "lastName": ["utf8-bytes", "bytes-uint",
                  "mina:mod.order", "uint-mina:field"]
              },
              "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"],
              "validFrom":
                ["isodate-unixtime", "unixtime-uint64", "uint64-mina:field"],
              "validUntil": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"]
            }, "type": ["ascii-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "signature":
              ["base58-mina:signature"], "issuer": {
              "id": {
                "type": ["ascii-bytes", "bytes-uint", "mina:mod.order",
                  "uint-mina:field"], "key": ["base58-mina:publickey"]
              }
            }
          }
        }
      }
    }
  }), "1");
  a.not.ok(isZkCredential({
    "attributes": {
      "type": "passport",
      "issuanceDate": "2024-02-26T14:13:12.174Z",
      "validFrom": "2015-01-01T00:00:00.000Z",
      "validUntil": "2029-12-30T21:00:00.000Z",
      "subject": {
        "id": {
          "type": "mina:publickey",
          "key": "B62qqXhJ8qgXdApGoAvZHeXrHEg6YGqmThFcRN8xKqAvJsqjmUMVaZE"
        },
        "firstName": "John",
        "lastName": "Smith",
        "birthDate": "1995-01-01T00:00:00.000Z",
        "gender": "male"
      },
      "countryCode": "GBR",
      "document": {
        "id": "test-passport:123456",
        "sybilId": "zqvg9dLUQLpTPCXanojTPRhaFhZ"
      }
    },
    "proofs": {
      "mina:poseidon-pasta": {
        "mina:publickey:B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2": {
          // "type": "mina:poseidon-pasta",
          "issuer": {
            "id": {
              "type": "mina:publickey",
              "key": "B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2"
            }
          },
          "signature":
            "7mWycnUuKucN4dt6AaJs4ssQpDLYYY1AnuZjHZkuVhPwyK8rS36wwvThP8DpvtpFoAwBFEGPyheKKN7gSW3veyZexL5h3S1p",
          "schema": {
            "attributes": {
              "countryCode": ["iso3166alpha3-iso3166numeric", "iso3166numeric-uint16", "uint16-mina:field"],
              "document": {
                "id": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "sybilId": ["base58-bytes",
                  "bytes-uint", "mina:mod.order", "uint-mina:field"]
              },
              "issuanceDate": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"],
              "subject": {
                "birthDate": ["isodate-unixtime19", "unixtime19-uint64", "uint64-mina:field"],
                "firstName": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"],
                "gender": ["ascii-bytes",
                  "bytes-uint64", "uint64-mina:field"],
                "id": {
                  "key": ["base58-mina:publickey", "mina:publickey-mina:fields"],
                  "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"]
                },
                "lastName": ["utf8-bytes", "bytes-uint",
                  "mina:mod.order", "uint-mina:field"]
              },
              "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"],
              "validFrom":
                ["isodate-unixtime", "unixtime-uint64", "uint64-mina:field"],
              "validUntil": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"]
            }, "type": ["ascii-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "signature":
              ["base58-mina:signature"], "issuer": {
              "id": {
                "type": ["ascii-bytes", "bytes-uint", "mina:mod.order",
                  "uint-mina:field"], "key": ["base58-mina:publickey"]
              }
            }
          }
        }
      }
    }
  }), "2");
});

test("http credential type", () => {
  a.ok(isHttpCredential({
    meta: {
      issuer: {
        type: "http",
        uri: "https://api.dev.sybil.center/api/v1/zcred/issuers/passport"
      },
      definitions: {
        attributes: {
          type: "document type (passport)",
          validFrom: "passport valid from date",
          issuanceDate: "passport issuance date",
          validUntil: "passport valid until",
          subject: {
            id: {
              type: "passport owner public key type",
              key: "passport owner public key"
            },
            firstName: "passport owner first name",
            lastName: "passport owner last name",
            birthDate: "passport owner birth date",
            gender: "passport owner gender"
          },
          countryCode: "passport country code",
          document: {
            id: "passport id (should be private)",
            sybilId: "document unique public id"
          }
        }
      }
    },
    attributes: {
      type: "passport",
      issuanceDate: "2024-02-26T14:13:12.174Z",
      validFrom: "2015-01-01T00:00:00.000Z",
      validUntil: "2029-12-30T21:00:00.000Z",
      subject: {
        id: {
          type: "mina:publickey",
          key: "B62qqXhJ8qgXdApGoAvZHeXrHEg6YGqmThFcRN8xKqAvJsqjmUMVaZE"
        },
        firstName: "John",
        lastName: "Smith",
        birthDate: "1995-01-01T00:00:00.000Z",
        gender: "male"
      },
      countryCode: "GBR",
      document: {
        id: "test-passport:123456",
        sybilId: "zqvg9dLUQLpTPCXanojTPRhaFhZ"
      }
    },
    proofs: {
      "mina:poseidon-pasta": {
        "mina:publickey:B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2": {
          "type": "mina:poseidon-pasta",
          "issuer": {
            "id": {
              "type": "mina:publickey",
              "key": "B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2"
            }
          },
          "signature":
            "7mWycnUuKucN4dt6AaJs4ssQpDLYYY1AnuZjHZkuVhPwyK8rS36wwvThP8DpvtpFoAwBFEGPyheKKN7gSW3veyZexL5h3S1p",
          "schema": {
            "attributes": {
              "countryCode": ["iso3166alpha3-iso3166numeric", "iso3166numeric-uint16", "uint16-mina:field"],
              "document": {
                "id": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "sybilId": ["base58-bytes",
                  "bytes-uint", "mina:mod.order", "uint-mina:field"]
              },
              "issuanceDate": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"],
              "subject": {
                "birthDate": ["isodate-unixtime19", "unixtime19-uint64", "uint64-mina:field"],
                "firstName": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"],
                "gender": ["ascii-bytes",
                  "bytes-uint64", "uint64-mina:field"],
                "id": {
                  "key": ["base58-mina:publickey", "mina:publickey-mina:fields"],
                  "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"]
                },
                "lastName": ["utf8-bytes", "bytes-uint",
                  "mina:mod.order", "uint-mina:field"]
              },
              "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"],
              "validFrom":
                ["isodate-unixtime", "unixtime-uint64", "uint64-mina:field"],
              "validUntil": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"]
            }, "type": ["ascii-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "signature":
              ["base58-mina:signature"], "issuer": {
              "id": {
                "type": ["ascii-bytes", "bytes-uint", "mina:mod.order",
                  "uint-mina:field"], "key": ["base58-mina:publickey"]
              }
            }
          }
        }
      }
    }, "protection": {
      "jws":
        "123123"
    }
  }), "1");
  a.not.ok(isHttpCredential({
    meta: {
      issuer: {
        // type: "http",
        uri: "https://api.dev.sybil.center/api/v1/zcred/issuers/passport"
      },
      definitions: {
        attributes: {
          type: "document type (passport)",
          validFrom: "passport valid from date",
          issuanceDate: "passport issuance date",
          validUntil: "passport valid until",
          subject: {
            id: {
              type: "passport owner public key type",
              key: "passport owner public key"
            },
            firstName: "passport owner first name",
            lastName: "passport owner last name",
            birthDate: "passport owner birth date",
            gender: "passport owner gender"
          },
          countryCode: "passport country code",
          document: {
            id: "passport id (should be private)",
            sybilId: "document unique public id"
          }
        }
      }
    },
    attributes: {
      type: "passport",
      issuanceDate: "2024-02-26T14:13:12.174Z",
      validFrom: "2015-01-01T00:00:00.000Z",
      validUntil: "2029-12-30T21:00:00.000Z",
      subject: {
        id: {
          type: "mina:publickey",
          key: "B62qqXhJ8qgXdApGoAvZHeXrHEg6YGqmThFcRN8xKqAvJsqjmUMVaZE"
        },
        firstName: "John",
        lastName: "Smith",
        birthDate: "1995-01-01T00:00:00.000Z",
        gender: "male"
      },
      countryCode: "GBR",
      document: {
        id: "test-passport:123456",
        sybilId: "zqvg9dLUQLpTPCXanojTPRhaFhZ"
      }
    },
    proofs: {
      "mina:poseidon-pasta": {
        "mina:publickey:B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2": {
          "type": "mina:poseidon-pasta",
          "issuer": {
            "id": {
              "type": "mina:publickey",
              "key": "B62qmNen3kDN74CJ2NQteNABrEN4AurGTbsLrraPy6ipQgUV9Q73tv2"
            }
          },
          "signature":
            "7mWycnUuKucN4dt6AaJs4ssQpDLYYY1AnuZjHZkuVhPwyK8rS36wwvThP8DpvtpFoAwBFEGPyheKKN7gSW3veyZexL5h3S1p",
          "schema": {
            "attributes": {
              "countryCode": ["iso3166alpha3-iso3166numeric", "iso3166numeric-uint16", "uint16-mina:field"],
              "document": {
                "id": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "sybilId": ["base58-bytes",
                  "bytes-uint", "mina:mod.order", "uint-mina:field"]
              },
              "issuanceDate": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"],
              "subject": {
                "birthDate": ["isodate-unixtime19", "unixtime19-uint64", "uint64-mina:field"],
                "firstName": ["utf8-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"],
                "gender": ["ascii-bytes",
                  "bytes-uint64", "uint64-mina:field"],
                "id": {
                  "key": ["base58-mina:publickey", "mina:publickey-mina:fields"],
                  "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"]
                },
                "lastName": ["utf8-bytes", "bytes-uint",
                  "mina:mod.order", "uint-mina:field"]
              },
              "type": ["ascii-bytes", "bytes-uint128", "uint128-mina:field"],
              "validFrom":
                ["isodate-unixtime", "unixtime-uint64", "uint64-mina:field"],
              "validUntil": ["isodate-unixtime", "unixtime-uint64",
                "uint64-mina:field"]
            }, "type": ["ascii-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"], "signature":
              ["base58-mina:signature"], "issuer": {
              "id": {
                "type": ["ascii-bytes", "bytes-uint", "mina:mod.order",
                  "uint-mina:field"], "key": ["base58-mina:publickey"]
              }
            }
          }
        }
      }
    }, "protection": {
      "jws":
        "123123"
    }
  }), "2");
});

test("strict id", () => {
  a.ok(isStrictId({
    type: "ethereum:address",
    key: "0x123"
  } satisfies StrictId), "1");
  a.ok(isStrictId({
    type: "mina:publickey",
    key: "zxcvzxcv"
  } satisfies StrictId), "2");
  a.not.ok(isStrictId({
    type: "some:type",
    key: "123123"
  }), "3");
  a.not.ok(isStrictId({}), "3");
  a.not.ok(isStrictId({ type: "mina:publickey" }), "4");
  a.not.ok(isStrictId({ key: "123" }), "5");
});

test("strict attributes", () => {
  a.ok(isStrictAttributes({
    type: "passport",
    validUntil: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    issuanceDate: new Date().toISOString(),
    subject: {
      id: {
        type: "mina:publickey",
        key: "zxcv...zxcv"
      }
    }
  } satisfies StrictAttributes), "1");

  a.not.ok(isStrictAttributes({
    type: "passport",
    validUntil: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    issuanceDate: new Date().toISOString(),
    subject: {
      id: {
        type: "some:publickey",
        key: "zxcv...zxcv"
      }
    }
  }), "2");
  a.not.ok(isStrictAttributes({
    type: "passport",
    validUntil: "new Date().toISOString()",
    validFrom: new Date().toISOString(),
    issuanceDate: new Date().toISOString(),
    subject: {
      id: {
        type: "ethereum:address",
        key: "zxcv...zxcv"
      }
    }
  }), "3")
});

test("strict signature proof type", () => {
  a.ok(isStrictSignatureProof({
    type: "mina:poseidon-pasta",
    issuer: {
      id: {
        type: "mina:publickey",
        key: "zxcv...zxcv"
      }
    },
    signature: "zxcvzxcvzxcv",
    schema: {
      type: ["123123"],
      issuer: {
        id: {
          type: ["123", "123"],
          key: ["123", "123123"]
        }
      },
      signature: ["123123", "543354"],
      attributes: {}
    }
  } satisfies StrictSignatureProof), "1");

  a.not.ok(isStrictSignatureProof({
    type: "123",
    issuer: {
      id: {
        type: "mina:publickey",
        key: "zxcv...zxcv"
      }
    },
    signature: "zxcvzxcvzxcv",
    schema: {
      type: ["123123"],
      issuer: {
        id: {
          type: ["123", "123"],
          key: ["123", "123123"]
        }
      },
      signature: ["123123", "543354"],
      attributes: {}
    }
  }), "2");
  a.not.ok(isStrictSignatureProof({
    type: "mina:poseidon-pasta",
    issuer: {
      id: {
        type: "some:publickey",
        key: "zxcv...zxcv"
      }
    },
    signature: "zxcvzxcvzxcv",
    schema: {
      type: ["123123"],
      issuer: {
        id: {
          type: ["123", "123"],
          key: ["123", "123123"]
        }
      },
      signature: ["123123", "543354"],
      attributes: {}
    }
  }), "2");
})


test.run();