// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Interface for platform notification adapters
 */
export interface NotifierAdapter {
  /**
   * Sends a notification message to the platform
   * @param message - The message text to send
   * @returns Promise that resolves when sent
   */
  send(message: string): Promise<void>;

  /**
   * Checks if the adapter is enabled and configured
   * @returns True if adapter is ready to send notifications
   */
  isEnabled(): boolean;
}

export { TwitterAdapter } from './twitter';
export { DiscordAdapter } from './discord';
export { TelegramAdapter } from './telegram';
