import { toMultiChainECDSAValidator } from "@zerodev/multi-chain-ecdsa-validator";
import { createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { getEntryPoint } from "@zerodev/sdk/constants";
import type { GetKernelVersion } from "@zerodev/sdk/types";
import type { Chain, EntryPointVersion, RpcSchema, Transport } from "viem";
import type {
  GetPaymasterDataParameters,
  GetPaymasterStubDataParameters,
} from "viem/account-abstraction";

import type { AccountClientMap, CreateAccountClientParams } from "../types";

export const createEcdsaAccountClient = async <
  TClientTransport extends Transport,
  TBundlerTransport extends Transport,
  TPaymasterTransport extends Transport,
  TChain extends Chain,
  TRpcSchema extends RpcSchema | undefined,
  TEntrypointVersion extends EntryPointVersion,
  TKernelVersion extends GetKernelVersion<TEntrypointVersion>,
>(
  params: CreateAccountClientParams<
    TClientTransport,
    TBundlerTransport,
    TPaymasterTransport,
    TChain,
    TRpcSchema,
    TEntrypointVersion,
    TKernelVersion,
    "ecdsa"
  >,
): Promise<AccountClientMap<TClientTransport, TChain, TRpcSchema>["ecdsa"]> => {
  const {
    signer,
    client,
    chain,
    bundlerTransport,
    paymaster: Paymaster,
    index,
    kernelVersion,
    entrypointVersion,
  } = params;

  const entryPoint = getEntryPoint(entrypointVersion);

  const validator = await toMultiChainECDSAValidator(client, {
    entryPoint,
    kernelVersion: kernelVersion,
    signer,
  });

  const account = await createKernelAccount(client, {
    entryPoint,
    index,
    kernelVersion,
    plugins: {
      sudo: validator,
    },
  });

  const paymaster = Paymaster
    ? {
        getPaymasterData: (userOp: GetPaymasterDataParameters) => {
          return Paymaster.getPaymasterData(userOp);
        },
        getPaymasterStubData: (userOp: GetPaymasterStubDataParameters) => {
          return Paymaster.getPaymasterStubData(userOp);
        },
      }
    : undefined;

  const kernelClient = createKernelAccountClient({
    account,
    bundlerTransport,
    chain,
    client,
    name: "Namera Account Client",
    paymaster,
  });

  return kernelClient;
};
