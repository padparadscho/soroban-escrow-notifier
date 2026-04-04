// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Internal escrow event type used by the notifier
 */
export interface EscrowEvent {
  id: string;
  type: 'lock' | 'unlock';
  account: string;
  amount: string;
  escrowBalance: string | null;
  claimAfter: string | null;
  txHash: string;
  ledger: number;
  ledgerClosedAt: Date;
}

/**
 * Internal transfer event type used by the notifier
 */
export interface TransferEvent {
  id: string;
  transferType: string;
  sender: string;
  recipient: string;
  amount: string;
  txHash: string;
  ledger: number;
  ledgerClosedAt: Date;
}
