// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { CONFIG } from '../config';

/**
 * Checks if an adapter is enabled and configured to send notifications.
 * @param enabled - Whether the adapter is enabled via config
 * @param hasCredentials - Checks if required credentials are present
 * @returns True if adapter can send notifications
 */
export function checkEnabled(
  enabled: boolean,
  hasCredentials: () => boolean,
): boolean {
  if (!enabled) return false;
  if (CONFIG.DRY_RUN) return true;

  return hasCredentials();
}
