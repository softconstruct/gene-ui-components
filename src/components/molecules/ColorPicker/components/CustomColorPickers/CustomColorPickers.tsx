import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import { RGBA } from "@components/molecules/ColorPicker/types";

import "./CustomColorPickers.scss";

import { hexToRgb, rgbToHex } from "../../utils";

// ============================================================================
// Interfaces & Types
// ============================================================================

/**
 * Configuration properties for the HexColorPicker component.
 */
export interface IHexColorPickerProps {
    /** The currently selected color in HEX format (e.g., "#ff0000"). */
    color: string;
    /** Callback triggered when the user modifies the color. */
    onChange: (color: string) => void;
}

/**
 * Configuration properties for the RgbaColorPicker component.
 */
export interface IRgbaColorPickerProps {
    /** The currently selected color in RGBA object format. */
    color: RGBA;
    /** Callback triggered when the user modifies the color or opacity. */
    onChange: (color: RGBA) => void;
}

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

// ============================================================================
// Color Mathematics Utilities
// ============================================================================

/**
 * Converts standard RGB channel values (0-255) into the HSV color space.
 * * @param red - The red channel value.
 * @param green - The green channel value.
 * @param blue - The blue channel value.
 * @returns An object containing the corresponding Hue, Saturation, and Value.
 */
const convertRgbToHsv = (red: number | string, green: number | string, blue: number | string): IHsvColor => {
    const redNormalized = Number(red) / 255;
    const greenNormalized = Number(green) / 255;
    const blueNormalized = Number(blue) / 255;

    const channelMax = Math.max(redNormalized, greenNormalized, blueNormalized);
    const channelMin = Math.min(redNormalized, greenNormalized, blueNormalized);
    const channelDelta = channelMax - channelMin;

    let hue = 0;

    if (channelDelta !== 0) {
        if (channelMax === redNormalized) {
            hue = 60 * (((greenNormalized - blueNormalized) / channelDelta) % 6);
        } else if (channelMax === greenNormalized) {
            hue = 60 * ((blueNormalized - redNormalized) / channelDelta + 2);
        } else {
            hue = 60 * ((redNormalized - greenNormalized) / channelDelta + 4);
        }
    }

    // Ensure hue is always a positive degree
    if (hue < 0) {
        hue += 360;
    }

    const saturation = channelMax === 0 ? 0 : channelDelta / channelMax;
    const value = channelMax;

    return { hue, saturation, value };
};

/**
 * Converts an HSV color representation back into standard RGB (0-255) channels.
 * * @param hue - The hue degree (0-360).
 * @param saturation - The saturation level (0-1).
 * @param value - The brightness value (0-1).
 * @returns An object containing the `r`, `g`, and `b` values mapped for the RGBA type.
 */
const convertHsvToRgb = (hue: number, saturation: number, value: number) => {
    const chroma = value * saturation;
    const hueSector = hue / 60;
    const intermediateValue = chroma * (1 - Math.abs((hueSector % 2) - 1));
    const lightnessAdjustment = value - chroma;

    let tempRed = 0;
    let tempGreen = 0;
    let tempBlue = 0;

    if (hueSector >= 0 && hueSector < 1) {
        [tempRed, tempGreen, tempBlue] = [chroma, intermediateValue, 0];
    } else if (hueSector >= 1 && hueSector < 2) {
        [tempRed, tempGreen, tempBlue] = [intermediateValue, chroma, 0];
    } else if (hueSector >= 2 && hueSector < 3) {
        [tempRed, tempGreen, tempBlue] = [0, chroma, intermediateValue];
    } else if (hueSector >= 3 && hueSector < 4) {
        [tempRed, tempGreen, tempBlue] = [0, intermediateValue, chroma];
    } else if (hueSector >= 4 && hueSector < 5) {
        [tempRed, tempGreen, tempBlue] = [intermediateValue, 0, chroma];
    } else {
        [tempRed, tempGreen, tempBlue] = [chroma, 0, intermediateValue];
    }

    return {
        r: Math.round((tempRed + lightnessAdjustment) * 255),
        g: Math.round((tempGreen + lightnessAdjustment) * 255),
        b: Math.round((tempBlue + lightnessAdjustment) * 255)
    };
};

// ============================================================================
// Custom DOM Hooks
// ============================================================================

