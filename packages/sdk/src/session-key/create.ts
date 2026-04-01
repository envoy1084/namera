/** biome-ignore-all lint/suspicious/noExplicitAny: safe */
import type { EntryPointVersion } from "viem";

import type { AccountType } from "@/account";
import type { GetKernelVersion } from "@/types";

import { createEcdsaSessionKey } from "./ecdsa";
import { createPasskeySessionKey } from "./passkey";
import type {
  CreateSessionKeyParams,
  CreateSessionKeyResult,
  SessionKeyType,
} from "./types";

export const createSessionKey = async <
  TEntrypointVersion extends EntryPointVersion = EntryPointVersion,
  TKernelVersion extends
    GetKernelVersion<TEntrypointVersion> = GetKernelVersion<TEntrypointVersion>,
  TSessionKeyType extends SessionKeyType = SessionKeyType,
  TAccountType extends AccountType = AccountType,
>(
  params: CreateSessionKeyParams<
    TEntrypointVersion,
    TKernelVersion,
    TSessionKeyType,
    TAccountType
  >,
): Promise<CreateSessionKeyResult> => {
  if (params.type === "ecdsa") {
    return await createEcdsaSessionKey(params as any);
  }

  if (params.type === "passkey") {
    return await createPasskeySessionKey(params as any);
  }

  throw new Error(`Unsupported session key type: ${params.type}`);
};
