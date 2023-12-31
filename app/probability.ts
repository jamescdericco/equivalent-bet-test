import { Fraction, MathType, add, divide, fraction, number, subtract } from 'mathjs';

/**
 * Formats a given odds as a ratio with a colon separator.
 * 
 * @param odds Fraction Odds to display. Must be > 0.
 * @returns string Odds formatted for display
 */
export function formatOdds(odds: Fraction): string {
  return `${odds.n}:${odds.d}`;
}

/**
 * Returns the midpoint between two numbers (this is the mean of those numbers).
 * @param a MathType
 * @param b MathType
 * @returns midpoint between a and b
 */
export function midpoint(a: MathType, b: MathType): MathType {
  return divide(add(a, b), fraction('2'));
}

/**
 * Converts a probability to odds.
 * 
 * @param p probability to convert
 * @returns odds as a fraction
 */
export function oddsFromProbability(p: MathType): Fraction {
  const odds = divide(p, subtract(fraction('1'), p))
  return odds as Fraction;
}

/**
 * Converts a odds to probability.
 * 
 * @param odds Fraction Odds to convert.
 */
export function probabilityFromOdds(odds: Fraction): Fraction {
  return fraction(odds.n, odds.n + odds.d);
}

/**
 * Simulates an event with the given odds. Returns true if the event occurs.
 * @param odds Odds of the event occurring.
 * @returns boolean true if the event occurs, false otherwise.
 */
export function simulateOdds(odds: Fraction): boolean {
  const p = number(probabilityFromOdds(odds));
  return simulateProbability(p);
}

/**
 * Simulates an event with the given probability. Returns true if the event occurs.
 * @param p Probability of the event occurring.
 * @returns boolean true if the event occurs, false otherwise.
 */
export function simulateProbability(p: number): boolean {
  const r = Math.random();
  return r < p;
}