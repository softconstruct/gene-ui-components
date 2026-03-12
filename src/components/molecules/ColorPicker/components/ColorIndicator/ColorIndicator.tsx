import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./ColorIndicator.scss";

// Utils
import { hexToRgb } from "../../utils";

interface IColorIndicator {
    /**
     * Callback triggers when color indicator is clicked.
     */
    onClick?: () => void;
    /**
     * Color that indicator should display.
     */
    color: string;
    /**
     * The size of the color indicator.
     */
    size?: "small" | "medium" | "large";
    /**
     * The alpha value, used to display correct color (alpha value envolved).
     */
    alpha?: number;
}

/**
 * Subcomponent for ColorPicker.
 * Used to show color indicator in TextField component.
 */
const ColorIndicator: FC<IColorIndicator> = ({ onClick, color, size, alpha = 100 }) => {
    const localRGB = hexToRgb(color);
    return (
        <button
            type="button"
            aria-label="Choose color"
            onClick={onClick}
            className={classNames("colorIndicator", `colorIndicator_size_${size}`)}
            style={{
                backgroundColor: localRGB ? `rgba(${localRGB.r}, ${localRGB.g}, ${localRGB.b}, ${alpha})` : "purple"
            }}
        />
    );
};

export default ColorIndicator;