/**
 * A highly optimized hook that tracks the physical dimensions of a DOM element.
 * Utilizes `ResizeObserver` for modern browsers with a standard event listener fallback.
 * * @param elementRef - A React ref attached to the target HTML element.
 * @returns An object containing the `width` and `height` of the element in pixels.
 */
const useElementDimensions = (elementRef: React.RefObject<HTMLElement>) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const targetElement = elementRef.current;
        if (!targetElement) return;

        const updateDimensions = () => {
            const boundingClientRect = targetElement.getBoundingClientRect();
            setDimensions({
                width: Math.round(boundingClientRect.width),
                height: Math.round(boundingClientRect.height)
            });
        };

        // Perform initial measurement
        updateDimensions();

        if (typeof ResizeObserver !== "undefined") {
            const resizeObserver = new ResizeObserver(updateDimensions);
            resizeObserver.observe(targetElement);
            // eslint-disable-next-line consistent-return
            return () => resizeObserver.disconnect();
        }

        window.addEventListener("resize", updateDimensions);
        // eslint-disable-next-line consistent-return
        return () => window.removeEventListener("resize", updateDimensions);
    }, [elementRef]);

    return dimensions;
};

/**
 * A specialized hook to handle drag-and-drop pointer calculations across palettes and sliders.
 * Employs the "latest-ref" pattern to guarantee 60fps tracking without triggering React re-renders.
 * * @param elementRef - The HTML element acting as the drag boundary (e.g., the slider track).
 * @param onDragChange - Callback providing the relative X and Y positions (normalized between 0 and 1).
 * @returns A mouse/touch event handler to attach to the `onMouseDown` and `onTouchStart` props.
 */
const usePointerDrag = (
    elementRef: React.RefObject<HTMLElement>,
    onDragChange: (relativeHorizontalPos: number, relativeVerticalPos: number) => void
) => {
    // Store the latest callback in a ref to avoid stale closures during rapid drag events
    const latestOnChangeRef = useRef(onDragChange);

    useEffect(() => {
        latestOnChangeRef.current = onDragChange;
    }, [onDragChange]);

    return useCallback(
        (interactionEvent: React.MouseEvent | React.TouchEvent) => {
            interactionEvent.preventDefault();

            const targetElement = elementRef.current;
            if (!targetElement) return;

            const calculateAndEmitPosition = (clientX: number, clientY: number) => {
                const boundingBox = targetElement.getBoundingClientRect();

                // Clamp coordinates to ensure the pointer stays within the element boundaries
                const boundedX = Math.min(Math.max(clientX - boundingBox.left, 0), boundingBox.width);
                const boundedY = Math.min(Math.max(clientY - boundingBox.top, 0), boundingBox.height);

                // Normalize the pixel coordinates into a 0 to 1 scale
                const relativeHorizontalPos = boundingBox.width === 0 ? 0 : boundedX / boundingBox.width;
                const relativeVerticalPos = boundingBox.height === 0 ? 0 : boundedY / boundingBox.height;

                latestOnChangeRef.current(relativeHorizontalPos, relativeVerticalPos);
            };

            const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
                if ("touches" in moveEvent) {
                    const activeTouch = moveEvent.touches[0];
                    if (activeTouch) {
                        calculateAndEmitPosition(activeTouch.clientX, activeTouch.clientY);
                    }
                } else {
                    const mouseEvent = moveEvent as MouseEvent;
                    calculateAndEmitPosition(mouseEvent.clientX, mouseEvent.clientY);
                }
            };

            const handlePointerUp = () => {
                window.removeEventListener("mousemove", handlePointerMove);
                window.removeEventListener("touchmove", handlePointerMove);
                window.removeEventListener("mouseup", handlePointerUp);
                window.removeEventListener("touchend", handlePointerUp);
            };

            // Attach global listeners so dragging continues even if the mouse leaves the element bounds
            window.addEventListener("mousemove", handlePointerMove);
            window.addEventListener("touchmove", handlePointerMove, { passive: false });
            window.addEventListener("mouseup", handlePointerUp);
            window.addEventListener("touchend", handlePointerUp);

            // Trigger the initial position immediately on click/tap
            if ("touches" in interactionEvent) {
                const initialTouch = interactionEvent.touches[0];
                if (initialTouch) {
                    calculateAndEmitPosition(initialTouch.clientX, initialTouch.clientY);
                }
            } else {
                const initialMouseEvent = interactionEvent as React.MouseEvent;
                calculateAndEmitPosition(initialMouseEvent.clientX, initialMouseEvent.clientY);
            }
        },
        [elementRef]
    );
};

