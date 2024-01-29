import { ZkCredential } from "./credential.js";

export interface ICredentialVerifier {
  /** proof type which verifier provides */
  proofType: string;

  /**
   * Verify zk-credential
   * @param cred zk-credential
   * @param reference proof reference string
   */
  verify<
    TCred extends ZkCredential = ZkCredential
  >(cred: TCred, reference?: string): Promise<boolean>;
}