import React, { FC, KeyboardEvent, useRef } from "react";

import { SLIDER_POINTER_RADIUS_PX } from "../constants";
import { useElementDimensions } from "../hooks/useElementDimensions";
import { usePointerDrag } from "../hooks/usePointerDrag";

interface IAlphaSliderProps {
    opacityLevel: number;
    baseRgb: { r: number; g: number; b: number };
    onChange: (alpha: number) => void;
    isColorEmpty?: boolean;
}

const KEYBOARD_STEP = 0.05;

export const AlphaSlider: FC<IAlphaSliderProps> = ({ opacityLevel, baseRgb, onChange, isColorEmpty = false }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(sliderRef);

    const handleDrag = usePointerDrag(sliderRef, (horizontalPos) => onChange(horizontalPos));

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let newOpacity = opacityLevel;
        let handled = false;

        switch (e.key) {
            case "ArrowRight":
                newOpacity = Math.min(1, opacityLevel + KEYBOARD_STEP);
                handled = true;
                break;
            case "ArrowLeft":
                newOpacity = Math.max(0, opacityLevel - KEYBOARD_STEP);
                handled = true;
                break;
            default:
                break;
        }

        if (handled) {
            e.preventDefault();
            onChange(newOpacity);
        }
    };

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
            onKeyDown={handleKeyDown}
        >
            <div
                className="colorPalette__alphaGradient"
                style={{
                    backgroundImage: `linear-gradient(90deg, rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0) 0%, rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 1) 100%)`
                }}
            />
            {!isColorEmpty && <div className="colorPalette__alphaPointer" style={{ left: pointerLeftPosition }} />}
        </div>
    );
};
