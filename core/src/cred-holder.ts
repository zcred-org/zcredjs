import uuid from "uuid-random";

type Json = { [key: string]: boolean | string | number | null | undefined | Json }

export type InitCredHolder = {
  credentialHolderURL: URL;
  userDataHolderURL: URL;
}

export type UserData = {
  subject: {
    id: {
      key: string;
      type: string;
    }
  },
  redirectURL?: string;
  clientSession?: string;
} & Json

export class CredHolder<T extends UserData = UserData> {

  constructor(private readonly context: InitCredHolder) {
    this.startVerification = this.startVerification.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  async startVerification(input: {
    proposalURL: URL;
    data: T
  }): Promise<{ openURL: URL, clientSession: string }> {
    const clientSession = `${uuid()}-${new Date().getTime()}`;
    input.data["clientSession"] = clientSession;
    const { secretId } = await this.saveData(input.data);
    const openURL = new URL(this.context.credentialHolderURL.href);
    openURL.searchParams.set("proposalURL", input.proposalURL.href);
    openURL.searchParams.set("sdid", secretId);
    return {
      clientSession,
      openURL
    };
  }

  private async saveData(data: Json): Promise<{ secretId: string }> {
    const response = await fetch(this.context.userDataHolderURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(
      `Data holder bad save response. Status code: ${response.status}, body: ${await response.text()}`
    );
    const body = await response.json();
    if (!isSaveDataHolderBody(body)) throw new Error(
      `Data holder save response body is not correct`
    );
    return { secretId: body.id };
  }
}

function isSaveDataHolderBody(o: unknown): o is { id: string } {
  return (
    typeof o === "object" && o !== null &&
    "id" in o && typeof o.id === "string"
  );
}
