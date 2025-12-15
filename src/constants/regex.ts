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

/**
 * Matches strings that represent a valid, optional negative, integer or decimal number.
 * * Specifically:
 * - Allows an optional leading negative sign ('-').
 * - Allows zero or more digits before the decimal point.
 * - Allows an optional decimal point ('.').
 * - Allows zero or more digits after the decimal point.
 * - Allows the **empty string** ("").
 * * Note: This pattern will match incomplete numeric strings like ".", "-", or "-.".
 *
 * @example
 * NUMERIC_STRING_PATTERN.test("123")    // true
 * NUMERIC_STRING_PATTERN.test("-45.6")  // true
 * NUMERIC_STRING_PATTERN.test(".7")     // true
 * NUMERIC_STRING_PATTERN.test("1.")     // true
 * NUMERIC_STRING_PATTERN.test("")       // true
 * NUMERIC_STRING_PATTERN.test("12a")    // false
 * NUMERIC_STRING_PATTERN.test("1-2")    // false (minus in middle)
 * NUMERIC_STRING_PATTERN.test("--4")    // false (double minus)
 */
export const NUMERIC_STRING_PATTERN = /^-?\d*\.?\d*$/;
