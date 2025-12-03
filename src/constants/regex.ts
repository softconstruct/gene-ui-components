/**
 * Regular expression patterns used across the component library
 * All patterns are compiled as RegExp objects for better performance
 */

/**
 * Matches strings containing only digits (0-9)
 * Allows empty string
 * @example
 * DIGITS_ONLY.test("123") // true
 * DIGITS_ONLY.test("12a") // false
 * DIGITS_ONLY.test("")    // true
 */
export const DIGITS_ONLY = /^\d*$/;

export const REGEX = {
    DIGITS_ONLY
} as const;
