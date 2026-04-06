// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * NOTES: Needs a more dedicated amount formatting function to handle decimals and token units
 */

/**
 * Formats a Stellar address
 * @param address - Full Stellar address
 * @returns Shortened address (e.g., "GABC...DEFG")
 */
export function formatAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Formats a raw amount for display
 * @param amount - Raw amount as a string (e.g., "1000000000")
 * @returns Localized formatted amount string (e.g., "100")
 */
export function formatAmount(amount: string): string {
  const rawAmount = BigInt(amount);
  const divisor = BigInt(10_000_000); // 10^7 for 7 decimal places

  const value = rawAmount / divisor;
  return value.toLocaleString();
}

/**
 * Formats a raw amount into USD using the provided unit price
 * @param amount - Raw amount as a string (e.g., "1000000000")
 * @param unitPrice - Price per unit in USD as a string (e.g., "0.05")
 * @returns Formatted USD string (e.g., "$5.00", "$1.2K", "$3.4M")
 */
export function formatPrice(amount: string, unitPrice: string): string {
  const units = Number(BigInt(amount)) / 10_000_000;
  const price = units * Number(unitPrice);

  if (price >= 1_000_000_000) return `$${(price / 1_000_000_000).toFixed(2)}B`;
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(2)}K`;

  return `$${price.toFixed(2)}`;
}

/**
 * Formats a Unix timestamp to a localized date+time string in UTC
 * @param date - Unix timestamp (in milliseconds)
 * @returns Formatted date+time string (e.g., "Mar 24, 2026, 00:00 UTC")
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
}

/**
 * Transforms text into Unicode mathematical bold characters
 * @param text - Input string to boldify
 * @returns Bold transformed string
 */
export function toBold(text: string): string {
  return text
    .split('')
    .map((char) => {
      const n = char.charCodeAt(0);
      // Map to Mathematical Bold Capital Letters (U+1D400-U+1D419)
      if (n >= 65 && n <= 90) return String.fromCodePoint(0x1d400 + (n - 65));
      // Map to Mathematical Bold Small Letters (U+1D41A-U+1D433)
      if (n >= 97 && n <= 122) return String.fromCodePoint(0x1d41a + (n - 97));
      // Map to Mathematical Bold Digits (U+1D7CE-U+1D7D7)
      if (n >= 48 && n <= 57) return String.fromCodePoint(0x1d7ce + (n - 48));
      return char;
    })
    .join('');
}

// (Optional) Uncomment to enable italic text styling
// /**
//  * Transforms text into Unicode mathematical italic characters
//  * @param text - Input string to italicize
//  * @returns Italic-transformed string
//  */
// export function toItalic(text: string): string {
//   return text
//     .split('')
//     .map((char) => {
//       const n = char.charCodeAt(0);
//       // Map to Mathematical Italic Capital Letters (U+1D434-U+1D44D)
//       if (n >= 65 && n <= 90) return String.fromCodePoint(0x1d434 + (n - 65));
//       // Map to Mathematical Italic Small Letters (U+1D44E-U+1D467)
//       if (n >= 97 && n <= 122) return String.fromCodePoint(0x1d44e + (n - 97));
//       // Digits do not have italic Unicode equivalents; return as is
//       return char;
//     })
//     .join('');
// }
