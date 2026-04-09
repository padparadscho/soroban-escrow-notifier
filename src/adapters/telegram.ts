// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { NotifierAdapter } from './index';
import { checkEnabled } from './helpers';
import { CONFIG } from '../config';

/**
 * Telegram notification adapter using Bot API
 */
export class TelegramAdapter implements NotifierAdapter {
  /**
   * Checks if the Telegram adapter is enabled and has valid credentials
   * @returns True if adapter is ready to send notifications
   */
  isEnabled(): boolean {
    return checkEnabled(
      CONFIG.TELEGRAM._ENABLE,
      () => !!(CONFIG.TELEGRAM._BOT_TOKEN && CONFIG.TELEGRAM._CHAT_ID),
    );
  }

  /**
   * Sends a message to Telegram via Bot API
   * @param message - Message text to send
   */
  async send(message: string): Promise<void> {
    if (CONFIG.DRY_RUN) {
      console.log('[DRY RUN] Would have sent to Telegram:', message);
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM._BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM._CHAT_ID,
          text: message,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Telegram sendMessage request failed with status ${String(response.status)}`,
        );
      }
    } catch (error) {
      console.error('Telegram send failed:', error);
      throw error;
    }
  }
}
