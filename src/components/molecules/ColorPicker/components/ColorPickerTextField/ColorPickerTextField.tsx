import React, { ChangeEvent, FC, KeyboardEvent } from "react";
import classNames from "classnames";

// Icons
import { Percent } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import ColorIndicator from "@components/molecules/ColorPicker/components/ColorIndicator/ColorIndicator";

// Styles
import "./ColorPickerTextField.scss";

/**
 * Configuration properties for the ColorPickerTextField component.
 */
interface IColorPickerTextFieldProps {
    /** Unique identifier for the underlying input element. */
    id?: string;
    /** Callback triggered when the primary color input value changes. */
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback triggered when the alpha (opacity) input value changes. */
    onAlphaChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback triggered to toggle the visibility of the color picker popover. */
    onPickerOpen: (status: boolean) => void;
    /** The current textual value of the color input (e.g., HEX string). */
    value?: string;
    /** The current alpha value (0-100) to display in the alpha input field. */
    alpha?: number;
    /** Determines whether the alpha input field and divider should be rendered. */
    alphaEnabled?: boolean;
    /** Placeholder text displayed when the primary color input is empty. */
    placeholder?: string;
    /** Defines the physical size of the text field and its internal indicator. */
    size?: "small" | "medium" | "large";
}

/**
 * Text field component designed specifically for the ColorPicker.
 * Handles text-based manual entry of color and alpha values, and renders the visual `ColorIndicator`.
 */
const ColorPickerTextField: FC<IColorPickerTextFieldProps> = ({
    id,
    placeholder,
    value = "",
    size,
    alpha,
    alphaEnabled,
    onChange,
    onAlphaChange,
    onPickerOpen
}) => {
    const validateAlphaValue = (e: KeyboardEvent<HTMLInputElement>) => {
        if (["e", "E", "+", "-", "."].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className={classNames("colorPickerTextField", `colorPickerTextField_size_${size}`)}>
            <div className="colorPickerTextField__wrapper">
                <div className="colorPickerTextField__content">
                    <ColorIndicator size={size} onClick={() => onPickerOpen(true)} color={value} alpha={alpha} />
                    <div className="colorPickerTextField__value">
                        <input
                            id={id}
                            type="text"
                            autoComplete="off"
                            placeholder={placeholder}
                            value={value}
                            className={classNames("colorPickerTextField__input", `colorPickerTextField__input_${size}`)}
                            onChange={onChange}
                        />
                    </div>
                </div>
                {alphaEnabled && (
                    <>
                        <Divider direction="vertical" className="colorPickerTextField__divider" />
                        <div className="colorPickerTextField__percent">
                            <input
                                type="number"
                                autoComplete="off"
                                placeholder="100"
                                value={alpha}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                className="colorPickerTextField__input"
                                onChange={onAlphaChange}
                                onKeyDown={validateAlphaValue}
                            />
                            <div className="colorPickerTextField__icon">
                                <Percent size={20} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ColorPickerTextField;
