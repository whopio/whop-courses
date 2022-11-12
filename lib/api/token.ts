import { defaults, seal, SealOptions, unseal } from "iron-webcrypto";

// const crypto = new Crypto();

if (!global.crypto) {
  const { Crypto } = require("@peculiar/webcrypto");
  global.crypto = new Crypto();
}

export const SECURE_SESSION_DURATION = 60 * 60 * 24 * 180; // 180 days
export const TEMP_SESSION_DURATION = 60 * 10; // 10 minutes

const ironOptions: SealOptions = {
  ...defaults,
};

export async function sealData(data: any, ttl: number) {
  const ironPassword = process.env.IRON_SECRET || "unsafe_secret";
  const sealed = await seal(crypto, data, ironPassword, {
    ...ironOptions,
    ttl: ttl * 1000,
  });
  return sealed;
}

export async function unsealData<T>(str: string) {
  const ironPassword = process.env.IRON_SECRET || "unsafe_secret";
  const unsealed = await unseal(crypto, str, ironPassword, ironOptions);
  return unsealed as T;
}
