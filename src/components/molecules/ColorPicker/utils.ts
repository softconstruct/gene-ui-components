import { RGB, RGBA } from "./ColorPicker";

function rgbToHex(val: RGB | RGBA): string {
    const r = val.r.toString(16).padStart(2, "0");
    const g = val.g.toString(16).padStart(2, "0");
    const b = val.b.toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}

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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export { rgbToHex, hexToRgb, clamp };
