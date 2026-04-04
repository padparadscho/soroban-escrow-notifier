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
 * Marks escrow events as processed and records the escrow balance at processing time
 * @param ids - Event IDs to mark as processed
 * @param escrowBalance - Current total SHx balance in escrow (from RPC query)
 */
export async function markEscrowEventsProcessed(
  ids: string[],
  escrowBalance: string,
): Promise<void> {
  await db
    .updateTable('events')
    .set({ processed: true, escrow_balance: escrowBalance })
    .where('id', 'in', ids)
    .execute();
}

/**
 * Marks transfer events as processed
 * @param ids - Transfer IDs to mark as processed
 */
export async function markTransferEventsProcessed(
  ids: string[],
): Promise<void> {
  await db
    .updateTable('transfers')
    .set({ processed: true })
    .where('id', 'in', ids)
    .execute();
}
