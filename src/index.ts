// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import {
  getUnprocessedEscrowEvents,
  getUnprocessedTransferEvents,
  markEscrowEventsProcessed,
  markTransferEventsProcessed,
} from './database/queries';
import {
  formatLockMessage,
  formatUnlockMessage,
  formatTransferMessage,
} from './messages';
import { getEscrowBalance } from './soroban/utils';
import { parseEscrowEvent, parseTransferEvent } from './soroban/parser';
import { CONFIG } from './config';

/**
 * Flag indicating whether the polling loop is active
 */
let isRunning = true;

/**
 * Sends a notification message to all enabled platforms concurrently
 * NOTES: Logs output only for now.
 * @param message - Message to send
 */
async function notifyPlatforms(message: string): Promise<void> {
  console.log(message);
  return Promise.resolve();
}

/**
 * Processes unprocessed escrow events: sends notifications and marks as processed
 * Queries the current escrow balance once for all events in the batch
 * @param rows - Unprocessed event rows from database
 */
async function processEscrowEvents(): Promise<void> {
  const rows = await getUnprocessedEscrowEvents();
  if (rows.length === 0) {
    return;
  }

  const escrowBalance = await getEscrowBalance();
  const ids: string[] = [];

  for (const row of rows) {
    const event = parseEscrowEvent(row);
    if (!event) {
      ids.push(row.id);
      continue;
    }
    const message =
      event.type === 'lock'
        ? formatLockMessage(event, escrowBalance)
        : formatUnlockMessage(event, escrowBalance);

    await notifyPlatforms(message);
    ids.push(row.id);
  }

  await markEscrowEventsProcessed(ids, escrowBalance);
}

/**
 * Processes unprocessed transfer events: sends notifications and marks as processed
 * @param rows - Unprocessed transfer rows from database
 */
async function processTransferEvents(): Promise<void> {
  const rows = await getUnprocessedTransferEvents();
  if (rows.length === 0) {
    return;
  }

  const ids: string[] = [];

  for (const row of rows) {
    const event = parseTransferEvent(row);
    const message = formatTransferMessage(event);

    await notifyPlatforms(message);
    ids.push(row.id);
  }

  await markTransferEventsProcessed(ids);
}

/**
 * Polls the database for unprocessed events and processes them
 */
async function poll(): Promise<void> {
  try {
    await Promise.all([processEscrowEvents(), processTransferEvents()]);
  } catch (error) {
    console.error('Polling error:', error);
  }

  if (isRunning) {
    setTimeout(() => {
      void poll();
    }, CONFIG.POLLING_INTERVAL);
  }
}

/**
 * Registers shutdown handlers and starts the polling loop
 */
async function main(): Promise<void> {
  console.log('Starting notifier');

  const shutdown = (): void => {
    isRunning = false;
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await poll();
}

main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
