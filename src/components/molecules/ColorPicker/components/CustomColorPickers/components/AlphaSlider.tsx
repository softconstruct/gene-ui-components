import React, { FC, useRef } from "react";

import { SLIDER_POINTER_RADIUS_PX } from "../constants";
import { useElementDimensions } from "../hooks/useElementDimensions";
import { usePointerDrag } from "../hooks/usePointerDrag";

interface IAlphaSliderProps {
    opacityLevel: number;
    baseRgb: { r: number; g: number; b: number };
    onChange: (alpha: number) => void;
}

export const AlphaSlider: FC<IAlphaSliderProps> = ({ opacityLevel, baseRgb, onChange }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(sliderRef);

    const handleDrag = usePointerDrag(sliderRef, (horizontalPos) => onChange(horizontalPos));

    const pointerLeftPosition =
        dimensions.width > 0
            ? `${SLIDER_POINTER_RADIUS_PX + opacityLevel * (dimensions.width - 2 * SLIDER_POINTER_RADIUS_PX)}px`
            : `${opacityLevel * 100}%`;

    return (
        <div
            role="slider"
            aria-label="Color opacity picker"
            aria-valuenow={Math.round(opacityLevel * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            className="colorPalette__alpha"
            ref={sliderRef}
            onMouseDown={handleDrag}
            onTouchStart={handleDrag}
        >
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
