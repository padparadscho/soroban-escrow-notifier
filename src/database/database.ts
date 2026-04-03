// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import 'dotenv/config';
import { DB } from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL has not been set!');
}

const { Pool } = pg;

/**
 * Kysely database instance connected to Neon PostgreSQL
 */
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});
