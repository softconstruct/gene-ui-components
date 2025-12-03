import { DIGITS_ONLY } from "../constants";

/**
 * Validates if a string contains only digits (0-9)
 * Allows empty string
 * @param value - The string to validate
 * @returns true if the string contains only digits, false otherwise
 * @example
 * allowOnlyDigits("123") // true
 * allowOnlyDigits("12a") // false
 * allowOnlyDigits("")    // true
 */
const allowOnlyDigits = (value: string): boolean => DIGITS_ONLY.test(value);

export default allowOnlyDigits;
