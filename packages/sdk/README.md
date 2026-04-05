# Namera SDK

Namera SDK is a TypeScript library for building with smart accounts. It gives you a focused API for creating accounts, issuing scoped session keys, and executing transactions across chains.

<p>
  <a href="https://www.npmjs.com/package/@namera-ai/sdk"><img src="https://img.shields.io/npm/v/@namera-ai/sdk" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@namera-ai/sdk"><img src="https://img.shields.io/npm/dm/@namera-ai/sdk" alt="npm downloads"></a>
  <a href="https://github.com/thenamespace/namera/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@namera-ai/sdk" alt="license"></a>
</p>

## Contents


- [Namera SDK](#namera-sdk)
  - [Contents](#contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Why Namera SDK?](#why-namera-sdk)
  - [Smart Accounts](#smart-accounts)
  - [Session Keys](#session-keys)
  - [Session Key Policies](#session-key-policies)
  - [Transaction Execution](#transaction-execution)
  - [Signing Utilities](#signing-utilities)
  - [Architecture](#architecture)
  - [Examples](#examples)
  - [Documentation](#documentation)
  - [Security](#security)
  - [License](#license)

## Prerequisites

- **Node.js 18+** for running the SDK
- **TypeScript 5+** (recommended)
- **[Viem](https://viem.sh/)**: Ethereum primitives used by the SDK

## Installation

Install with your package manager:

```bash
npm i @namera-ai/sdk viem
#or
pnpm i @namera-ai/sdk viem
#or
bun i @namera-ai/sdk viem
#or
yarn add @namera-ai/sdk viem
```

---

## Quick Start

Create a smart account, issue a session key with policies, and send a transaction:

```ts
import { createAccountClient } from "@namera-ai/sdk/account";
import { createSessionKey, createSessionKeyClient } from "@namera-ai/sdk/session-key";
import { executeTransaction } from "@namera-ai/sdk/transaction";
import { createPublicClient, http, parseEther } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const signer = privateKeyToAccount(generatePrivateKey());

const accountClient = await createAccountClient({
  type: "ecdsa",
  signer,
  bundlerTransport: http("https://public.pimlico.io/v2/1/rpc"),
  chain: mainnet,
  client: publicClient,
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
});
```

```ts
import { toGasPolicy, toTimestampPolicy } from "@namera-ai/sdk/policy";

const sessionPrivateKey = generatePrivateKey();
const sessionKeySigner = privateKeyToAccount(sessionPrivateKey);

const sessionKey = await createSessionKey({
  type: "ecdsa",
  accountType: "ecdsa",
  clients: [publicClient],
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
  policies: [
    toGasPolicy({ allowed: parseEther("0.1") }),
    toTimestampPolicy({ validUntil: Math.floor(Date.now() / 1000) + 86400 }),
  ],
  sessionPrivateKey,
  signer,
});

const serializedAccount = sessionKey.serializedAccounts[0]?.serializedAccount as string;

const sessionKeyClient = await createSessionKeyClient({
  type: "ecdsa",
  bundlerTransport: http("https://public.pimlico.io/v2/1/rpc"),
  chain: mainnet,
  client: publicClient,
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
  serializedAccount,
  signer: sessionKeySigner,
});
```

```ts
const receipts = await executeTransaction({
  batches: [
    {
      chainId: mainnet.id,
      calls: [
        {
          to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          data: "0x",
          value: parseEther("0.001"),
        },
      ],
    },
  ],
  clients: [sessionKeyClient],
});
```

## Why Namera SDK?

**For developers**: clean TypeScript API, focused entry points, and tree-shakeable imports. No need to wire together low-level contract calls and plugin installations.

**For agents and automation**: session keys with onchain policy enforcement let you delegate scoped permissions without exposing the primary signer. Multi-chain execution with a single request, parallel lanes for independent work, and atomic batches for ordered flows.

## Smart Accounts

Smart accounts replace the "private key = control" model with programmable, contract-based accounts that define how execution happens. Namera supports two validators:

- **ECDSA**: works like a normal EOA but supports multi-chain execution via a single Merkle root signature. Recommended for automation and backend workflows.
- **Passkey**: uses WebAuthn credentials (Face ID / Touch ID) for user-prompted approvals. Ideal for consumer UX.

```ts
import { createAccountClient } from "@namera-ai/sdk/account";

const client = await createAccountClient({
  type: "ecdsa",
  signer,
  bundlerTransport: http("BUNDLER_URL"),
  chain: mainnet,
  client: publicClient,
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
});
```

The account address is deterministic and can be used immediately, even before the contract is deployed onchain.

## Session Keys

Session keys are delegated keys that can sign transactions on behalf of a smart account, but only within explicit policy boundaries. You issue a session key to a bot, dapp, or agent and attach onchain rules that define what it can do.

- **ECDSA session keys**: support multi-chain approval with a single signature. The owner signs a Merkle root once, and each chain verifies the session key with a proof.
- **Passkey session keys**: use WebAuthn credentials for user-prompted approvals. Require one approval per chain.

```ts
import { createSessionKey, createSessionKeyClient } from "@namera-ai/sdk/session-key";

const sessionKey = await createSessionKey({
  type: "ecdsa",
  accountType: "ecdsa",
  clients: [publicClient],
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
  policies: [/* policies */],
  sessionPrivateKey,
  signer,
});

const sessionKeyClient = await createSessionKeyClient({
  type: "ecdsa",
  bundlerTransport: http("BUNDLER_URL"),
  chain: mainnet,
  client: publicClient,
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
  serializedAccount: sessionKey.serializedAccounts[0]?.serializedAccount,
  signer: sessionKeySigner,
});
```

Check installation status and revoke when needed:

```ts
import { isSessionKeyInstalled, revokeSessionKey } from "@namera-ai/sdk/session-key";

const isInstalled = await isSessionKeyInstalled(publicClient, {
  accountAddress: client.account.address,
  sessionKeyAddress: sessionKeySigner.address,
});

await revokeSessionKey({
  type: "ecdsa",
  client: accountClient,
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
  serializedAccount,
  signer: sessionKeySigner,
});
```

## Session Key Policies

Policies are the rule set attached to session keys. Multiple policies can be combined, and all must pass for a transaction to be valid.

- **Sudo**: full permissions, equivalent to the primary signer
- **Call**: restrict targets, functions, argument values, and native value
- **Gas**: cap total gas spend and optionally enforce a paymaster
- **Signature**: restrict which contracts can validate signed messages
- **Rate-limit**: throttle how often transactions can be sent
- **Timestamp**: constrain when the key is valid (time windows)

```ts
import {
  CallPolicyVersion,
  ParamCondition,
  toCallPolicy,
  toGasPolicy,
  toTimestampPolicy,
} from "@namera-ai/sdk/policy";
import { parseEther, erc20Abi } from "viem";

const callPolicy = toCallPolicy({
  permissions: [
    {
      target: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      abi: erc20Abi,
      functionName: "transfer",
      args: [
        null,
        { condition: ParamCondition.LESS_THAN_OR_EQUAL, value: parseUnits("100", 6) },
      ],
      valueLimit: 0n,
    },
  ],
  policyVersion: CallPolicyVersion.V0_0_5,
});

const gasPolicy = toGasPolicy({ allowed: parseEther("0.1") });

const timestampPolicy = toTimestampPolicy({
  validUntil: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
});
```

## Transaction Execution

Transactions use a lane-based model where you describe calls grouped into batches and optionally spread across chains. Each batch becomes a UserOperation, and the SDK manages nonces per lane.

- **Single transaction**: one batch, one call
- **Atomic batch**: multiple calls executed sequentially in one UserOperation
- **Parallel lanes**: batches with different `nonceKey` values execute in parallel on the same chain
- **Multi-chain**: batches with different `chainId` values route to matching clients

```ts
import { executeTransaction } from "@namera-ai/sdk/transaction";

const receipts = await executeTransaction({
  batches: [
    {
      chainId: 1,
      nonceKey: "swap",
      calls: [
        { to: router, data: approveData },
        { to: router, data: swapData },
      ],
    },
    {
      chainId: 137,
      calls: [
        { to: pool, data: supplyData },
      ],
    },
  ],
  clients: [ethClient, polygonClient],
});
```

Returns `(UserOperationReceipt | null)[]` — one entry per batch in the same order.

## Signing Utilities

Sign and verify messages and typed data with smart accounts using ERC-6492, which works for both deployed and undeployed accounts.

```ts
import { verifyEIP6492Signature } from "@namera-ai/sdk";
import { hashMessage, hashTypedData } from "viem";

const signature = await accountClient.signMessage({ message: "Hello World" });
const isVerified = await verifyEIP6492Signature({
  client: publicClient,
  hash: hashMessage("Hello World"),
  signature,
  signer: accountClient.account.address,
});
```

Typed data signing follows the same pattern with `signTypedData` and `hashTypedData`.

## Architecture

The SDK is organized around focused entry points:

| Entry point | Purpose |
|---|---|
| `@namera-ai/sdk/account` | Smart account creation and management |
| `@namera-ai/sdk/session-key` | Session key creation, status checks, and revocation |
| `@namera-ai/sdk/policy` | Policy builders for call, gas, signature, rate-limit, timestamp, and sudo |
| `@namera-ai/sdk/transaction` | Batched and multi-chain transaction execution |
| `@namera-ai/sdk/passkey` | WebAuthn utilities for passkey accounts and session keys |

Each entry point exports only what you need for that part of the flow, so your imports stay focused and your bundle stays small.

## Examples

Create a passkey smart account:

```ts
import { createAccountClient } from "@namera-ai/sdk/account";
import { toWebAuthnKey, WebAuthnMode } from "@namera-ai/sdk/passkey";

const webAuthnKey = await toWebAuthnKey({
  mode: WebAuthnMode.Register,
  passkeyName: "my-passkey",
  passkeyServerUrl: "YOUR_PASSKEY_SERVER_URL",
});

const client = await createAccountClient({
  type: "passkey",
  webAuthnKey,
  bundlerTransport: http("BUNDLER_URL"),
  chain: mainnet,
  client: publicClient,
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
});
```

Create a passkey session key:

```ts
import { createSessionKey, createSessionKeyClient } from "@namera-ai/sdk/session-key";

const webAuthnSessionKey = await toWebAuthnKey({
  mode: WebAuthnMode.Register,
  passkeyName: "session-passkey",
  passkeyServerUrl: "YOUR_PASSKEY_SERVER_URL",
});

const sessionKey = await createSessionKey({
  type: "passkey",
  accountType: "ecdsa",
  clients: [publicClient],
  entrypointVersion: "0.7",
  kernelVersion: "0.3.2",
  policies: [/* policies */],
  signer,
  webAuthnSessionKey,
});
```

Atomic approve + swap:

```ts
const receipts = await executeTransaction({
  batches: [
    {
      chainId: 1,
      calls: [
        { to: usdc, data: approveData },
        { to: router, data: swapData },
      ],
    },
  ],
  clients: [ethClient],
});
```

Parallel swap and lend on the same chain:

```ts
const receipts = await executeTransaction({
  batches: [
    {
      chainId: 1,
      nonceKey: "swap",
      calls: [{ to: router, data: swapData }],
    },
    {
      chainId: 1,
      nonceKey: "lend",
      calls: [
        { to: dai, data: approveData },
        { to: pool, data: supplyData },
      ],
    },
  ],
  clients: [ethClient],
});
```

## Documentation

- SDK Docs: [https://namera.ai/docs/sdk](https://namera.ai/docs/sdk)
- SDK Docs Source: [apps/docs/content/docs/sdk](https://github.com/thenamespace/namera/tree/main/apps/docs/content/docs/sdk)

## Security

Please report security issues via GitHub: https://github.com/thenamespace/namera/security

## License

Apache 2.0. See [LICENSE](https://github.com/thenamespace/namera/blob/main/LICENSE).
