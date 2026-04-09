// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { NotifierAdapter } from './index';
import { checkEnabled } from './helpers';
import { CONFIG } from '../config';

/**
 * Discord notification adapter using webhooks
 */
export class DiscordAdapter implements NotifierAdapter {
  /**
   * Checks if the Discord adapter is enabled and has valid credentials
   * @returns True if adapter is ready to send notifications
   */
  isEnabled(): boolean {
    return checkEnabled(
      CONFIG.DISCORD._ENABLE,
      () => !!CONFIG.DISCORD._WEBHOOK_URL,
    );
  }

  /**
   * Sends a message to Discord via webhook
   * @param message - Message text to send
   */
  async send(message: string): Promise<void> {
    if (CONFIG.DRY_RUN) {
      console.log('[DRY RUN] Would have sent to Discord:', message);
      return;
    }

    try {
      const response = await fetch(CONFIG.DISCORD._WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error(
          `Discord webhook request failed with status ${String(response.status)}`,
        );
      }
    } catch (error) {
      console.error('Discord send failed:', error);
      throw error;
    }
  }
}