// ============================================================================
// Interactive Sub-Components
// ============================================================================

/** * Interactive 2D Box for selecting Saturation (X-axis) and Value/Brightness (Y-axis).
 */
const SaturationBrightnessPalette: FC<{ hsv: IHsvColor; onChange: (saturation: number, value: number) => void }> = ({
    hsv,
    onChange
}) => {
    const paletteRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(paletteRef);

    const handleDrag = usePointerDrag(paletteRef, (horizontalPos, verticalPos) => {
        // Horizontal drag changes Saturation (0 to 1). Vertical drag changes Value/Brightness (1 to 0).
        onChange(horizontalPos, 1 - verticalPos);
    });

    const pointerRadiusPx = 7;

    // Calculate exact pixel position if dimensions are known, otherwise fallback to percentage
    const pointerLeftPosition =
        dimensions.width > 0
            ? `${pointerRadiusPx + hsv.saturation * (dimensions.width - 2 * pointerRadiusPx)}px`
            : `${hsv.saturation * 100}%`;

    const pointerTopPosition =
        dimensions.height > 0
            ? `${pointerRadiusPx + (1 - hsv.value) * (dimensions.height - 2 * pointerRadiusPx)}px`
            : `${(1 - hsv.value) * 100}%`;

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className="colorPalette__saturation"
            ref={paletteRef}
            onMouseDown={handleDrag}
            onTouchStart={handleDrag}
            style={{
                backgroundImage: `linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsl(${hsv.hue}, 100%, 50%))`
            }}
        >
            <div
                className="colorPalette__saturationPointer"
                style={{ left: pointerLeftPosition, top: pointerTopPosition }}
            />
        </div>
    );
};

/** * Interactive horizontal slider for selecting the base Hue degree.
 */
const HueSlider: FC<{ hueDegree: number; onChange: (hue: number) => void }> = ({ hueDegree, onChange }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(sliderRef);

    const handleDrag = usePointerDrag(sliderRef, (horizontalPos) => {
        // Map the 0-1 horizontal position to a 0-360 degree hue value
        onChange(horizontalPos * 360);
    });

    const pointerRadiusPx = 5;
    const pointerLeftPosition =
        dimensions.width > 0
            ? `${pointerRadiusPx + (hueDegree / 360) * (dimensions.width - 2 * pointerRadiusPx)}px`
            : `${(hueDegree / 360) * 100}%`;

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className="colorPalette__hue"
            ref={sliderRef}
            onMouseDown={handleDrag}
            onTouchStart={handleDrag}
            style={{ backgroundImage: "linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)" }}
        >
            <div className="colorPalette__huePointer" style={{ left: pointerLeftPosition }} />
        </div>
    );
};

/** * Interactive horizontal slider for selecting Alpha (Opacity) levels.
 */
const AlphaSlider: FC<{
    opacityLevel: number;
    baseRgb: { r: number; g: number; b: number };
    onChange: (alpha: number) => void;
}> = ({ opacityLevel, baseRgb, onChange }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(sliderRef);

    const handleDrag = usePointerDrag(sliderRef, (horizontalPos) => {
        onChange(horizontalPos);
    });

    const pointerRadiusPx = 5;
    const pointerLeftPosition =
        dimensions.width > 0
            ? `${pointerRadiusPx + opacityLevel * (dimensions.width - 2 * pointerRadiusPx)}px`
            : `${opacityLevel * 100}%`;

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div className="colorPalette__alpha" ref={sliderRef} onMouseDown={handleDrag} onTouchStart={handleDrag}>
            <div
                className="colorPalette__alphaGradient"
                style={{
                    backgroundImage: `linear-gradient(90deg, rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0) 0%, rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 1) 100%)`
                }}
            />
            <div className="colorPalette__alphaPointer" style={{ left: pointerLeftPosition }} />
        </div>
    );
};

// ============================================================================
// Main Export Components
// ============================================================================

/**
 * A standard color picker that handles Hue and Saturation/Brightness,
 * outputting a solid HEX string.
 */
