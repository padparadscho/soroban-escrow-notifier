// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { db } from './database';
import type { Events, Transfers } from './schema';

export type EventRow = Events;
export type TransferRow = Transfers;

/**
 * Fetches all unprocessed escrow events (lock/unlock) in chronological order
 * @returns Array of raw event rows
 */
export async function getUnprocessedEscrowEvents(): Promise<EventRow[]> {
  return db
    .selectFrom('events')
    .selectAll()
    .where('processed', '=', false)
    .orderBy('ledger_closed_at', 'asc')
    .execute() as unknown as Promise<EventRow[]>;
}

/**
 * Fetches all unprocessed SHx transfer events in chronological order
 * @returns Array of raw transfer rows
 */
export async function getUnprocessedTransferEvents(): Promise<TransferRow[]> {
  return db
    .selectFrom('transfers')
    .selectAll()
    .where('processed', '=', false)
    .orderBy('ledger_closed_at', 'asc')
    .execute() as unknown as Promise<TransferRow[]>;
}

/**
 * Marks escrow events as processed and records the escrow balance and unit price at processing time
 * @param ids - Event IDs to mark as processed
 * @param escrowBalance - Current total SHx balance in escrow (from RPC query)
 * @param unitPrice - Current unit price in USD (from StellarExpert API)
 */
export async function markEscrowEventsProcessed(
  ids: string[],
  escrowBalance: string,
  unitPrice: string,
): Promise<void> {
  await db
    .updateTable('events')
    .set({
      processed: true,
      escrow_balance: escrowBalance,
      unit_price: unitPrice !== '0' ? unitPrice : undefined,
    })
    .where('id', 'in', ids)
    .execute();
}

/**
 * Marks transfer events as processed and records the unit price at processing time
 * @param ids - Transfer IDs to mark as processed
 * @param unitPrice - Current unit price in USD (from StellarExpert API)
 */
export async function markTransferEventsProcessed(
  ids: string[],
  unitPrice: string,
): Promise<void> {
  await db
    .updateTable('transfers')
    .set({
      processed: true,
      unit_price: unitPrice !== '0' ? unitPrice : undefined,
    })
    .where('id', 'in', ids)
    .execute();
}
