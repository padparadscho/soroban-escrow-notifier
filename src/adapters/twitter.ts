// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import { TwitterApi } from 'twitter-api-v2';
import type { NotifierAdapter } from './index';
import { CONFIG } from '../config';

/**
 * Twitter notification adapter using twitter-api-v2
 */
export class TwitterAdapter implements NotifierAdapter {
  private client: TwitterApi | null = null;

  /**
   * Checks if the Twitter adapter is enabled and has valid credentials
   * @returns True if adapter is ready to send notifications
   */
  isEnabled(): boolean {
    if (!CONFIG.TWITTER._ENABLE) {
      return false;
    }

    // Allow dry-run without requiring Twitter credentials
    if (CONFIG.DRY_RUN) {
      return true;
    }

    return !!(
      CONFIG.TWITTER._APP_KEY &&
      CONFIG.TWITTER._APP_SECRET &&
      CONFIG.TWITTER._ACCESS_TOKEN &&
      CONFIG.TWITTER._ACCESS_SECRET
    );
  }

  /**
   * Creates or returns the Twitter API client
   * @returns TwitterApi instance
   */
  private getClient(): TwitterApi {
    if (!this.client) {
      this.client = new TwitterApi({
        appKey: CONFIG.TWITTER._APP_KEY,
        appSecret: CONFIG.TWITTER._APP_SECRET,
        accessToken: CONFIG.TWITTER._ACCESS_TOKEN,
        accessSecret: CONFIG.TWITTER._ACCESS_SECRET,
      });
    }
    return this.client;
  }

  /**
   * Sends a tweet to Twitter via app API
   * @param message - Message text to send
   */
  async send(message: string): Promise<void> {
    if (CONFIG.DRY_RUN) {
      console.log('[DRY RUN] Would have tweeted:', message);
      return;
    }

    const client = this.getClient();

    try {
      await client.v2.tweet(message);
    } catch (error) {
      console.error('Twitter send failed:', error);
      throw error;
    }
  }
}
