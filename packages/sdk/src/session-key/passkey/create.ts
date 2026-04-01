import { toMultiChainECDSAValidator } from "@zerodev/multi-chain-ecdsa-validator";
import {
  PasskeyValidatorContractVersion,
  toPasskeyValidator,
} from "@zerodev/passkey-validator";
import {
  serializeMultiChainPermissionAccounts,
  serializePermissionAccount,
  toPermissionValidator,
} from "@zerodev/permissions";
import {
  toWebAuthnSigner,
  WebAuthnSignerVersion,
} from "@zerodev/permissions/signers";
import { createKernelAccount } from "@zerodev/sdk";
import { getEntryPoint } from "@zerodev/sdk/constants";
import type { Chain, Client, EntryPointVersion, Transport } from "viem";

import type { AccountType } from "@/account";
import type { GetKernelVersion } from "@/types";

import type { CreateSessionKeyParams, CreateSessionKeyResult } from "../types";

export const createPasskeySessionKey = async <
  TEntrypointVersion extends EntryPointVersion = EntryPointVersion,
  TKernelVersion extends
    GetKernelVersion<TEntrypointVersion> = GetKernelVersion<TEntrypointVersion>,
  TAccountType extends AccountType = AccountType,
>(
  params: CreateSessionKeyParams<
    TEntrypointVersion,
    TKernelVersion,
    "passkey",
    TAccountType
  >,
): Promise<CreateSessionKeyResult> => {
  const { clients, index, policies, kernelVersion, entrypointVersion } = params;
  const entryPoint = getEntryPoint(entrypointVersion);

  if (clients.length === 0) {
    throw new Error("At least 1 client is required");
  }

  // Create a Passkey Session Key for a ECDSA Validator Smart Account
  if (params.accountType === "ecdsa") {
    const { signer, webAuthnSessionKey } = params as CreateSessionKeyParams<
      TEntrypointVersion,
      TKernelVersion,
      "passkey",
      "ecdsa"
    >;

    const accounts = await Promise.all(
      clients.map(async (client) => {
        const webAuthnSigner = await toWebAuthnSigner(
          client as Client<Transport, Chain, undefined>,
          {
            webAuthnKey: webAuthnSessionKey,
            webAuthnSignerVersion: WebAuthnSignerVersion.V0_0_4_PATCHED,
          },
        );

        const multichainValidator = await toMultiChainECDSAValidator(client, {
          entryPoint,
          kernelVersion: kernelVersion,
          signer,
        });

        const permissionPlugin = await toPermissionValidator(client, {
          entryPoint,
          kernelVersion,
          policies: policies,
          signer: webAuthnSigner,
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
        };
      }),
    );

    const approvals = await serializeMultiChainPermissionAccounts(
      accounts.map((account) => {
        return {
          // biome-ignore lint/suspicious/noExplicitAny: safe
          account: account.kernelAccount as any,
        };
      }),
    );

    const serializedAccounts = accounts.map((account, i) => {
      return {
        // biome-ignore lint/style/noNonNullAssertion: safe
        chainId: account.kernelAccount.client.chain!.id,
        serializedAccount: approvals[i] as string,
      };
    });

    const result = {
      serializedAccounts,
    };
    return result;
  }
  // Create a Passkey Session Key for a Passkey Validator Smart Account
  // Note: for multiple chains it will prompt the user to sign multiple times, once for each chain, since the passkey validator is not multi-chain and requires a separate approval for each chain
  if (params.accountType === "passkey") {
    const { webAuthnKey, webAuthnSessionKey } =
      params as CreateSessionKeyParams<
        TEntrypointVersion,
        TKernelVersion,
        "passkey",
        "passkey"
      >;

    const serializedAccounts = await Promise.all(
      clients.map(async (client) => {
        const webAuthnSigner = await toWebAuthnSigner(
          client as Client<Transport, Chain, undefined>,
          {
            webAuthnKey: webAuthnSessionKey,
            webAuthnSignerVersion: WebAuthnSignerVersion.V0_0_4_PATCHED,
          },
        );

        const passkeyValidator = await toPasskeyValidator(client, {
          entryPoint,
          kernelVersion,
          validatorContractVersion:
            PasskeyValidatorContractVersion.V0_0_3_PATCHED,
          webAuthnKey,
        });

        const permissionPlugin = await toPermissionValidator(client, {
          entryPoint,
          kernelVersion,
          policies: policies,
          signer: webAuthnSigner,
        });

        const sessionKeyAccount = await createKernelAccount(client, {
          entryPoint,
          index,
          kernelVersion,
          plugins: {
            regular: permissionPlugin,
            sudo: passkeyValidator,
          },
        });

        const approval = await serializePermissionAccount(
          // biome-ignore lint/suspicious/noExplicitAny: safe
          sessionKeyAccount as any,
        );

        return {
          chainId: client.chain.id,
          serializedAccount: approval,
        };
      }),
    );

    const result = {
      serializedAccounts,
    };
    return result;
  }

  throw new Error("Unsupported account type");
};
