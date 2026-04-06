// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('events')
    .addColumn('processed', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();

  await db.schema
    .alterTable('events')
    .addColumn('escrow_balance', 'varchar(50)')
    .execute();

  await db.schema
    .alterTable('events')
    .addColumn('unit_price', 'numeric(20, 12)')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('events').dropColumn('unit_price').execute();
  await db.schema.alterTable('events').dropColumn('escrow_balance').execute();
  await db.schema.alterTable('events').dropColumn('processed').execute();
}
