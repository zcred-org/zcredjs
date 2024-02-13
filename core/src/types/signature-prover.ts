import { Attributes, AttributesSchema, Identifier, SignatureProof } from "./credential.js";

export interface ISignatureProver {

  proofType: string;

  issuerId: Identifier

  signAttributes<
    TAttr extends Attributes = Attributes
  >(
    attributes: TAttr,
    schema: AttributesSchema
  ): Promise<SignatureProof>;
}