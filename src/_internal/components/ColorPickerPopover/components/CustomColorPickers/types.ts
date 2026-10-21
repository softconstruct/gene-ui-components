/**
 * Internal representation of a color in the HSV (Hue, Saturation, Value) color space.
 * This format is mathematically required to accurately calculate 2D palette coordinates.
 */
export interface IHsvColor {
    /** The hue degree on the color wheel (Range: 0 - 360). */
    hue: number;
    /** The saturation level (Range: 0 - 1). */
    saturation: number;
    /** The brightness/value level (Range: 0 - 1). */
    value: number;
}
