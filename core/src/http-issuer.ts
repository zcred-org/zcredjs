import {
  BrowserIssueParams,
  CanIssue,
  CanIssueReq,
  Challenge,
  ChallengeReq,
  IHttpIssuer,
  Info,
  isCanIssue,
  isChallenge,
  isInfo,
  IssueReq,
} from "./types/issuer.js";
import {
  HttpCredential,
  IEC,
  IECode,
  isHttpCredential,
  isJsonIssuerException,
  IssuerException
} from "./types/index.js";
import { repeatUtil } from "./utils/index.js";

export class PopupError extends Error {
  constructor(
    verifyURL: string
  ) {super(`Can not open popup window to issue credential, popup URL: ${verifyURL}`);}
}

export class HttpIssuer<
  TCred extends HttpCredential = HttpCredential
> implements IHttpIssuer<TCred> {
  readonly uri: URL;

  constructor(
    issuerURI: string,
    private readonly accessToken?: string
  ) {
    const uri = issuerURI.endsWith("/") ? issuerURI : issuerURI + "/";
    this.uri = new URL(uri);

    this.getInfo = this.getInfo.bind(this);
    this.getChallenge = this.getChallenge.bind(this);
    this.canIssue = this.canIssue.bind(this);
    this.issue = this.issue.bind(this);
    this.updateProofs = this.updateProofs?.bind(this);
    this.browserIssue = this.browserIssue?.bind(this);
    this.toJSON = this.toJSON.bind(this);
  }

  static init(endpoint: string, accessToken?: string): IHttpIssuer {
    return new HttpIssuer(endpoint, accessToken);
  }

  async getInfo(): Promise<Info> {
    const url = new URL("./info", this.uri);
    const resp = await fetch(url)
      .then((resp) => resp)
      .catch((e) => e as Error);
    if (resp instanceof Error) throw new IssuerException(
      IEC.NO_ISSUER,
      `Fetch "info" error. URL: ${url.href}, method: GET, message: ${resp.message}`
    );
    const body = await resp.text();
    if (resp.status === 200) {
      const json = this.toJSON(body, IEC.INFO_BAD_RESP);
      if (isInfo(json)) return json;
      throw new IssuerException(IEC.INFO_BAD_RESP, `Body "info" JSON does not match issuer info type`);
    }
    if ([400, 401].includes(resp.status)) {
      const json = this.toJSON(body, IEC.INFO_BAD_RESP);
      if (isJsonIssuerException(json)) {
        throw new IssuerException(json.code, json.message);
      }
      throw new IssuerException(IEC.INFO_BAD_RESP);
    }
    if (resp.status.toString().startsWith("5")) throw new IssuerException(
      IEC.ISSUER_ERROR,
      `Issuer "getInfo" error, url: ${url.href}, method: GET, http status: ${resp.status}, body: ${body}`
    );
    throw new IssuerException(
      IEC.INFO_BAD_RESP,
      `Info bad response, url: ${url.href}, method: GET, http status: ${resp.status}, body: ${body}`
    );
  }

  private toJSON(txt: string, code: IECode): Record<string, unknown> {
    try {
      return JSON.parse(txt);
    } catch (e) {
      throw new IssuerException(
        code,
        `Parse info to JSON exception, input: ${txt}`
      );
    }
  };

  async getChallenge(challengeReq: ChallengeReq): Promise<Challenge> {
    const url = new URL("./challenge", this.uri);
    const resp = await fetch(new URL("./challenge", this.uri), {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(challengeReq)
    }).then((resp) => resp)
      .catch((e) => e as Error);
    if (resp instanceof Error) throw new IssuerException(
      IEC.NO_ISSUER,
      `Fetch "challenge" error. URL: ${url.href}, method: POST, message: ${resp.message}`
    );
    const body = await resp.text();
    if (resp.status === 200) {
      const json = this.toJSON(body, IEC.CHALLENGE_BAD_RESP);
      if (isChallenge(json)) return json;
      throw new IssuerException(
        IEC.CHALLENGE_BAD_RESP,
        `Body "challenge" JSON does not match challenge type`
      );
    }
    if ([400, 401].includes(resp.status)) {
      const json = this.toJSON(body, IEC.CHALLENGE_BAD_RESP);
      if (isJsonIssuerException(json)) throw new IssuerException(json.code, json.message);
      throw new IssuerException(
        IEC.CHALLENGE_BAD_RESP,
        `Issuer "getChallenge" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
      );
    }
    if (resp.status.toString().startsWith("5")) throw new IssuerException(
      IEC.ISSUER_ERROR,
      `Issuer "getChallenge" error, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
    throw new IssuerException(
      IEC.CHALLENGE_BAD_RESP,
      `Issuer "getChallenge" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
  }

  async canIssue(canIssueReq: CanIssueReq): Promise<CanIssue> {
    const url = new URL("./can-issue", this.uri);
    const resp = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(canIssueReq)
    }).then((resp) => resp)
      .catch((e) => e as Error);
    if (resp instanceof Error) throw new IssuerException(
      IEC.NO_ISSUER,
      `Fetch "canIssue" error. URL: ${url.href}, method: POST, message: ${resp.message}`
    );
    const body = await resp.text();
    if (resp.status === 200) {
      const json = this.toJSON(body, IEC.CAN_ISSUE_BAD_RESP);
      if (isCanIssue(json)) return json;
      throw new IssuerException(
        IEC.CAN_ISSUE_BAD_RESP,
        `Body "canIssue" JSON does not match can issue type`
      );
    }
    if ([400, 401].includes(resp.status)) {
      const json = this.toJSON(body, IEC.CAN_ISSUE_BAD_RESP);
      if (isJsonIssuerException(json)) throw new IssuerException(json.code, json.message);
      throw new IssuerException(
        IEC.CAN_ISSUE_BAD_RESP,
        `Issuer "canIssue" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
      );
    }
    if (resp.status.toString().startsWith("5")) throw new IssuerException(
      IEC.ISSUER_ERROR,
      `Issuer "canIssue" error, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
    throw new IssuerException(
      IEC.CAN_ISSUE_BAD_RESP,
      `Issuer "canIssue" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
  }

  async issue(issueReq: IssueReq): Promise<TCred> {
    const url = new URL("./issue", this.uri);
    const resp = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(issueReq)
    }).then((resp) => resp)
      .catch((e) => e as Error);
    if (resp instanceof Error) throw new IssuerException(
      IEC.NO_ISSUER,
      `Fetch "issue" error. URL: ${url.href}, method: POST, message: ${resp.message}`
    );
    const body = await resp.text();
    if (resp.status === 200) {
      const json = this.toJSON(body, IEC.ISSUE_BAD_RESP);
      if (isHttpCredential(json)) return json as TCred;
      throw new IssuerException(IEC.ISSUE_BAD_RESP, `Body "issue" JSON does not match can issue type`);
    }
    if ([400, 401].includes(resp.status)) {
      const json = this.toJSON(body, IEC.ISSUE_BAD_RESP);
      if (isJsonIssuerException(json)) throw new IssuerException(json.code, json.message);
      throw new IssuerException(
        IEC.ISSUE_BAD_RESP,
        `Issuer "issue" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
      );
    }
    if (resp.status.toString().startsWith("5")) throw new IssuerException(
      IEC.ISSUER_ERROR,
      `Issuer "issue" error, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
    throw new IssuerException(
      IEC.ISSUE_BAD_RESP,
      `Issuer "issue" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
  }

  async updateProofs?(cred: TCred): Promise<TCred> {
    const url = new URL("./update-proofs", this.uri);
    const resp = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(cred)
    }).then((reps) => reps)
      .catch((e) => e as Error);
    if (resp instanceof Error) throw new IssuerException(
      IEC.NO_ISSUER,
      `Fetch "updateProofs" error. URL: ${url.href}, method: POST, message: ${resp.message}`
    );
    const body = await resp.text();
    if (resp.status === 200) {
      const json = this.toJSON(body, IEC.UPDATE_PROOFS_BAD_RESP);
      if (isHttpCredential(json)) return json as TCred;
      throw new IssuerException(IEC.UPDATE_PROOFS_BAD_RESP,);
    }
    if ([400, 401].includes(resp.status)) {
      const json = this.toJSON(body, IEC.UPDATE_PROOFS_BAD_RESP);
      if (isJsonIssuerException(json)) throw new IssuerException(json.code, json.message);
      throw new IssuerException(
        IEC.UPDATE_PROOFS_BAD_RESP,
        `Issuer "updateProofs" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
      );
    }
    if (resp.status.toString().startsWith("5")) throw new IssuerException(
      IEC.ISSUER_ERROR,
      `Issuer "updateProofs" error, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
    throw new IssuerException(
      IEC.UPDATE_PROOFS_BAD_RESP,
      `Issuer "updateProofs" exception, url: ${url.href}, method: POST, http status: ${resp.status}, body: ${body}`
    );
  }

  async browserIssue?({
    challengeReq,
    sign,
    windowOptions,
  }: BrowserIssueParams): Promise<TCred> {
    const challenge = await this.getChallenge(challengeReq);
    if (challenge.verifyURL) {
      const popup = window.open(
        challenge.verifyURL,
        windowOptions?.target,
        windowOptions?.feature
      );
      if (!popup) throw new PopupError(challenge.verifyURL);
    }
    const result = await repeatUtil<boolean>(
      (r) => (r instanceof Error) ? true : r,
      1000,
      async () => {
        return (await this.canIssue({ sessionId: challenge.sessionId })).canIssue;
      }
    );
    if (result instanceof Error) throw result;
    const signature = await sign({ message: challenge.message });
    return this.issue({
      sessionId: challenge.sessionId,
      signature: signature
    });
  }


  private get headers(): HeadersInit {
    if (this.accessToken) return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`
    };
    return { "Content-Type": "application/json" };
  }
}