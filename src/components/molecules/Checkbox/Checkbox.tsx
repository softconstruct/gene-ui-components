import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

import { CheckMark, Minus } from "@geneui/icons";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Styles
import "./Checkbox.scss";

interface ICheckboxProps {
    /**
     *  The text displayed as the label for the checkbox, describing its purpose or function.
     */
    label?: string;
    /**
     *  Toggles the label's and HelperText position between above or beside the checkbox.
     *   Possible values: `horizontal | vertical`
     */
    direction?: "horizontal" | "vertical";
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
     *  Extra information displayed with the tooltip for clarity or guidance.
     */
    infoText?: string;
    /**
     *  Helper text to provide context or explain any errors, warnings related to the checkbox.
     */
    helperText?: string;
    /**
     *  The initial state of the checkbox was checked before user interaction. This prop does not make the component controlled.
     */
    defaultChecked?: boolean;
    /**
     *  Determines the checkbox's visual status.<br>
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     *  HTML name attribute for the input element.<br>
     *  A unique identifier for the checkbox within a form.
     */
    name: string;
    /**
     * The value of the component that will be returned in the onChange event.
     */
    value: string;
    /**
     *  Fires when the user click on the checkbox. Provides the click event as a callback's argument.
     *  This prop is commonly used to prevent event bubbling.
     */
    onClick?: (e: MouseEvent<HTMLInputElement>) => void;
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
    /**
     * `HTML` `id` attribute for the `input` element
     */
    id?: string;
}

/**
 * Checkbox component allows users to select one or more options from a set of choices. Each checkbox can be either checked or unchecked, indicating a binary state. Checkboxes are commonly used in forms, settings, and lists where multiple selections are needed.
 */
const Checkbox: FC<ICheckboxProps> = (props) => {
    const {
        id,
        label,
        required,
        infoText,
        disabled,
        helperText,
        readOnly,
        status = "rest",
        direction = "horizontal",
        autoFocus,
        onClick,
        onChange,
        onFocus,
        onBlur,
        name,
        indeterminate,
        checked,
        defaultChecked,
        className,
        value
    } = props;

    const interRef = useRef<HTMLInputElement>(null);
    const isControlled = "checked" in props;

    const generatedId = useMemo(() => id || `default-id-${nanoid()}`, [id]);

    const [checkedState, setCheckedState] = useState(defaultChecked || false);

    const onClickHandler = (e: MouseEvent<HTMLInputElement>) => onClick?.(e);

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
                `checkbox_status_${status}`,
                {
                    checkbox_labelTop: direction === "vertical"
                },
                className
            )}
            {...((disabled || readOnly) && { tabIndex: -1 })}
        >
            <div className="checkbox__content">
                <Label
                    text={label}
                    className="checkbox__label"
                    required={required}
                    infoText={infoText}
                    disabled={disabled}
                    readOnly={readOnly}
                    labelFor={generatedId}
                />
                <span
                    className={classNames("checkbox__imitationHolder", {
                        checkbox__imitationHolder_disabled: disabled,
                        checkbox__imitationHolder_readOnly: readOnly && !disabled
                    })}
                >
                    <span className="checkbox__imitationHolderInner">
                        <input
                            type="checkbox"
                            className="checkbox__input"
                            onChange={onChangeHandler}
                            onFocus={onFocusHandler}
                            onBlur={onBlurHandler}
                            onClick={onClickHandler}
                            checked={resolvedChecked}
                            ref={interRef}
                            {...(name && { name })}
                            {...(autoFocus && { autoFocus })}
                            {...((disabled || readOnly) && { tabIndex: -1 })}
                            value={value}
                            id={generatedId}
                        />
                        <span className="checkbox__imitation">
                            {indeterminate && !checked ? (
                                <Minus className="checkbox__icon" size={16} />
                            ) : (
                                <CheckMark className="checkbox__icon" size={16} />
                            )}
                        </span>
                    </span>
                </span>
            </div>
            {helperText && (
                <div className="checkbox__infoContainer">
                    <HelperText text={helperText} disabled={disabled} status={status} />
                </div>
            )}
        </div>
    );
};

export { ICheckboxProps, Checkbox as default };
