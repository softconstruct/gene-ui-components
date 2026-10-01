import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";

// Components
import Label from "@components/atoms/Label";
import { IPopoverRef } from "@components/atoms/Popover";
import ColorPickerTextField from "@components/molecules/ColorPicker/components/ColorPickerTextField/ColorPickerTextField";

import ColorPickerPopover, { useColorPicker } from "@internal/components/ColorPickerPopover";

// Styles
import "./ColorPicker.scss";

// Types
import { ColorFormat, RGB, RGBA } from "./types";

/**
 * Configuration properties for the ColorPicker component.
 */
interface IColorPickerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Determines whether the alpha (transparency) slider and input fields are active.
     * When `true`, the picker allows users to select an opacity level.
     * @default false
     */
    alphaEnabled?: boolean;
    /**
     * The controlled alpha value, mapped on a scale from 0 to 100.
     * @default 100
     */
    alphaValue?: number;
    /**
     * The controlled color value (HEX string).
     * If provided, the component operates in controlled mode and ignores `defaultColor`.
     */
    value?: string;
    /**
     * The text label rendered above the primary color input field.
     */
    label?: string;
    /**
     * Specifies the visual size variant of the color picker inputs and indicators.
     * @default "medium"
     */
    size?: "small" | "medium" | "large";
    /**
     * Supplementary description text for the label.
     * Renders an information icon next to the label that displays this text within a tooltip upon hover.
     */
    labelInfoText?: string;
    /**
     * Ghost text displayed in the primary color input field when it is empty.
     */
    placeholder?: string;
    /**
     * The explicitly defined open/closed state of the popover palette.
     * Passing this prop switches the popover to a controlled state.
     */
    open?: boolean;
    /**
     * The uncontrolled default color value utilized upon initial mount.
     */
    defaultColor?: string;
    /**
     * An array of valid HEX strings representing previously selected or favorite colors.
     * These are rendered as clickable swatches beneath the main palette.
     * When passed an empty string ("") will render "clean selection" element in recent colors section.
     */
    recentColors?: string[];
    /**
     * The preferred color syntax format to display in the input fields.
     * @default "hex"
     */
    format?: ColorFormat;
    /**
     * Callback fired continuously as the user modifies the color.
     * @param hex - The 6 or 8 character HEX string representation of the color.
     * @param rgba - The parsed RGBA/RGB object representing the current state.
     * @param alpha - The alpha integer value mapped from 0 to 100.
     */
    onChange?: (hex?: string, rgba?: RGBA | RGB | null, alpha?: number) => void;
}

/**
 * Color Picker allows users to select and apply colors within an application or website.
 * It is widely used in design tools, customization features, and any interface where users need to choose colors, such as for text, backgrounds, or graphical elements.
 */
const ColorPicker: FC<IColorPickerProps> = ({
    className,
    alphaEnabled = false,
    alphaValue,
    value,
    defaultColor,
    recentColors,
    onChange,
    open,
    format = "hex",
    label,
    labelInfoText,
    size = "medium",
    placeholder
}) => {
    const isOpenControlled = open !== undefined;

    const [isOpen, setIsOpen] = useState(!!open);
    const [isAlphaEnabled, setIsAlphaEnabled] = useState(alphaEnabled);

    const [propsForPopover, setPropsForPopover] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const colorControl = useColorPicker({ value, defaultColor, alphaEnabled: isAlphaEnabled, alphaValue, onChange });

    const handleOpen = useCallback(
        (openState: boolean) => {
            if (!isOpenControlled) {
                setIsOpen(openState);
            }
        },
        [isOpenControlled]
    );

    useEffect(() => {
        if (!isOpenControlled || open === undefined) return;
        setIsOpen(open);
    }, [open, isOpenControlled]);

    useEffect(() => {
        setIsAlphaEnabled(alphaEnabled);
    }, [alphaEnabled]);

    return (
        <div className={classNames("colorPicker", className)} {...propsForPopover}>
            <Label
                size={size === "large" ? "medium" : size}
                text={label}
                infoText={labelInfoText}
                labelFor="colorPickerTextField"
            />
            <ColorPickerTextField
                id="colorPickerTextField"
                value={colorControl.localHex}
                alpha={colorControl.alpha}
                alphaEnabled={isAlphaEnabled}
                onChange={colorControl.handleHexInputChange}
                onAlphaChange={colorControl.handleAlphaChange}
                placeholder={placeholder}
                onPickerOpen={handleOpen}
                size={size}
            />
            <ColorPickerPopover
                popoverRef={popoverRef}
                open={isOpen}
                setProps={setPropsForPopover}
                onClose={() => handleOpen(false)}
                colorControl={colorControl}
                alphaEnabled={isAlphaEnabled}
                recentColors={recentColors}
                format={format}
            />
        </div>
    );
};

export { IColorPickerProps, ColorPicker as default };
