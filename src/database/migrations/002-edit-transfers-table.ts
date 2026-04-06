// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('transfers')
    .addColumn('processed', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute();

  await db.schema
    .alterTable('transfers')
    .addColumn('unit_price', 'numeric(20, 12)')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('transfers').dropColumn('unit_price').execute();
  await db.schema.alterTable('transfers').dropColumn('processed').execute();
}
