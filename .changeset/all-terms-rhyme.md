---
"@namera-ai/cli": minor
---

Initial release of `@namera-ai/cli`

A local-first, agent-first CLI for managing smart accounts with session keys and scoped permissions across chains.

This release provides a complete command-line interface for keystores, smart accounts, session keys, and MCP server management, designed for both interactive human use and deterministic agent-driven workflows.

**Keystore Management**
- Create encrypted keystores for owner signers
- Import existing keystores from private keys
- List, inspect, and decrypt keystore metadata
- Remove keystores from disk

**Smart Account Management**
- Create ECDSA smart accounts linked to owner keystores
- Import existing smart accounts from serialized data
- List, inspect, and query account details
- Check deployment status per chain
- Remove smart account descriptors from disk

**Session Key Management**
- Create session keys with scoped policies (sudo, call, gas, timestamp, rate-limit, signature-caller)
- List, inspect, and query session key metadata
- Check installation status per chain
- Remove session keys from disk

**MCP Server**
- Start local MCP server over stdio (default) or HTTP transport
- Expose wallet tools: `get_wallet_address`, `get_balance`, `read_contract`, `native_transfer`, `execute_transaction`
- Multi-chain support with per-chain RPC, bundler, and paymaster configuration via environment variables