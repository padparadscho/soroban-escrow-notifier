// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration loaded from environment variables with fallback defaults
 */
export const CONFIG = {
  SOROBAN_RPC_URL: process.env.SOROBAN_RPC_URL || '',
  NETWORK_PASSPHRASE: process.env.NETWORK_PASSPHRASE || '',
  SOROBAN_ESCROW_CONTRACT_ID: process.env.SOROBAN_ESCROW_CONTRACT_ID || '',
  STELLAR_ASSET_CONTRACT_ID: process.env.STELLAR_ASSET_CONTRACT_ID || '',
  STELLAR_EXPLORER_BASE_URL:
    process.env.STELLAR_EXPLORER_BASE_URL ||
    'https://stellar.expert/explorer/public',

  DATABASE_URL: process.env.DATABASE_URL || '',
  POLLING_INTERVAL: parseInt(process.env.POLLING_INTERVAL || '60000', 10),
} as const;

if (!CONFIG.SOROBAN_ESCROW_CONTRACT_ID) {
  console.warn('Warning: SOROBAN_ESCROW_CONTRACT_ID is not set');
}
