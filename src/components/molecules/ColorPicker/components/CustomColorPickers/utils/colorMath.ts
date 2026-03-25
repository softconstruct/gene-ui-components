import { IHsvColor } from "../../../types";
import {
    HUE_BLUE_SECTOR_OFFSET,
    HUE_DEGREES_PER_SECTOR,
    HUE_GREEN_SECTOR_OFFSET,
    HUE_MAX_DEGREES,
    HUE_SECTORS_TOTAL,
    RGB_MAX_CHANNEL_VALUE
} from "../constants";

/**
 * Converts standard RGB channel values (0-255) into the HSV color space.
 * @param red - The red channel value.
 * @param green - The green channel value.
 * @param blue - The blue channel value.
 * @returns An object containing the corresponding Hue, Saturation, and Value.
 */
export const convertRgbToHsv = (red: number | string, green: number | string, blue: number | string): IHsvColor => {
    // Normalize RGB channels to a 0-1 scale
    const redNormalized = Number(red) / RGB_MAX_CHANNEL_VALUE;
    const greenNormalized = Number(green) / RGB_MAX_CHANNEL_VALUE;
    const blueNormalized = Number(blue) / RGB_MAX_CHANNEL_VALUE;

    const channelMax = Math.max(redNormalized, greenNormalized, blueNormalized);
    const channelMin = Math.min(redNormalized, greenNormalized, blueNormalized);
    const channelDelta = channelMax - channelMin;

    let hue = 0;

    if (channelDelta !== 0) {
        if (channelMax === redNormalized) {
            hue = HUE_DEGREES_PER_SECTOR * (((greenNormalized - blueNormalized) / channelDelta) % HUE_SECTORS_TOTAL);
        } else if (channelMax === greenNormalized) {
            hue = HUE_DEGREES_PER_SECTOR * ((blueNormalized - redNormalized) / channelDelta + HUE_GREEN_SECTOR_OFFSET);
        } else {
            hue = HUE_DEGREES_PER_SECTOR * ((redNormalized - greenNormalized) / channelDelta + HUE_BLUE_SECTOR_OFFSET);
        }
    }

    if (hue < 0) {
        hue += HUE_MAX_DEGREES;
    }

    const saturation = channelMax === 0 ? 0 : channelDelta / channelMax;
    return { hue, saturation, value: channelMax };
};

/**
 * Converts an HSV color representation back into standard RGB (0-255) channels.
 * @param hue - The hue degree (0-360).
 * @param saturation - The saturation level (0-1).
 * @param value - The brightness value (0-1).
 * @returns An object containing the mapped `r`, `g`, and `b` values.
 */
export const convertHsvToRgb = (hue: number, saturation: number, value: number) => {
    const chroma = value * saturation;
    const hueSector = hue / HUE_DEGREES_PER_SECTOR; // Determines which of the 6 color sectors the hue falls into

    // Calculates the intermediate value for the secondary color channel
    const intermediateValue = chroma * (1 - Math.abs((hueSector % 2) - 1));
    const lightnessAdjustment = value - chroma;

    let tempRed = 0;
    let tempGreen = 0;
    let tempBlue = 0;

    if (hueSector >= 0 && hueSector < 1) [tempRed, tempGreen, tempBlue] = [chroma, intermediateValue, 0];
    else if (hueSector >= 1 && hueSector < 2) [tempRed, tempGreen, tempBlue] = [intermediateValue, chroma, 0];
    else if (hueSector >= 2 && hueSector < 3) [tempRed, tempGreen, tempBlue] = [0, chroma, intermediateValue];
    else if (hueSector >= 3 && hueSector < 4) [tempRed, tempGreen, tempBlue] = [0, intermediateValue, chroma];
    else if (hueSector >= 4 && hueSector < 5) [tempRed, tempGreen, tempBlue] = [intermediateValue, 0, chroma];
    else [tempRed, tempGreen, tempBlue] = [chroma, 0, intermediateValue];

    return {
        r: Math.round((tempRed + lightnessAdjustment) * RGB_MAX_CHANNEL_VALUE),
        g: Math.round((tempGreen + lightnessAdjustment) * RGB_MAX_CHANNEL_VALUE),
        b: Math.round((tempBlue + lightnessAdjustment) * RGB_MAX_CHANNEL_VALUE)
    };
};
