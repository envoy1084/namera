# Namera

Namera is a programmable session key layer for smart wallets. It enables wallets to delegate scoped permissions through session keys with programmable policies, designed for agents, automation, and multi-chain execution.

<p>
   <a href="https://github.com/thenamespace/namera/blob/main/LICENSE"><img src="https://img.shields.io/github/license/thenamespace/namera?label=License" alt="License"></a>
    <a href="https://github.com/thenamespace/namera"><img src="https://img.shields.io/github/stars/thenamespace/namera" alt="GitHub stars"></a>
</p>

## Contents

- [Namera](#namera)
  - [Contents](#contents)
  - [Monorepo Structure](#monorepo-structure)
    - [Apps](#apps)
    - [Packages](#packages)
  - [Documentation](#documentation)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
  - [Contributing](#contributing)
    - [Development Workflow](#development-workflow)
    - [Commit Convention](#commit-convention)
    - [Versioning and Releases](#versioning-and-releases)
  - [Security](#security)
  - [License](#license)

## Monorepo Structure

Namera is organized as a Turborepo monorepo using Bun as the package manager.

### Apps

| Package | Description |
|---|---|
| [`apps/cli`](apps/cli) | CLI for managing accounts, sessions, wallets and running local MCP server |
| [`apps/docs`](apps/docs) | Developer documentation built with Fumadocs + Tanstack Start |

### Packages

| Package | Description |
|---|---|
| [`packages/sdk`](packages/sdk) | Core TypeScript SDK for smart accounts, session keys, policies, and transaction execution |
| [`packages/config`](packages/config) | Centralized configurations (tsconfig, Biome, Vitest, tsdown) |
| [`packages/ui`](packages/ui) | Shared UI components |

## Documentation

Full documentation is available at [namera.ai/docs](https://namera.ai/docs).

- [SDK Docs](https://namera.ai/docs/sdk) — smart accounts, session keys, policies, transactions, signing
- [CLI Docs](https://namera.ai/docs/cli) — keystore, smart account, session key commands, MCP server
- [Getting Started](https://namera.ai/docs/sdk/getting-started) — end-to-end guide from installation to first transaction

## Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm**: `npm install -g pnpm`

### Installation

Clone the repository and install dependencies:

```bash
gh repo clone thenamespace/namera
cd namera
pnpm install
```

### Development

Start all apps in development mode:

```bash
pnpm run dev
```

Build all packages and apps:

```bash
pnpm run build
```

Lint and format:

```bash
pnpm run lint
pnpm run lint:check
```

## Contributing

Contributions are welcome. Please read the guidelines below before submitting a PR.

### Development Workflow

1. Fork the repository and create a branch for your changes
2. Install dependencies with `pnpm install`
3. Make your changes and ensure tests pass
4. Run linting with `pnpm run lint`
5. Open a pull request against `main`

All PRs should:

- Follow the existing code style (Biome enforces this)
- Use Effect patterns (`Effect.gen`, `@effect/schema` for validation, tagged error classes)
- Include tests where applicable
- Pass CI checks

### Commit Convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages should follow this format:

```
<type>(<scope>): <description>
```

Common types:

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation changes
- `chore`: tooling, config, or maintenance
- `refactor`: code changes that do not fix bugs or add features
- `test`: adding or updating tests

Example:

```
feat(sdk): add passkey session key support
fix(cli): resolve keystore decryption edge case
docs: update session key policy examples
```

Commitlint is configured via `lefthook` and will validate commits automatically.

### Versioning and Releases

This repo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

To version packages:

```bash
pnpm run changeset
pnpm run version
```

To publish:

```bash
pnpm run release
```

Changesets will guide you through selecting the version bump (major, minor, patch) for each package. The CI pipeline handles publishing on merge to `main` when a release PR is merged.

## Security

Please report security issues via GitHub Security Advisories: https://github.com/thenamespace/namera/security

Do not open a public issue for security vulnerabilities.

## License

Apache 2.0. See [LICENSE](LICENSE).
