import React, { FC, ReactNode } from "react";
import classNames from "classnames";

// Styles
import "./PickerButton.scss";

interface IPickerButtonProps {
    /**
     * Additional class for the picker button element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Callback is getting triggered when button is clicked.
     */
    onClick?: () => void;
    /**
     * Whether button is clicked and is active.
     */
    active?: boolean;
    /**
     * Whether button is disabled.
     */
    disabled?: boolean;
    /**
     * Defines the size of picker button.
     * Possible values: `small | medium | large`.
     */
    size?: "small" | "medium" | "large";
    /**
     * The content to be rendered inside button.
     */
    children: ReactNode;
}

const PickerButton: FC<IPickerButtonProps> = ({ className, size, onClick, active, disabled, children }) => {
    return (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={onClick}
            className={classNames(
                `timePicker__pickerButton_size_${size} pickerButton pickerButton_size_${size}`,
                className,
                {
                    pickerButton_state_selected: active,
                    pickerButton_state_disabled: disabled
                }
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default PickerButton;
