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
import { getEscrowBalance, fetchPrice } from './soroban/utils';
import { parseEscrowEvent, parseTransferEvent } from './soroban/parser';
import { DiscordAdapter, TelegramAdapter, TwitterAdapter } from './adapters';
import { CONFIG } from './config';

/**
 * Active platform adapters for sending notifications
 */
const adapters = [
  new TwitterAdapter(),
  new TelegramAdapter(),
  new DiscordAdapter(),
];

/**
 * Flag indicating whether the polling loop is active
 */
let isRunning = true;

/**
 * Sends a notification message to all enabled platforms concurrently
 * NOTE: A single adapter failure does not abort the whole batch
 * @param message - Message to send
 */
async function notifyPlatforms(message: string): Promise<void> {
  const enabledAdapters = adapters.filter((adapter) => adapter.isEnabled());

  await Promise.allSettled(
    enabledAdapters.map((adapter) => adapter.send(message)),
  );
}

/**
 * Processes unprocessed escrow events: sends notifications and marks as processed
 * Queries the current escrow balance and unit price once for all events in the batch
 */
async function processEscrowEvents(): Promise<void> {
  const rows = await getUnprocessedEscrowEvents();
  if (rows.length === 0) {
    return;
  }

  const [escrowBalance, unitPrice] = await Promise.all([
    getEscrowBalance(),
    fetchPrice(),
  ]);
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

  await markEscrowEventsProcessed(ids, escrowBalance, unitPrice);
}

/**
 * Processes unprocessed transfer events: sends notifications and marks as processed
 * Queries the current unit price once for all events in the batch
 */
async function processTransferEvents(): Promise<void> {
  const rows = await getUnprocessedTransferEvents();
  if (rows.length === 0) {
    return;
  }

  const [ids, unitPrice] = [[] as string[], await fetchPrice()];

  for (const row of rows) {
    const event = parseTransferEvent(row);
    const message = formatTransferMessage(event);

    await notifyPlatforms(message);
    ids.push(row.id);
  }

  await markTransferEventsProcessed(ids, unitPrice);
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
  const enabledAdapters = adapters
    .filter((a) => a.isEnabled())
    .map((a) => a.constructor.name);

  console.log(
    `Starting notifier. Adapters: ${enabledAdapters.join(', ') || 'none'}`,
  );

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
