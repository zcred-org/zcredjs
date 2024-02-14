import { record, withVersionNumber } from "./bindings/lib/binable.js";
import { base58 } from "./lib/base58.js";
import { versionBytes } from "./bindings/crypto/constants.js";
import { Field } from "./provable/field-bigint.js";
import { Scalar, versionNumbers } from "./provable/curve-bigint.js";

type Signature = { r: Field; s: Scalar };
type SignatureJson = { field: string; scalar: string };

const BinableSignature = withVersionNumber(
  record({ r: Field, s: Scalar }, ['r', 's']),
  versionNumbers.signature
);
export const Signature = {
  ...BinableSignature,
  ...base58(BinableSignature, versionBytes.signature),
  toJSON({ r, s }: Signature): SignatureJson {
    return {
      field: Field.toJSON(r),
      scalar: Scalar.toJSON(s),
    };
  },
  fromJSON({ field, scalar }: SignatureJson) {
    let r = Field.fromJSON(field);
    let s = Scalar.fromJSON(scalar);
    return { r, s };
  },
  dummy() {
    return { r: Field(1), s: Scalar(1) };
  },
};