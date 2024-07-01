import { UserData } from "../cred-holder.js";

export * from "./browser-localstorage.js";

export interface CacheStore<T extends UserData = UserData> {
  set: (id: string, json: T) => Promise<boolean>;
  get: (id: string) => Promise<T | undefined>;
}