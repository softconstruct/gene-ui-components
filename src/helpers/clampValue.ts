/**
 * Clamps a numeric value to be within the specified minimum and maximum bounds.
 * If the value is undefined, returns an empty string.
 * If the value is not a finite number, returns the original value as a string.
 *
 * @param value - The value to clamp (can be a number or string representation of a number)
 * @param min - The minimum allowed value (optional)
 * @param max - The maximum allowed value (optional)
 * @returns A string representation of the clamped value, or empty string if value is undefined
 * @example
 * clampValue(50, 0, 100)    // "50"
 * clampValue(150, 0, 100)   // "100"
 * clampValue(-10, 0, 100)   // "0"
 * clampValue(50, 0)         // "50"
 * clampValue(50, undefined, 100) // "50"
 * clampValue(undefined)     // ""
 * clampValue("abc")         // "abc" (non-finite, returns as-is)
 */
const clampValue = (value?: number | string, min?: number, max?: number): string => {
    if (value === undefined) return "";
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return String(value);

    let clamped = numericValue;
    if (min !== undefined && clamped < min) {
        clamped = min;
    }
    if (max !== undefined && clamped > max) {
        clamped = max;
    }
    return String(clamped);
};

export default clampValue;
