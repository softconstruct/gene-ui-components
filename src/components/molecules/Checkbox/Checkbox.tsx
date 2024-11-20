import React, { ChangeEvent, FC, useEffect, useRef, FocusEvent, useState, useMemo } from "react";
import { CheckMark, MinusOutline } from "@geneui/icons";
import classNames from "classnames";

// Components
import Label from "../../atoms/Label";
import HelperText from "../../atoms/HelperText";

// Styles
import "./Checkbox.scss";

interface ICheckboxProps {
    /**
     *  The text displayed as the label for the checkbox, describing its purpose or function.
     */
    label?: string;
    /**
     *  Toggles the label's and HelperText position between above or beside the checkbox.
     */
    vertical?: boolean;
    /**
     *  Specifies whether the checkbox is mandatory for completing a form.
     */
    required?: boolean;
    /**
     *  Disables the checkbox, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     *  Displays the checkbox as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     *  Activates a visual state indicating partial selection within a checkbox group.
     */
    indeterminate?: boolean;
    /**
     *  Manages the checked state of the checkbox in a controlled way.
     */
    checked?: boolean;
    /**
     *  Automatically focuses the checkbox when the component mounts.
     */
    autoFocus?: boolean;
    /**
     *  Extra information displayed with the label for clarity or guidance.
     */
    infoText?: string;
    /**
     *  Helper text to provide context or explain any errors, warnings related to the checkbox.
     */
    helperText?: string;
    /**
     *  The initial checked state of the checkbox before user interaction.
     */
    defaultChecked?: boolean;
    /**
     *  Determines the checkboxes appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    type?: "rest" | "warning" | "error";
    /**
     *  HTML name attribute for the input element.<br>
     *  A unique identifier for the checkbox within a form.
     */
    name?: string;
    /**
     *  Fires when the user changes the checkbox state. Provides the change event as a callback's argument.
     */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /**
     *  Event handler for when the checkbox input element loses focus. Provides the focus event as a callback's argument.
     */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     *  Event handler for when the checkbox input element receives focus. Provides the focus event as a callback's argument.
     */
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * Checkbox component allows users to select one or more options from a set of choices. Each checkbox can be either checked or unchecked, indicating a binary state. Checkboxes are commonly used in forms, settings, and lists where multiple selections are needed.
 */
const Checkbox: FC<ICheckboxProps> = ({
    label,
    required,
    infoText,
    disabled,
    helperText,
    readOnly,
    type = "rest" as const,
    vertical,
    autoFocus,
    onChange,
    onFocus,
    onBlur,
    name,
    indeterminate,
    checked,
    defaultChecked,
    className
}) => {
    const interRef = useRef<HTMLInputElement>(null);
    const isControlled = checked !== undefined;

    const [checkedState, setCheckedState] = useState(defaultChecked || false);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setCheckedState(e.target.checked);
        }
        onChange?.(e);
    };

    const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => onFocus?.(e);

    const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => onBlur?.(e);

    useEffect(() => {
        if (isControlled) {
            setCheckedState(!!checked);
        }
    }, [checked, isControlled]);

    useEffect(() => {
        if (interRef.current) {
            interRef.current.indeterminate = !!indeterminate;
        }
    }, [indeterminate]);

    const resolvedChecked = useMemo(() => {
        const isIndeterminate = indeterminate && !checked;
        if (isIndeterminate) return false;

        return isControlled ? checked : checkedState;
    }, [checked, checkedState, indeterminate]);

    return (
        <div
            className={classNames(
                "checkbox ",
                `checkbox_${type}`,
                {
                    checkbox_disabled: disabled,
                    checkbox_readOnly: readOnly,
                    checkbox_labelTop: vertical
                },
                className
            )}
            {...((disabled || readOnly) && { tabIndex: -1 })}
        >
            <Label
                labelText={label}
                className="checkbox__label"
                required={required}
                infoText={infoText}
                disabled={disabled}
                readOnly={readOnly}
            >
                <span className="checkbox__imitationHolder">
                    <span className="checkbox__imitationHolderInner">
                        <input
                            type="checkbox"
                            className="checkbox__input"
                            onChange={onChangeHandler}
                            onFocus={onFocusHandler}
                            onBlur={onBlurHandler}
                            checked={resolvedChecked}
                            ref={interRef}
                            {...(name && { name })}
                            {...(autoFocus && { autoFocus })}
                            {...((disabled || readOnly) && { tabIndex: -1 })}
                        />
                        <span className="checkbox__imitation">
                            {indeterminate && !checked ? (
                                <MinusOutline className="checkbox__icon" size={16} />
                            ) : (
                                <CheckMark className="checkbox__icon" size={16} />
                            )}
                        </span>
                    </span>
                </span>
            </Label>
            {helperText && (
                <div className="checkbox__infoContainer">
                    <HelperText text={helperText} isDisabled={disabled} type={type} />
                </div>
            )}
        </div>
    );
};

export { ICheckboxProps, Checkbox as default };
