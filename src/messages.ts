// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * NOTES: Needs refactoring to reduce duplication
 */

import type { EscrowEvent, TransferEvent } from './soroban/events';
import { formatAmount, toBold, formatDate, formatAddress } from './utils';
import { CONFIG } from './config';

/**
 * Creates a notification message for a lock event
 * @param event - Escrow event with lock type
 * @param escrowBalance - Current total escrow balance
 * @returns Formatted notification string
 */
export function formatLockMessage(
  event: EscrowEvent,
  escrowBalance: string,
): string {
  const address = formatAddress(event.account);
  const amount = formatAmount(event.amount);
  const balance = formatAmount(escrowBalance);
  const claimDate = Number.isFinite(Number(event.claimAfter))
    ? formatDate(new Date(Number(event.claimAfter) * 1000))
    : 'Unknown';
  const tx = `${CONFIG.STELLAR_EXPLORER_BASE_URL}/tx/${event.txHash}`;

  return [
    `🚨 ${toBold('SHx Escrow Alert')} 🚨`,
    ``,
    `🔒 Account ${toBold(address)} locked ${toBold(amount)} #SHx until ${claimDate}.`,
    `🔺 Escrow balance: ${toBold(balance)} $SHx`,
    ``,
    `🔗 TX: ${tx}`,
  ].join('\n');
}

/**
 * Creates a notification message for an unlock event
 * @param event - Escrow event with unlock type
 * @param escrowBalance - Current total escrow balance
 * @returns Formatted notification string
 */
export function formatUnlockMessage(
  event: EscrowEvent,
  escrowBalance: string,
): string {
  const address = formatAddress(event.account);
  const amount = formatAmount(event.amount);
  const balance = formatAmount(escrowBalance);
  const date = formatDate(event.ledgerClosedAt);
  const tx = `${CONFIG.STELLAR_EXPLORER_BASE_URL}/tx/${event.txHash}`;

  return [
    `🚨 ${toBold('SHx Escrow Alert')} 🚨`,
    ``,
    `🔓 Account ${toBold(address)} unlocked ${toBold(amount)} #SHx on ${date}.`,
    `🔻 Escrow balance: ${toBold(balance)} $SHx`,
    ``,
    `🔗 TX: ${tx}`,
  ].join('\n');
}

/**
 * Creates a notification message for a transfer event
 * @param event - Transfer event data
 * @returns Formatted notification string
 */
export function formatTransferMessage(event: TransferEvent): string {
  const amount = formatAmount(event.amount);
  const recipient = formatAddress(event.recipient);
  const sender = formatAddress(event.sender);
  const tx = `${CONFIG.STELLAR_EXPLORER_BASE_URL}/tx/${event.txHash}`;

  return [
    `🚨 ${toBold('SHx Escrow Alert')} 🚨`,
    ``,
    `💸 Account ${toBold(sender)} transferred ${toBold(amount)} $SHx to ${toBold(recipient)}.`,
    ``,
    `🔗 TX: ${tx}`,
  ].join('\n');
}
