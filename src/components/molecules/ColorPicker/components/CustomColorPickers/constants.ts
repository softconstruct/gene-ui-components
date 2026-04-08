/**
 * Visual constants for the CustomColorPickers elements.
 */

/** The radius (in pixels) of the pointer inside the 2D Saturation/Brightness palette. */
export const SATURATION_POINTER_RADIUS_PX = 7;

/** The radius (in pixels) of the pointers inside the Hue and Alpha horizontal sliders. */
export const SLIDER_POINTER_RADIUS_PX = 5;

/** The maximum value for an 8-bit RGB color channel (0-255). */
export const RGB_MAX_CHANNEL_VALUE = 255;

/** The maximum degrees on the Hue color wheel. */
export const HUE_MAX_DEGREES = 360;

/** The Hue color wheel is divided into 6 sectors (Red, Yellow, Green, Cyan, Blue, Magenta). */
export const HUE_SECTORS_TOTAL = 6;

/** Each sector on the Hue color wheel spans exactly 60 degrees (360 / 6). */
export const HUE_DEGREES_PER_SECTOR = 60;

/** The sector offset used when Green is the dominant color channel. */
export const HUE_GREEN_SECTOR_OFFSET = 2;

/** The sector offset used when Blue is the dominant color channel. */
export const HUE_BLUE_SECTOR_OFFSET = 4;
