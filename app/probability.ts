import { Fraction } from 'mathjs';

/**
 * Formats a given odds as a ratio with a colon separator.
 * 
 * @param odds Fraction Odds to display. Must be > 0.
 * @returns string Odds formatted for display
 */
export function formatOdds(odds: Fraction): string {
  return `${odds.n}:${odds.d}`;
}