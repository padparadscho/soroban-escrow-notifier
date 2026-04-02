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

## License

This project is licensed under the [GPL-3.0 License](/LICENSE).
