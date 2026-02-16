import { RGB, RGBA } from "./ColorPicker";

function rgbToHex(val: RGB | RGBA): string {
    const r = val.r.toString(16).padStart(2, "0");
    const g = val.g.toString(16).padStart(2, "0");
    const b = val.b.toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}

function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

export { rgbToHex, hexToRgb };
