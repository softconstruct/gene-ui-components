import React, { ChangeEvent, FC } from "react";
import classNames from "classnames";

// Icons
import { Percent } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import ColorIndicator from "@components/molecules/ColorPicker/components/ColorIndicator/ColorIndicator";

// Styles
import "./ColorPickerTextField.scss";

interface IColorPickerTextFieldProps {
    id?: string;
    className?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAlphaChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onPickerOpen: (status: boolean) => void;
    value?: string;
    alpha?: number;
    alphaEnabled?: boolean;
    placeholder?: string;
    size?: "small" | "medium" | "large";
}

const ColorPickerTextField: FC<IColorPickerTextFieldProps> = ({
    id,
    placeholder,
    value = "",
    size,
    alpha,
    alphaEnabled,
    onChange,
    onAlphaChange,
    onPickerOpen,
    className
}) => {
    return (
        <div className={classNames("colorPickerTextField", className)}>
            <div className="colorPickerTextField__wrapper">
                <div className="colorPickerTextField__colorIndicator">
                    <ColorIndicator size={size} onClick={() => onPickerOpen(true)} color={value} alpha={alpha} />
                </div>
                <div className="colorPickerTextField__value">
                    <input
                        id={id}
                        type="text"
                        autoComplete="off"
                        placeholder={placeholder}
                        value={value}
                        className="colorPickerTextField__input"
                        onChange={onChange}
                    />
                </div>
                {alphaEnabled && (
                    <>
                        <Divider direction="vertical" className="colorPickerTextField__divider" />
                        <div className="colorPickerTextField__percent">
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="100"
                                value={alpha}
                                className="colorPickerTextField__input"
                                onChange={onAlphaChange}
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
