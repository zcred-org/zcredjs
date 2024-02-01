import { Identifier, IWalletAdapter } from "@zcredjs/core";
import * as u8a from "uint8arrays";

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface IEIP1193Provider {
  enable?: () => Promise<void>;
  request<T = unknown>(args: RequestArguments): Promise<T>;
}

export class EIP1193Adapter implements IWalletAdapter {
  constructor(private readonly provider: IEIP1193Provider) {
    this.getSubjectId = this.getSubjectId.bind(this);
    this.getAddress = this.getAddress.bind(this);
    this.getChainId = this.getChainId.bind(this);
    this.sign = this.sign.bind(this);
  }

  /** ZCIP-2 Identifier */
  async getSubjectId(): Promise<Identifier> {
    const address = await this.getAddress();
    return {
      type: "ethereum:address",
      key: address
    };
  };

  /** Blockchain address*/
  async getAddress(): Promise<string> {
    const accounts = await this.getAccounts();
    if (accounts?.[0]) return accounts[0];
    const requestedAccounts = await this.requestAccounts();
    if (requestedAccounts?.[0]) return requestedAccounts[0];
    throw new Error(`Enable Ethereum provider`);
  };

  /** CAIP-2 chain identifier */
  async getChainId(): Promise<string> {
    const reference = await this.provider.request<string>({
      method: "net_version"
    });
    return `eip155:${reference}`;
  };

  /** Sign function */
  async sign(args: { message: string }) {
    const message = args.message;
    const address = await this.getAddress();
    const hexMessage = u8a.toString(u8a.fromString(message), "hex");
    return this.signMessage(address, hexMessage);
  };

  private async signMessage(address: string, hexMessage: string): Promise<string> {
    try {
      return await this.provider.request<`0x${string}`>({
        method: "eth_sign",
        params: [address, hexMessage]
      });
    } catch (e) {
      const reason = e as Error;
      if ("code" in reason && (reason.code === -32602 || reason.code === -32601)) {
        return await this.provider.request<`0x${string}`>({
          method: "personal_sign",
          params: [address, hexMessage],
        });
      }
      throw reason;
    }
  }

  private async requestAccounts(): Promise<string[]> {
    return await this.provider.request<string[]>({
      method: "eth_requestAccounts",
    });
  }

  private async getAccounts(): Promise<string[]> {
    return await this.provider.request<string[]>({
      method: "eth_accounts",
    });
  }
}