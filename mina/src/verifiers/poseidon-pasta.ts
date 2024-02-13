import { ICredentialProofVerifier, Proof, SignProofType, zcredjs, ZkCredential } from "@zcredjs/core";
import sortKeys from "sort-keys";
import { O1TrGraph } from "o1js-trgraph";
import type { Field } from "o1js";


export class MinaPoseidonPastaVerifier implements ICredentialProofVerifier {

  constructor(
    private readonly o1js: typeof import("o1js"),
    private readonly trGraph = new O1TrGraph(o1js)
  ) {}

  get proofType(): SignProofType { return "mina:poseidon-pasta";};

  async verify<
    TCred extends ZkCredential = ZkCredential
  >(cred: TCred, reference?: string): Promise<boolean> {
    try {
      const proof = this.getProof(cred, reference);
      if (!zcredjs.isSignatureProof(proof)) return false;
      const attributesSchema = sortKeys(proof.schema.attributes, { deep: true });
      const { linear } = this.trGraph.objectTransform<{}, Field[]>(
        cred.attributes,
        attributesSchema
      );
      const message = this.o1js.Poseidon.hash(linear);
      const issuerPublicKey = this.o1js.PublicKey.fromBase58(proof.issuer.id.key);
      const signature = this.o1js.Signature.fromBase58(proof.signature);
      return signature.verify(issuerPublicKey, [message]).toBoolean();
    } catch (e) {
      return false;
    }
  }

  private getProof(cred: ZkCredential, reference?: string): Proof {
    const namespace = cred.proofs[this.proofType];
    if (namespace) {
      const _reference = reference ? reference : Object.keys(namespace)[0];
      if (_reference && namespace[_reference]) return namespace[_reference]!;
    }
    throw new Error(`Can not find proof by proof type ${this.proofType} & reference ${reference}`);
  }
}