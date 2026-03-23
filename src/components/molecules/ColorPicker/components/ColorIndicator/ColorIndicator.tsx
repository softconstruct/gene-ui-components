import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./ColorIndicator.scss";

// Utils
import { hexToRgb } from "../../utils";

/**
 * Configuration properties for the ColorIndicator component.
 */
interface IColorIndicator {
    /**
     * Callback function triggered when the color indicator is clicked.
     */
    onClick?: () => void;
    /**
     * The color value (in HEX or RGB format) that the indicator should display.
     */
    color: string;
    /**
     * The visual size of the color indicator.
     * @default "medium"
     */
    size?: "small" | "medium" | "large";
    /**
     * The alpha (transparency) value used to display the correct background color opacity.
     * Scaled from 0 to 100.
     * @default 100
     */
    alpha?: number;
}

/**
 * Visual color indicator subcomponent for the ColorPicker.
 * Renders a small swatch reflecting the currently selected color and opacity,
 * typically displayed inside or alongside the main text field.
 */
const ColorIndicator: FC<IColorIndicator> = ({ onClick, color, size, alpha = 100 }) => {
    const localRGB = hexToRgb(color);
    return (
        <button
            type="button"
            aria-label="Choose color"
            onClick={onClick}
            className={classNames("colorIndicator", `colorIndicator_size_${size}`)}
        >
            <span
                className={classNames("colorIndicator__wrapper", {
                    colorIndicator__wrapper_hasActive: !localRGB
                })}
                style={{
                    backgroundColor: localRGB
                        ? `rgba(${localRGB.r}, ${localRGB.g}, ${localRGB.b}, ${alpha})`
                        : "transparent"
                }}
            />
        </button>
    );
};

export default ColorIndicator;
