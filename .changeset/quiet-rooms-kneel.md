---
"@namera-ai/sdk": minor
---

Initial release of `@namera-ai/sdk`

This release provides a focused API for creating accounts, issuing scoped session keys, and executing transactions across chains, built on ZeroDev smart accounts and viem.

**Smart Accounts**
- Create ECDSA smart accounts with multi-chain validator support
- Create passkey smart accounts with WebAuthn authentication
- Deterministic counterfactual addresses usable before deployment
- Configurable entrypoint and kernel versions

**Session Keys**
- ECDSA session keys with multi-chain approval via Merkle root signing
- Passkey session keys with WebAuthn credentials for user-prompted approvals
- Lazy plugin installation on first UserOp
- Status checking and revocation utilities

**Policies**
- Call policy: restrict targets, functions, argument values, and native value
- Gas policy: cap total gas spend and enforce paymaster usage
- Signature policy: restrict which contracts can validate signed messages
- Rate-limit policy: throttle transaction frequency
- Timestamp policy: constrain key validity to time windows
- Sudo policy: full permissions for trusted systems

**Transaction Execution**
- Lane-based execution model with batched and multi-chain support
- Atomic batches for ordered, all-or-nothing flows
- Parallel execution via nonce lanes on the same chain
- Multi-chain routing with per-chain client matching
- Returns UserOperationReceipt per batch

**Signing Utilities**
- ERC-6492 message signing and verification for deployed and counterfactual accounts
