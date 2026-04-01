import type { KernelAccountClient } from "@zerodev/sdk";
import type { GetKernelVersion, Signer } from "@zerodev/sdk/types";
import type { WebAuthnKey } from "@zerodev/webauthn-key";
import type { WeightedKernelAccountClient } from "@zerodev/weighted-validator";
import type {
  Chain,
  Client,
  EntryPointVersion,
  JsonRpcAccount,
  LocalAccount,
  RpcSchema,
  Transport,
} from "viem";
import type { PaymasterClient, SmartAccount } from "viem/account-abstraction";

export type AccountType = "ecdsa" | "passkey";

type EcdsaAccountParams = {
  signer: Signer;
};

type PasskeyAccountParams = {
  webAuthnKey: WebAuthnKey;
};

type AccountParamsMap = {
  ecdsa: EcdsaAccountParams;
  passkey: PasskeyAccountParams;
};

export type AccountClientMap<
  TClientTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TRpcSchema extends RpcSchema | undefined = undefined,
> = {
  ecdsa: KernelAccountClient<
    TClientTransport,
    TChain,
    SmartAccount,
    Client,
    TRpcSchema
  >;
  passkey: KernelAccountClient<
    TClientTransport,
    TChain,
    SmartAccount,
    Client,
    TRpcSchema
  >;
  multisig: WeightedKernelAccountClient<
    TClientTransport,
    TChain,
    SmartAccount,
    Client,
    TRpcSchema
  >;
};

export type CreateAccountClientCommonParams<
  TClientTransport extends Transport = Transport,
  TBundlerTransport extends Transport = Transport,
  TPaymasterTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TRpcSchema extends RpcSchema | undefined = undefined,
  TEntrypointVersion extends EntryPointVersion = EntryPointVersion,
  TKernelVersion extends
    GetKernelVersion<TEntrypointVersion> = GetKernelVersion<TEntrypointVersion>,
> = {
  client: Client<
    TClientTransport,
    TChain,
    JsonRpcAccount | LocalAccount | undefined
  >;
  chain: TChain;
  bundlerTransport: TBundlerTransport;
  paymaster?: PaymasterClient<TPaymasterTransport, TRpcSchema>;
  index?: bigint;
  entrypointVersion: TEntrypointVersion;
  kernelVersion: TKernelVersion;
};

export type CreateAccountClientParams<
  TClientTransport extends Transport = Transport,
  TBundlerTransport extends Transport = Transport,
  TPaymasterTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TRpcSchema extends RpcSchema | undefined = undefined,
  TEntrypointVersion extends EntryPointVersion = EntryPointVersion,
  TKernelVersion extends
    GetKernelVersion<TEntrypointVersion> = GetKernelVersion<TEntrypointVersion>,
  TAccountType extends AccountType = AccountType,
> = CreateAccountClientCommonParams<
  TClientTransport,
  TBundlerTransport,
  TPaymasterTransport,
  TChain,
  TRpcSchema,
  TEntrypointVersion,
  TKernelVersion
> & {
  type: TAccountType;
} & AccountParamsMap[TAccountType];
