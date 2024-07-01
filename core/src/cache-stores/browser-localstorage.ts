import {  UserData } from "../cred-holder.js";
import { CacheStore } from "./index.js";

export function BrowserLocalstorage<T extends UserData = UserData>(): CacheStore<T> {
  return {
    set: async (id, value) => {
      try {
        window.localStorage.setItem(id, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    get: async (id) => {
      try {
        const value = window.localStorage.getItem(id);
        if (value && value !== "") {
          const result = JSON.parse(value) as T;
          window.localStorage.removeItem(id);
          return result;
        }
        return undefined;
      } catch (e) {
        return undefined;
      }
    }
  };
}