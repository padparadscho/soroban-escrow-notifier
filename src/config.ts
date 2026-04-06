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
  STELLAR_ASSET_ID: process.env.STELLAR_ASSET_ID || '',
  STELLAR_EXPLORER_BASE_URL:
    process.env.STELLAR_EXPLORER_BASE_URL ||
    'https://stellar.expert/explorer/public',
  STELLAR_EXPERT_BASE_URL:
    process.env.STELLAR_EXPERT_BASE_URL ||
    'https://api.stellar.expert/explorer/public',

  DATABASE_URL: process.env.DATABASE_URL || '',
  POLLING_INTERVAL: parseInt(process.env.POLLING_INTERVAL || '60000', 10),

  TWITTER: {
    _ENABLE: process.env.ENABLE_TWITTER === 'true',
    _APP_KEY: process.env.TWITTER_APP_KEY || '',
    _APP_SECRET: process.env.TWITTER_APP_SECRET || '',
    _ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || '',
    _ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET || '',
  },

  DISCORD: {
    _ENABLE: process.env.ENABLE_DISCORD === 'true',
    _WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || '',
  },

  TELEGRAM: {
    _ENABLE: process.env.ENABLE_TELEGRAM === 'true',
    _BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
    _CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  },

  DRY_RUN: process.env.DRY_RUN === 'true',
} as const;

if (!CONFIG.SOROBAN_ESCROW_CONTRACT_ID) {
  console.warn('Warning: SOROBAN_ESCROW_CONTRACT_ID is not set');
}
