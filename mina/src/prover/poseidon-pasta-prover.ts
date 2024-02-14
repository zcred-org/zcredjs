import { Attributes, AttributesSchema, ISignatureProver, SignatureProof, SignProofType, StrictId } from "@zcredjs/core";
import { O1TrGraph } from "o1js-trgraph";
import type { Field, PrivateKey, PublicKey } from "o1js";
import sortKeys from "sort-keys";

export class MinaPoseidonPastaProver implements ISignatureProver {

  private readonly trGraph: O1TrGraph;
  readonly publicKey: PublicKey;
  readonly privateKey: PrivateKey;

  constructor(
    private readonly o1js: typeof import("o1js"),
    privateKey: string
  ) {
    this.trGraph = new O1TrGraph(o1js);
    this.privateKey = o1js.PrivateKey.fromBase58(privateKey);
    this.publicKey = this.privateKey.toPublicKey();
  }

  get proofType(): SignProofType { return "mina:poseidon-pasta";}

  get issuerId(): StrictId {
    return {
      type: "mina:publickey",
      key: this.publicKey.toBase58()
    };
  }

  async signAttributes<
    TAttr extends Attributes = Attributes
  >(
    attributes: TAttr,
    schema: AttributesSchema
  ): Promise<SignatureProof> {
    const sortedSchema = sortKeys(schema, { deep: true });
    const { linear } = this.trGraph.objectTransform<{}, Field[]>(attributes, sortedSchema);
    const hash = this.o1js.Poseidon.hash(linear);
    const signature = this.o1js.Signature.create(this.privateKey, [hash]);
    return {
      type: this.proofType,
      issuer: {
        id: this.issuerId
      },
      signature: signature.toBase58(),
      schema: {
        attributes: sortedSchema,
        type: ["ascii-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"],
        signature: ["base58-mina:signature"],
        issuer: {
          id: {
            type: ["ascii-bytes", "bytes-uint", "mina:mod.order", "uint-mina:field"],
            key: ["base58-mina:publickey"]
          }
        }
      }
    };
  }
}