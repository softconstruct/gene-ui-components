import React, { FC, memo, ReactNode } from "react";
import classNames from "classnames";

// Types
import { TimePickerSizes } from "../../types";

// Styles
import "./PickerButton.scss";

interface IPickerButtonProps {
    /**
     * Controls the visual size of the button.
     * @default "medium"
     */
    size?: TimePickerSizes;

    /**
     * Indicates whether the button is in an active (selected) state.
     * Typically used to highlight the currently selected value. Also sets `aria-selected` on the button.
     */
    selected?: boolean;

    /**
     * Indicates whether the button is disabled.
     */
    disabled?: boolean;

    /**
     * The value the button represents. Rendered as `data-value`, which the picker column reads on click.
     */
    value: string;

    /**
     * Tab index of the button. The picker column keeps a single tab stop, the rest of the buttons get `-1`.
     */
    tabIndex?: number;

    /**
     * Additional class for the parent element.<br>
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;

    /**
     * The content of the button.
     */
    children?: ReactNode;
}

/**
 * A reusable button component designed for picker controls.
 * Supports active and disabled states, multiple sizes,
 * and custom content with full keyboard accessibility.
 */
const PickerButton: FC<IPickerButtonProps> = ({
    size = "medium",
    selected,
    disabled,
    value,
    tabIndex,
    className,
    children
}) => {
    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            tabIndex={tabIndex}
            data-value={value}
            disabled={disabled}
            className={classNames("pickerButton", `pickerButton_size_${size}`, className, {
                pickerButton_selected: selected,
                pickerButton_disabled: disabled
            })}
        >
            {children}
        </button>
    );
};

export default memo(PickerButton);
