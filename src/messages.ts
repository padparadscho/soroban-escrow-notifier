// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * NOTES: Needs refactoring to reduce duplication
 */

import type { EscrowEvent, TransferEvent } from './soroban/events';
import {
  formatAddress,
  formatAmount,
  formatDate,
  formatPrice,
  toBold,
} from './utils';
import { CONFIG } from './config';

/**
 * Creates a notification message for a lock event
 * @param event - Escrow event with lock type
 * @param escrowBalance - Current total escrow balance
 * @param unitPrice - Current asset price in USD
 * @returns Formatted notification string
 */
export function formatLockMessage(
  event: EscrowEvent,
  escrowBalance: string,
  unitPrice: string,
): string {
  const address = formatAddress(event.account);
  const amount = formatAmount(event.amount);
  const amountPrice = formatPrice(event.amount, unitPrice);
  const balance = formatAmount(escrowBalance);
  const balancePrice = formatPrice(escrowBalance, unitPrice);
  const claimDate = Number.isFinite(Number(event.claimAfter))
    ? formatDate(new Date(Number(event.claimAfter) * 1000))
    : 'Unknown';
  const unitPriceFormatted = parseFloat(unitPrice).toPrecision(4);
  const tx = `${CONFIG.STELLAR_EXPLORER_BASE_URL}/tx/${event.txHash}`;

  return [
    `🚨 ${toBold('SHx Escrow Alert')} 🚨`,
    ``,
    `🔒 Account ${toBold(address)} locked ${toBold(amount)} #SHx (~${amountPrice}) until ${claimDate}.`,
    `🔺 Escrow balance: ${toBold(balance)} $SHx (~${balancePrice})`,
    ``,
    `💲 Price: $${unitPriceFormatted}`,
    `🔗 TX: ${tx}`,
  ].join('\n');
}

/**
 * Creates a notification message for an unlock event
 * @param event - Escrow event with unlock type
 * @param escrowBalance - Current total escrow balance
 * @param unitPrice - Current asset price in USD
 * @returns Formatted notification string
 */
export function formatUnlockMessage(
  event: EscrowEvent,
  escrowBalance: string,
  unitPrice: string,
): string {
  const address = formatAddress(event.account);
  const amount = formatAmount(event.amount);
  const amountPrice = formatPrice(event.amount, unitPrice);
  const balance = formatAmount(escrowBalance);
  const balancePrice = formatPrice(escrowBalance, unitPrice);
  const date = formatDate(event.ledgerClosedAt);
  const unitPriceFormatted = parseFloat(unitPrice).toPrecision(4);
  const tx = `${CONFIG.STELLAR_EXPLORER_BASE_URL}/tx/${event.txHash}`;

  return [
    `🚨 ${toBold('SHx Escrow Alert')} 🚨`,
    ``,
    `🔓 Account ${toBold(address)} unlocked ${toBold(amount)} #SHx (~${amountPrice}) on ${date}.`,
    `🔻 Escrow balance: ${toBold(balance)} $SHx (~${balancePrice})`,
    ``,
    `💲 Price: $${unitPriceFormatted}`,
    `🔗 TX: ${tx}`,
  ].join('\n');
}

/**
 * Creates a notification message for a transfer event
 * @param event - Transfer event data
 * @param unitPrice - Current asset price in USD
 * @returns Formatted notification string
 */
export function formatTransferMessage(
  event: TransferEvent,
  unitPrice: string,
): string {
  const amount = formatAmount(event.amount);
  const amountPrice = formatPrice(event.amount, unitPrice);
  const date = formatDate(event.ledgerClosedAt);
  const unitPriceFormatted = parseFloat(unitPrice).toPrecision(4);
  const recipient = formatAddress(event.recipient);
  const sender = formatAddress(event.sender);
  const tx = `${CONFIG.STELLAR_EXPLORER_BASE_URL}/tx/${event.txHash}`;

  return [
    `🚨 ${toBold('SHx Escrow Alert')} 🚨`,
    ``,
    `💸 Account ${toBold(sender)} transferred ${toBold(amount)} $SHx (~${amountPrice}) to ${toBold(recipient)} on ${date}.`,
    ``,
    `💲 Price: $${unitPriceFormatted}`,
    `🔗 TX: ${tx}`,
  ].join('\n');
}
