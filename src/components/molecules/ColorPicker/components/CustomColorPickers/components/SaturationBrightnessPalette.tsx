import React, { FC, useRef } from "react";

import { IHsvColor } from "../../../types";
import { SATURATION_POINTER_RADIUS_PX } from "../constants";
import { useElementDimensions } from "../hooks/useElementDimensions";
import { usePointerDrag } from "../hooks/usePointerDrag";

interface ISaturationBrightnessPaletteProps {
    hsv: IHsvColor;
    onChange: (saturation: number, value: number) => void;
}

export const SaturationBrightnessPalette: FC<ISaturationBrightnessPaletteProps> = ({ hsv, onChange }) => {
    const paletteRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(paletteRef);

    const handleDrag = usePointerDrag(paletteRef, (horizontalPos, verticalPos) => {
        onChange(horizontalPos, 1 - verticalPos);
    });

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
            aria-label="Color saturation and brightness picker"
            aria-valuenow={Math.round(hsv.saturation * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
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

export default SaturationBrightnessPalette;
