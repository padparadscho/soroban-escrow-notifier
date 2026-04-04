// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import {
  Account,
  Address,
  Contract,
  Keypair,
  nativeToScVal,
  rpc,
  scValToNative,
  TransactionBuilder,
  TimeoutInfinite,
  xdr,
} from '@stellar/stellar-sdk';
import { CONFIG } from '../config';

const dummyKeypair = Keypair.random();

type TopicField = {
  symbol?: string;
  address?: string;
};

/**
 * Parses Goldsky topic JSON into plain topic strings
 * @param topicsJson - JSON string representing ordered topic fields
 * @returns Topic values in order (namespace, action, account)
 */
export function decodeTopics(topicsJson: string): string[] {
  const topics = JSON.parse(topicsJson) as unknown[];
  return topics.map((topic: unknown) => {
    if (typeof topic === 'string') {
      return topic;
    }

    const value = topic as TopicField;
    if (typeof value.symbol === 'string') {
      return value.symbol;
    }

    if (typeof value.address === 'string') {
      return value.address;
    }

    return '';
  });
}

/**
 * Queries the SHx balance held by the escrow contract
 * @returns Balance as string (i128), or "0" if not configured or query fails
 */
export async function getEscrowBalance(): Promise<string> {
  if (!CONFIG.STELLAR_ASSET_CONTRACT_ID || !CONFIG.SOROBAN_RPC_URL) {
    return '0';
  }

  const server = new rpc.Server(CONFIG.SOROBAN_RPC_URL);
  const source = new Account(dummyKeypair.publicKey(), '0');
  const asset = new Contract(CONFIG.STELLAR_ASSET_CONTRACT_ID);

  const op = asset.call(
    'balance',
    nativeToScVal(new Address(CONFIG.SOROBAN_ESCROW_CONTRACT_ID)),
  );

  const tx = new TransactionBuilder(source, {
    fee: '100',
    networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(TimeoutInfinite)
    .build();

  const response = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationSuccess(response) && response.result) {
    const resultVal = response.result.retval as unknown as xdr.ScVal;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return scValToNative(resultVal).toString() as string;
  }
  return '0';
}
