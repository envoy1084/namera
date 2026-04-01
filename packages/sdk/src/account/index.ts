import type { GetKernelVersion } from "@zerodev/sdk/types";
import type { Chain, EntryPointVersion, RpcSchema, Transport } from "viem";

import { createEcdsaAccountClient } from "./ecdsa";
import { createPasskeyAccountClient } from "./passkey";
import type {
  AccountClientMap,
  AccountType,
  CreateAccountClientParams,
} from "./types";

export const createAccountClient = async <
  TClientTransport extends Transport = Transport,
  TBundlerTransport extends Transport = Transport,
  TPaymasterTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TRpcSchema extends RpcSchema | undefined = undefined,
  TEntrypointVersion extends EntryPointVersion = EntryPointVersion,
  TKernelVersion extends
    GetKernelVersion<TEntrypointVersion> = GetKernelVersion<TEntrypointVersion>,
  TAccountType extends AccountType = AccountType,
>(
  params: CreateAccountClientParams<
    TClientTransport,
    TBundlerTransport,
    TPaymasterTransport,
    TChain,
    TRpcSchema,
    TEntrypointVersion,
    TKernelVersion,
    TAccountType
  >,
): Promise<
  AccountClientMap<TClientTransport, TChain, TRpcSchema>[TAccountType]
> => {
  if (params.type === "ecdsa") {
    return await createEcdsaAccountClient(
      params as CreateAccountClientParams<
        TClientTransport,
        TBundlerTransport,
        TPaymasterTransport,
        TChain,
        TRpcSchema,
        TEntrypointVersion,
        TKernelVersion,
        "ecdsa"
      >,
    );
  }

  if (params.type === "passkey") {
    return await createPasskeyAccountClient(
      params as CreateAccountClientParams<
        TClientTransport,
        TBundlerTransport,
        TPaymasterTransport,
        TChain,
        TRpcSchema,
        TEntrypointVersion,
        TKernelVersion,
        "passkey"
      >,
    );
  }
};

export * from "./ecdsa";
export * from "./passkey";
export * from "./types";
