import React, { FC, KeyboardEvent, useRef } from "react";

import { IHsvColor } from "../../../types";
import { SATURATION_POINTER_RADIUS_PX } from "../constants";
import { useElementDimensions } from "../hooks/useElementDimensions";
import { usePointerDrag } from "../hooks/usePointerDrag";

interface ISaturationBrightnessPaletteProps {
    hsv: IHsvColor;
    onChange: (saturation: number, value: number) => void;
    isColorEmpty?: boolean;
}

const KEYBOARD_STEP = 0.05;

export const SaturationBrightnessPalette: FC<ISaturationBrightnessPaletteProps> = ({
    hsv,
    onChange,
    isColorEmpty = false
}) => {
    const paletteRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(paletteRef);

    const handleDrag = usePointerDrag(paletteRef, (horizontalPos, verticalPos) => {
        onChange(horizontalPos, 1 - verticalPos);
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let newSaturation = hsv.saturation;
        let newValue = hsv.value;
        let handled = false;

        switch (e.key) {
            case "ArrowRight":
                newSaturation = Math.min(1, hsv.saturation + KEYBOARD_STEP);
                handled = true;
                break;
            case "ArrowLeft":
                newSaturation = Math.max(0, hsv.saturation - KEYBOARD_STEP);
                handled = true;
                break;
            case "ArrowUp":
                newValue = Math.min(1, hsv.value + KEYBOARD_STEP);
                handled = true;
                break;
            case "ArrowDown":
                newValue = Math.max(0, hsv.value - KEYBOARD_STEP);
                handled = true;
                break;
            default:
                break;
        }

        if (handled) {
            e.preventDefault();
            onChange(newSaturation, newValue);
        }
    };

    const pointerLeftPosition =
        dimensions.width > 0
            ? `${SATURATION_POINTER_RADIUS_PX + hsv.saturation * (dimensions.width - 2 * SATURATION_POINTER_RADIUS_PX)}px`
            : `${hsv.saturation * 100}%`;

    const pointerTopPosition =
        dimensions.height > 0
            ? `${SATURATION_POINTER_RADIUS_PX + (1 - hsv.value) * (dimensions.height - 2 * SATURATION_POINTER_RADIUS_PX)}px`
            : `${(1 - hsv.value) * 100}%`;

    return (
        <div
            className="colorPalette__saturation"
            ref={paletteRef}
            role="slider"
            tabIndex={0}
            onMouseDown={handleDrag}
            onTouchStart={handleDrag}
            onKeyDown={handleKeyDown}
            aria-label="Color saturation and brightness picker"
            aria-valuenow={Math.round(hsv.saturation * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
                backgroundImage: `linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsl(${hsv.hue}, 100%, 50%))`
            }}
        >
            {!isColorEmpty && (
                <div
                    className="colorPalette__saturationPointer"
                    style={{ left: pointerLeftPosition, top: pointerTopPosition }}
                />
            )}
        </div>
    );
};

export default SaturationBrightnessPalette;
