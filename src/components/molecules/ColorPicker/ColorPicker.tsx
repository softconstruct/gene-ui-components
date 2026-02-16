import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./ColorPicker.scss";

interface IColorPickerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill ColorPicker component props interface
}

/**
 * Color Picker allows users to select and apply colors within an application or website. It is widely used in design tools, customization features, and any interface where users need to choose colors, such as for text, backgrounds, or graphical elements.
 */
const ColorPicker: FC<IColorPickerProps> = ({ className }) => {
    return <div className={classNames("colorPicker", className)}>ColorPicker</div>;
};

export { IColorPickerProps, ColorPicker as default };
