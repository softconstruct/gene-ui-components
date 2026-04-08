/**
 * Represents a color in the RGB (Red, Green, Blue) color space.
 */
export interface RGB {
    /** The red channel value (0-255). */
    r: number | string;
    /** The green channel value (0-255). */
    g: number | string;
    /** The blue channel value (0-255). */
    b: number | string;
}

/**
 * Represents a color in the RGBA (Red, Green, Blue, Alpha) color space.
 * Extends the basic `RGB` interface to include transparency.
 */
export interface RGBA extends RGB {
    /** The alpha channel value representing opacity, scaled from 0 (transparent) to 1 (opaque). */
    a: number;
}

/**
 * The preferred color syntax format to display in the input fields.
 */
export type ColorFormat = "rgb" | "hex";

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
