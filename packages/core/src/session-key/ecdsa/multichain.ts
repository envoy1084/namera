import { toMultiChainECDSAValidator } from "@zerodev/multi-chain-ecdsa-validator";
import type { Policy } from "@zerodev/permissions";
import { addressToEmptyAccount, createKernelAccount } from "@zerodev/sdk";
import { getEntryPoint } from "@zerodev/sdk/constants";
import type {
  Address,
  Chain,
  Client,
  EntryPointVersion,
  Hex,
  JsonRpcAccount,
  LocalAccount,
  Transport,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import {
  serializeMultiChainPermissionAccounts,
  toECDSASigner,
  toPermissionValidator,
} from "@/policy";
import type { GetKernelVersion, Signer } from "@/types";

export type CreateMultichainEcdsaSessionKeyParams<
  TEntrypointVersion extends EntryPointVersion = EntryPointVersion,
  TKernelVersion extends
    GetKernelVersion<TEntrypointVersion> = GetKernelVersion<TEntrypointVersion>,
> = {
  signer: Signer;
  index?: bigint;
  clients: Client<
    Transport,
    Chain | undefined,
    JsonRpcAccount | LocalAccount | undefined
  >[];
  policies: Policy[];
  entrypointVersion: TEntrypointVersion;
  kernelVersion: TKernelVersion;
};

export type CreateMultichainEcdsaSessionKeyResult = {
  approval: string;
  sessionKeyAddress: Address;
  sessionPrivateKey: Hex;
}[];

export const createMultichainEcdsaSessionKey = async <
  TEntrypointVersion extends EntryPointVersion,
  TKernelVersion extends GetKernelVersion<TEntrypointVersion>,
>(
  params: CreateMultichainEcdsaSessionKeyParams<
    TEntrypointVersion,
    TKernelVersion
  >,
): Promise<CreateMultichainEcdsaSessionKeyResult> => {
  const { signer, clients, index, policies, kernelVersion, entrypointVersion } =
    params;

  const entryPoint = getEntryPoint(entrypointVersion);

  if (params.clients.length <= 1) {
    throw new Error("At least 2 clients are required");
  }

  const res = await Promise.all(
    clients.map(async (client) => {
      const multichainValidator = await toMultiChainECDSAValidator(client, {
        entryPoint,
        kernelVersion: kernelVersion,
        signer,
      });

      const sessionPrivateKey = generatePrivateKey();
      const sessionKeyAccount = privateKeyToAccount(sessionPrivateKey);
      const sessionKeyAddress = sessionKeyAccount.address;

      const emptyAccount = addressToEmptyAccount(sessionKeyAddress);

      const sessionKeyEmptySigner = await toECDSASigner({
        signer: emptyAccount,
      });

      const permissionPlugin = await toPermissionValidator(client, {
        entryPoint,
        kernelVersion,
        policies,
        signer: sessionKeyEmptySigner,
      });

      const kernelAccount = await createKernelAccount(client, {
        entryPoint,
        index,
        kernelVersion,
        plugins: {
          regular: permissionPlugin,
          sudo: multichainValidator,
        },
      });

      return {
        kernelAccount,
        sessionKeyAddress,
        sessionPrivateKey,
      };
    }),
  );

  const approvals = await serializeMultiChainPermissionAccounts(
    res.map((r) => {
      return {
        // biome-ignore lint/suspicious/noExplicitAny: safe
        account: r.kernelAccount as any,
      };
    }),
  );

  const data = res.map((r, i) => {
    return {
      approval: approvals[i] as string,
      sessionKeyAddress: r.sessionKeyAddress,
      sessionPrivateKey: r.sessionPrivateKey,
    };
  });

  return data;
};
