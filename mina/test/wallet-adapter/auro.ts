import { suite } from "uvu";
import * as a from "uvu/assert";
import { Field, PrivateKey, Scalar, Signature } from "o1js";
import { Signature as SignatureBigint } from "../../src/o1js/index.js";
import Client from "mina-signer";

const test = suite("Test signature");

test("test signature", async () => {
  const privateKey = PrivateKey.random();
  const signature = Signature.create(privateKey, [Field(1)]);
  const r = signature.r.toBigInt();
  const s = BigInt(signature.s.toJSON());
  const base58Signature = SignatureBigint.toBase58({ r, s });
  a.is(signature.toBase58(), base58Signature);
  const client = new Client({ network: "mainnet" });
  const {
    signature: {
      field,
      scalar
    }
  } = client.signMessage("hello", privateKey.toBase58());
  a.is(
    Signature.fromObject({
      r: Field.fromJSON(field),
      s: Scalar.fromJSON(scalar)
    }).toBase58(),
    SignatureBigint.toBase58({ r: BigInt(field), s: BigInt(scalar) })
  );

});

test.run();