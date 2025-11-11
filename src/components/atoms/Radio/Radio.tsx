import React, { ChangeEvent, FC, FocusEvent, useEffect, useState } from "react";
import classNames from "classnames";

import { CircleFilled } from "@geneui/icons";

import HelperText from "@components/atoms/HelperText";
// Components
import Label from "@components/atoms/Label";

// Styles
import "./Radio.scss";

interface IRadioProps {
    /**
     *  The text displayed as the label for the radio, describing its purpose or function.
     */
    label?: string;
    /**
     *  Toggles the label's and HelperText position between above or beside the radio.
     *   Possible values: `horizontal | vertical`
     */
    direction?: "horizontal " | "vertical";
    /**
     *  Specifies whether the radio is mandatory for completing a form.
     */
    required?: boolean;
    /**
     *  Disables the radio, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     *  Displays the radio as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     *  Manages the checked state of the radio in a controlled way.
     */
    checked?: boolean;
    /**
     *  Automatically focuses the radio when the component mounts.
     */
    autoFocus?: boolean;
    /**
     *  Extra information displayed with the tooltip for clarity or guidance.
     */
    infoText?: string;
    /**
     *  Helper text to provide context or explain any errors, warnings related to the radio.
     */
    helperText?: string;
    /**
     *  The initial state of the radio was checked before user interaction. This prop does not make the component controlled.
     */
    defaultChecked?: boolean;
    /**
     *  Determines the radio's visual status.<br>
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     *  HTML name attribute for the input element.<br>
     *  A unique identifier for the radio within a form.
     */
    name: string;
    /**
     *  Fires when the user changes the radio state. Provides the change event as a callback's argument.
     */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /**
     *  This event is triggered when user loses focus from the component, clicks another space in screen or using a keyboard navigation change the current focused element
     */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     *  This event is triggered when the user focuses on this component, clicks the radio button, or makes a currently focused element using keyboard navigation.
     */
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The value of the component that will be returned in the onChange event.
     * */
    value: string;
}

/*
 The radio component allows users to select one option from a set of choices. Each radio can be either checked or unchecked, indicating a binary state. Radios are commonly used in forms, settings, and lists where a user needs to select a single option from multiple options.
*/
const Radio: FC<IRadioProps> = (props) => {
    const {
        label,
        required,
        infoText,
        disabled,
        helperText,
        readOnly,
        status = "rest",
        direction = "horizontal ",
        autoFocus,
        onChange,
        onFocus,
        onBlur,
        name,
        checked,
        defaultChecked,
        className,
        value
    } = props;
    const isControlled = "checked" in props;

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

    return (
        <div
            className={classNames(
                "radio ",
                `radio_${status}`,
                {
                    radio_disabled: disabled,
                    radio_readOnly: readOnly,
                    radio_labelTop: direction === "vertical"
                },
                className
            )}
            {...((disabled || readOnly) && { tabIndex: -1 })}
        >
            <Label
                text={label}
                className="radio__label"
                required={required}
                infoText={infoText}
                disabled={disabled}
                readOnly={readOnly}
            >
                <span className="radio__imitationHolder">
                    <span className="radio__imitationHolderInner">
                        <input
                            type="radio"
                            className="radio__input"
                            onChange={onChangeHandler}
                            onFocus={onFocusHandler}
                            onBlur={onBlurHandler}
                            checked={checkedState}
                            value={value}
                            name={name}
                            disabled={disabled}
                            readOnly={readOnly}
                            {...(autoFocus && { autoFocus })}
                            {...((disabled || readOnly) && { tabIndex: -1 })}
                        />
                        <span className="radio__imitation">
                            <CircleFilled className="radio__icon" />
                        </span>
                    </span>
                </span>
            </Label>
            {helperText && (
                <div className="radio__infoContainer">
                    <HelperText text={helperText} disabled={disabled} status={status} />
                </div>
            )}
        </div>
    );
};

export { IRadioProps, Radio as default };
