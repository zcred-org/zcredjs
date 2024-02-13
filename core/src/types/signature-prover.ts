import { Attributes, AttributesSchema, SignatureProof } from "./credential.js";

export interface ISignatureProver {

  proofType: string;

  prove<
    TAttr extends Attributes = Attributes
  >(
    attributes: TAttr,
    schema: AttributesSchema
  ): Promise<SignatureProof>;
}