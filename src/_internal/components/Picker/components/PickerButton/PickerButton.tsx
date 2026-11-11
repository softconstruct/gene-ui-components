import React, { FocusEvent, forwardRef, memo, MouseEvent, ReactNode } from "react";
import classNames from "classnames";

// Types
import { PickerSizes } from "../../types";

// Styles
import "./PickerButton.scss";

interface IPickerButtonProps {
    /**
     * Controls the visual size of the button.
     * @default "medium"
     */
    size?: PickerSizes;
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
     * The value the button represents, passed back to its callbacks.
     */
    value: string;
    /**
     * Tab index of the button. A picker list or grid keeps a single tab stop, the rest of the buttons get `-1`.
     */
    tabIndex?: number;
    /**
     * Role of the button: `option` inside a listbox, `gridcell` inside a grid.
     * @default "option"
     */
    role?: "option" | "gridcell";
    /**
     * Accessible name of the button, for values whose visible text is not enough on its own (a day number).
     */
    "aria-label"?: string;
    /**
     * Marks the button that represents the current date or time.
     */
    "aria-current"?: "date";
    /**
     * Additional class for the parent element.<br>
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The content of the button.
     */
    children?: ReactNode;
    /**
     * Callback function which triggers when the button is clicked or activated with the keyboard.
     */
    onClick?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Callback function which triggers when the pointer enters the button.
     */
    onMouseEnter?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Callback function which triggers when the button receives focus.
     */
    onFocus?: (value: string, event: FocusEvent<HTMLButtonElement>) => void;
}

/**
 * A reusable button component designed for picker controls.
 * Supports active and disabled states, multiple sizes,
 * and custom content with full keyboard accessibility.
 */
const PickerButton = forwardRef<HTMLButtonElement, IPickerButtonProps>(
    (
        {
            size = "medium",
            selected,
            disabled,
            value,
            tabIndex,
            role = "option",
            "aria-label": ariaLabel,
            "aria-current": ariaCurrent,
            className,
            children,
            onClick,
            onMouseEnter,
            onFocus
        },
        ref
    ) => (
        <button
            ref={ref}
            type="button"
            role={role}
            aria-selected={selected}
            aria-label={ariaLabel}
            aria-current={ariaCurrent}
            tabIndex={tabIndex}
            disabled={disabled}
            className={classNames("pickerButton", `pickerButton_size_${size}`, className, {
                pickerButton_selected: selected,
                pickerButton_disabled: disabled
            })}
            onClick={onClick && ((event) => onClick(value, event))}
            onMouseEnter={onMouseEnter && ((event) => onMouseEnter(value, event))}
            onFocus={onFocus && ((event) => onFocus(value, event))}
        >
            {children}
        </button>
    )
);

export { IPickerButtonProps };

export default memo(PickerButton);
