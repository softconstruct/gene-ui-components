import React, { ComponentPropsWithoutRef, FC, memo } from "react";
import classNames from "classnames";

// Styles
import "./PickerButton.scss";

// Types
import { TimePickerSizes } from "../../types";

interface IPickerButtonProps extends ComponentPropsWithoutRef<"button"> {
    /**
     * Controls the visual size of the button.
     * @default "medium"
     */
    size?: TimePickerSizes;

    /**
     * Indicates whether the button is in an active (selected) state.
     * Typically used to highlight the currently selected value.
     *
     * @default false
     */
    selected?: boolean;
}

/**
 * A reusable button component designed for picker controls.
 * Supports active and disabled states, multiple sizes,
 * and custom content with full keyboard accessibility.
 */
const PickerButton: FC<IPickerButtonProps> = ({
    className,
    size = "medium",
    selected = false,
    disabled = false,
    children,
    ...props
}) => {
    return (
        <button
            // Spread first so `type`, `disabled` and the computed class list cannot be overridden.
            {...props}
            type="button"
            disabled={disabled}
            className={classNames("pickerButton", `pickerButton_size_${size}`, className, {
                pickerButton_state_selected: selected,
                pickerButton_state_disabled: disabled
            })}
        >
            {children}
        </button>
    );
};

/**
 * A single picker renders up to 146 buttons. They are memoized (and receive only primitive props,
 * clicks being delegated to the column) so unrelated state changes do not re-render all of them.
 */
export default memo(PickerButton);
