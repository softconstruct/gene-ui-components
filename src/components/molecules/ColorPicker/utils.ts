import { RGB, RGBA } from "./types";

/**
 * Converts an RGB or RGBA color object to a 6-character HEX string.
 * Note: This function currently drops the alpha channel in the output string.
 * * @param val - The RGB or RGBA object to convert.
 * @returns A formatted HEX string (e.g., "#ffffff").
 */
function rgbToHex(val: RGB | RGBA): string {
    const r = val.r.toString(16).padStart(2, "0");
    const g = val.g.toString(16).padStart(2, "0");
    const b = val.b.toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}

/**
 * Parses a HEX color string and converts it to an RGB object.
 * Supports both shorthand (e.g., "#03F") and full (e.g., "#0033FF") HEX formats.
 * * @param hex - The HEX string to parse.
 * @returns An object containing `r`, `g`, and `b` numeric values, or `null` if the input is invalid.
 */
function hexToRgb(hex: string) {
    // First, expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    // Then run your normal 6-digit check
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);

    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

/**
 * Restricts a given number to remain within a defined minimum and maximum range.
 * * @param value - The numerical value to evaluate.
 * @param min - The lower boundary.
 * @param max - The upper boundary.
 * @returns The clamped value.
 */
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export { rgbToHex, hexToRgb, clamp };
