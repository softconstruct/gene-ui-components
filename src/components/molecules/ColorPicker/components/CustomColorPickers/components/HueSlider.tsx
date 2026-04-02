import React, { FC, useRef } from "react";

import { SLIDER_POINTER_RADIUS_PX } from "../constants";
import { useElementDimensions } from "../hooks/useElementDimensions";
import { usePointerDrag } from "../hooks/usePointerDrag";

interface IHueSliderProps {
    hueDegree: number;
    onChange: (hue: number) => void;
}

export const HueSlider: FC<IHueSliderProps> = ({ hueDegree, onChange }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const dimensions = useElementDimensions(sliderRef);

    const handleDrag = usePointerDrag(sliderRef, (horizontalPos) => {
        onChange(horizontalPos * 360);
    });

    const pointerLeftPosition =
        dimensions.width > 0
            ? `${SLIDER_POINTER_RADIUS_PX + (hueDegree / 360) * (dimensions.width - 2 * SLIDER_POINTER_RADIUS_PX)}px`
            : `${(hueDegree / 360) * 100}%`;

    return (
        <div
            className="colorPalette__hue"
            ref={sliderRef}
            role="slider"
            aria-label="Color hue picker"
            aria-valuenow={Math.round(hueDegree)}
            aria-valuemin={0}
            aria-valuemax={360}
            tabIndex={0}
            onMouseDown={handleDrag}
            onTouchStart={handleDrag}
            style={{ backgroundImage: "linear-gradient(90deg, red, yellow, lime, cyan, blue, magenta, red)" }}
        >
            <div className="colorPalette__huePointer" style={{ left: pointerLeftPosition }} />
        </div>
    );
};

export default HueSlider;
