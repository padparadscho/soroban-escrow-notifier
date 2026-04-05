> [!IMPORTANT]  
> This project is in active development and may not have been fully tested. Use at your own risk.

> [!WARNING]
> This project and involved contributors are not affiliated with, endorsed by, or sponsored by Stronghold or any of its affiliates. This is an independent personal project developed for educational and experimental purposes only.

# Soroban Escrow Notifier

A multi-platform notification system that monitors a specified **Soroban escrow smart contract** and broadcasts formatted notifications to configured platforms.

## Overview

This service listens for events emitted by the [Stronghold (SHx) escrow contract](https://stellar.expert/explorer/public/contract/CCA5HAZCPEYXD7JBKAJCVUZUXAK7V5ZFU3QMJO33OJH2OHL3OGLS2P7M) and _first‑hop_ transactions submitted by contract participants, formats informative messages, and posts them to configured platforms.

This project is an experimental, enhanced version of the now‑deprecated [soroban-escrow-twitter-bot](https://github.com/padparadscho/soroban-escrow-twitter-bot). It features a safer, more modern, and better structured codebase, a robust modular architecture, and improved extensibility.

> [!NOTE]
> It is **not** intended to be a replacement for the [fork](https://github.com/CptX-SHx/soroban-escrow-twitter-bot) currently maintained by [@DebunkJelpi](https://x.com/DebunkJelpi), which is part of an approved application to the [SHx Ecosystem Development Program](https://docs.shx.stronghold.co/ecosystem/edp), but a reference for future implementations.

## Features

- Polls unprocessed escrow (`lock` / `unlock`) and transfer rows indexed by the **Goldsky** pipeline.
- Parses raw event payloads into structured, human-readable data.
- Sends formatted notifications to enabled platforms via a pluggable adapter system (_Twitter_, _Discord_, _Telegram_, etc.).
- Marks events as processed after handling to prevent duplicate notifications.
- Supports dry-run mode for safe testing without posting to platforms.

Track ongoing tasks and project progress through the [GitHub Project](https://github.com/users/padparadscho/projects/4) board and participate in conversations or share your feedback in the dedicated [GitHub Discussions](https://github.com/padparadscho/soroban-escrow-notifier/discussions) space.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) package manager
- PostgreSQL database
- [Goldsky](https://goldsky.com/) account and CLI tool with Turbo extension
- Access to a [Soroban RPC](https://developers.stellar.org/docs/data/apis/rpc/providers) endpoint

### Installation

1. Clone the repository:

```bash
git clone https://github.com/padparadscho/soroban-escrow-notifier.git

cd soroban-escrow-notifier
```

2. Install dependencies:

```bash
pnpm install
```

3. Create and configure the `.env` file with your environment variables:

```bash
cp .env.example .env
```

- For the `SOROBAN_ESCROW_CONTRACT_ID`, refer to the [soroban-escrow-contract](https://github.com/padparadscho/soroban-escrow-contract) repository **OR** download the [WASM code](https://stellar.expert/explorer/public/contract/CCA5HAZCPEYXD7JBKAJCVUZUXAK7V5ZFU3QMJO33OJH2OHL3OGLS2P7M?filter=interface) from the official Stronghold (SHx) escrow contract on mainnet.
- For the `STELLAR_ASSET_CONTRACT_ID`, refer to the [stellar-asset-contract-deployer](https://github.com/padparadscho/stellar-asset-contract-deployer) repository **OR** use the [SHx SAC (Stellar Asset Contract)](https://stellar.expert/explorer/public/contract/CCKCKCPHYVXQD4NECBFJTFSCU2AMSJGCNG4O6K4JVRE2BLPR7WNDBQIQ) on mainnet.
- (Optional) Set `DRY_RUN=true` to test without posting to enabled platforms.

4. Deploy pipeline:

```bash
goldsky turbo apply pipelines/pipeline-mainnet.yaml
```

**NOTE:** Only new events and transactions will be processed after deployment, historical data will not be backfilled. Use the `pipeline-backfill`, adjust parameters if needed before deployment.

5. Prepare the database schema:

```bash
# Run all pending migrations up
pnpm migrate

# Generate TypeScript types for database tables
pnpm generate-schema
```

### Usage

1. Run in development mode:

```bash
pnpm dev
```

2. Build and run production output:

```bash
pnpm build

pnpm start
```

### Docker

Optional Docker flow:

```bash
# Build the Docker image
docker build -t soroban-escrow-notifier .

# Run the Docker container
docker run -d --env-file .env --name soroban-escrow-notifier-container soroban-escrow-notifier

# Check logs
docker logs -f soroban-escrow-notifier-container

# Stop and remove the container
docker stop soroban-escrow-notifier-container && docker rm soroban-escrow-notifier-container
```

**NOTE:** Docker runs only the notifier worker. Goldsky pipeline and database setup must be done separately.

## Contributing

If you're interested in helping improve this project, see [CONTRIBUTING](/CONTRIBUTING.md).

## License

This project is licensed under the [GPL-3.0 License](/LICENSE).
