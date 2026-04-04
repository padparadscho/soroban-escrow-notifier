// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { EventRow, TransferRow } from '../database/queries';
import type { EscrowEvent, TransferEvent } from './events';
import { decodeTopics } from './utils';

/**
 * Shape of decoded escrow data as stored in Goldsky table rows
 */
interface EscrowEventData {
  map?: Array<{
    key?: { symbol?: string };
    val?: {
      i128?: string;
      u64?: string;
    };
  }>;
}

/**
 * Parses escrow data JSON from a database row
 * @param data - Raw JSON string from the data column
 * @returns Parsed escrow data when valid, otherwise null
 */
function parseEscrowData(data: string | null): EscrowEventData | null {
  if (!data) {
    return null;
  }

  try {
    const parsed = JSON.parse(data) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const value = parsed as EscrowEventData;
    if (!Array.isArray(value.map)) {
      return null;
    }

    return value;
  } catch {
    return null;
  }
}

/**
 * Gets a scalar value from the escrow data map by symbolic key
 * @param data - Decoded escrow payload
 * @param key - Map key name to resolve
 * @returns String value for the key, or null when absent
 */
function getMapVal(data: EscrowEventData, key: string): string | null {
  const item = data.map?.find((entry) => entry.key?.symbol === key);
  if (!item?.val) {
    return null;
  }

  if (typeof item.val.i128 === 'string') {
    return item.val.i128;
  }

  if (typeof item.val.u64 === 'string') {
    return item.val.u64;
  }

  return null;
}

/**
 * Parses a Goldsky escrow row into an internal event shape
 * @param raw - Raw row from the events table
 * @returns Parsed lock/unlock event, or null when the row is not an escrow action
 */
export function parseEscrowEvent(raw: EventRow): EscrowEvent | null {
  const topics = decodeTopics(raw.topics ?? '[]');
  const eventType = topics[1]?.toLowerCase();

  if (eventType !== 'lock' && eventType !== 'unlock') {
    return null;
  }

  const data = parseEscrowData(raw.data);
  if (!data) {
    return null;
  }

  const amount = getMapVal(data, 'amount') ?? '0';
  const claimAfter =
    eventType === 'lock' ? getMapVal(data, 'claim_after') : null;

  return {
    id: raw.id,
    type: eventType,
    account: topics[2] ?? '',
    amount,
    escrowBalance: raw.escrow_balance,
    claimAfter,
    txHash: raw.transaction_hash ?? '',
    ledger: Number(raw.ledger_sequence as unknown),
    ledgerClosedAt: new Date(raw.ledger_closed_at as unknown as string),
  };
}

/**
 * Parses a raw Goldsky transfer row into an internal TransferEvent
 * @param raw - Raw transfer row from the transfers table
 * @returns TransferEvent with all fields mapped
 */
export function parseTransferEvent(raw: TransferRow): TransferEvent {
  return {
    id: raw.id,
    transferType: raw.transfer_type ?? '',
    sender: raw.sender ?? '',
    recipient: raw.recipient ?? '',
    amount: raw.amount !== null ? String(raw.amount as unknown) : '0',
    txHash: raw.transaction_hash ?? '',
    ledger: Number(raw.ledger_sequence as unknown),
    ledgerClosedAt: new Date(raw.ledger_closed_at as unknown as string),
  };
}