export const HexColorPicker: FC<IHexColorPickerProps> = ({ color, onChange }) => {
    // Initialize internal state using the provided HEX string
    const [hsvColor, setHsvColor] = useState<IHsvColor>(() => {
        const rgbColor = hexToRgb(color) ?? { r: 255, g: 255, b: 255 };
        return convertRgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);
    });

    // Synchronize external color prop changes to local HSV state.
    // This strict equality check prevents the visual slider pointers from jumping
    // when a user inputs a lossless color (like Black, which loses Hue data).
    useEffect(() => {
        const newRgb = hexToRgb(color);
        if (!newRgb) return;

        setHsvColor((currentHsv) => {
            const currentRgb = convertHsvToRgb(currentHsv.hue, currentHsv.saturation, currentHsv.value);

            const isIdenticalColor =
                newRgb.r === currentRgb.r && newRgb.g === currentRgb.g && newRgb.b === currentRgb.b;
            if (isIdenticalColor) return currentHsv;

            return convertRgbToHsv(newRgb.r, newRgb.g, newRgb.b);
        });
    }, [color]);

    const handleSaturationBrightnessChange = useCallback(
        (saturation: number, value: number) => {
            setHsvColor((previousHsv) => {
                const updatedHsv = { ...previousHsv, saturation, value };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange(rgbToHex(resultingRgb));
                return updatedHsv;
            });
        },
        [onChange]
    );

    const handleHueChange = useCallback(
        (hueDegree: number) => {
            setHsvColor((previousHsv) => {
                const updatedHsv = { ...previousHsv, hue: hueDegree };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange(rgbToHex(resultingRgb));
                return updatedHsv;
            });
        },
        [onChange]
    );

    return (
        <div className="colorPalette">
            <SaturationBrightnessPalette hsv={hsvColor} onChange={handleSaturationBrightnessChange} />
            <HueSlider hueDegree={hsvColor.hue} onChange={handleHueChange} />
        </div>
    );
};

/**
 * An advanced color picker that handles Hue, Saturation/Brightness, and Opacity,
 * outputting a mapped RGBA object.
 */
export const RgbaColorPicker: FC<IRgbaColorPickerProps> = ({ color, onChange }) => {
    const [hsvColor, setHsvColor] = useState<IHsvColor>(() => convertRgbToHsv(color.r, color.g, color.b));
    const [opacityLevel, setOpacityLevel] = useState<number>(color.a ?? 1);

    // Synchronize external RGBA prop changes
    useEffect(() => {
        setHsvColor((currentHsv) => {
            const currentRgb = convertHsvToRgb(currentHsv.hue, currentHsv.saturation, currentHsv.value);

            const isIdenticalColor = color.r === currentRgb.r && color.g === currentRgb.g && color.b === currentRgb.b;
            if (isIdenticalColor) return currentHsv;

            return convertRgbToHsv(color.r, color.g, color.b);
        });
        setOpacityLevel(color.a ?? 1);
    }, [color]);

    const handleSaturationBrightnessChange = useCallback(
        (saturation: number, value: number) => {
            setHsvColor((previousHsv) => {
                const updatedHsv = { ...previousHsv, saturation, value };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange({ ...resultingRgb, a: opacityLevel });
                return updatedHsv;
            });
        },
        [onChange, opacityLevel]
    );

    const handleHueChange = useCallback(
        (hueDegree: number) => {
            setHsvColor((previousHsv) => {
                const updatedHsv = { ...previousHsv, hue: hueDegree };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange({ ...resultingRgb, a: opacityLevel });
                return updatedHsv;
            });
        },
        [onChange, opacityLevel]
    );

    const handleAlphaChange = useCallback(
        (newOpacity: number) => {
            setOpacityLevel(newOpacity);
            const resultingRgb = convertHsvToRgb(hsvColor.hue, hsvColor.saturation, hsvColor.value);
            onChange({ ...resultingRgb, a: newOpacity });
        },
        [onChange, hsvColor]
    );

    const currentBaseRgb = convertHsvToRgb(hsvColor.hue, hsvColor.saturation, hsvColor.value);

    return (
        <div className="colorPalette">
            <SaturationBrightnessPalette hsv={hsvColor} onChange={handleSaturationBrightnessChange} />
            <HueSlider hueDegree={hsvColor.hue} onChange={handleHueChange} />
            <AlphaSlider opacityLevel={opacityLevel} baseRgb={currentBaseRgb} onChange={handleAlphaChange} />
        </div>
    );
};
