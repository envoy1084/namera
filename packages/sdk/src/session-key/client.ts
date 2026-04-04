import { deserializePermissionAccount } from "@zerodev/permissions";
import {
  toECDSASigner,
  toWebAuthnSigner,
  WebAuthnSignerVersion,
} from "@zerodev/permissions/signers";
import {
  type CreateKernelAccountReturnType,
  createKernelAccountClient,
  type KernelAccountClient,
} from "@zerodev/sdk";
import { getEntryPoint } from "@zerodev/sdk/constants";
import type {
  Chain,
  Client,
  EntryPointVersion,
  RpcSchema,
  Transport,
} from "viem";
import type {
  GetPaymasterDataParameters,
  GetPaymasterStubDataParameters,
  SmartAccount,
} from "viem/account-abstraction";

import type { GetKernelVersion } from "@/types";

import type { CreateSessionKeyClientParams, SessionKeyType } from "./types";

export const createSessionKeyClient = async <
  TSessionKeyType extends SessionKeyType,
  TClientTransport extends Transport,
  TBundlerTransport extends Transport,
  TPaymasterTransport extends Transport,
  TChain extends Chain,
  TRpcSchema extends RpcSchema | undefined,
  TEntrypointVersion extends EntryPointVersion,
  TKernelVersion extends GetKernelVersion<TEntrypointVersion>,
>(
  params: CreateSessionKeyClientParams<
    TSessionKeyType,
    TClientTransport,
    TBundlerTransport,
    TPaymasterTransport,
    TChain,
    TRpcSchema,
    TEntrypointVersion,
    TKernelVersion
  >,
): Promise<
  KernelAccountClient<
    TClientTransport,
    TChain,
    SmartAccount,
    Client,
    TRpcSchema
  >
> => {
  const {
    client,
    serializedAccount,
    bundlerTransport,
    paymaster: Paymaster,
    chain,
    entrypointVersion,
    kernelVersion,
  } = params;

  const entryPoint = getEntryPoint(entrypointVersion);

  let sessionKeyAccount: CreateKernelAccountReturnType<TEntrypointVersion>;

  if (params.type === "ecdsa") {
    const { signer } = params as CreateSessionKeyClientParams<
      "ecdsa",
      TClientTransport,
      TBundlerTransport,
      TPaymasterTransport,
      TChain,
      TRpcSchema,
      TEntrypointVersion,
      TKernelVersion
    >;
    const sessionSigner = await toECDSASigner({
      signer: signer,
    });

    sessionKeyAccount = await deserializePermissionAccount(
      client,
      entryPoint,
      kernelVersion,
      serializedAccount,
      sessionSigner,
    );
  } else if (params.type === "passkey") {
    const { webAuthnKey } = params as CreateSessionKeyClientParams<
      "passkey",
      TClientTransport,
      TBundlerTransport,
      TPaymasterTransport,
      TChain,
      TRpcSchema,
      TEntrypointVersion,
      TKernelVersion
    >;

    const sessionSigner = await toWebAuthnSigner(
      client as Client<TClientTransport, TChain, undefined>,
      {
        webAuthnKey,
        webAuthnSignerVersion: WebAuthnSignerVersion.V0_0_4_PATCHED,
      },
    );

    sessionKeyAccount = await deserializePermissionAccount(
      client,
      entryPoint,
      kernelVersion,
      serializedAccount,
      sessionSigner,
    );
  } else {
    throw new Error("Unsupported session key type");
  }

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
    account: sessionKeyAccount,
    bundlerTransport,
    chain,
    client,
    name: "Namera Account Client",
    paymaster,
  });

  return kernelClient;
};
