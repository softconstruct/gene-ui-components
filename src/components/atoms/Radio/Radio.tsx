import React, { ChangeEvent, FC, useEffect, useRef, FocusEvent, useState } from "react";
import { Dot } from "@geneui/icons";
import classNames from "classnames";

// Components
import Label from "../../atoms/Label";
import HelperText from "../../atoms/HelperText";

// Styles
import "./Radio.scss";

interface IRadioProps {
    /**
     *  The text displayed as the label for the radio, describing its purpose or function.
     */
    label?: string;
    /**
     *  Toggles the label's and HelperText position between above or beside the radio.
     */
    vertical?: boolean;
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
     *  Activates a visual state indicating partial selection within a radio group.
     */
    indeterminate?: boolean;
    /**
     *  Manages the checked state of the radio in a controlled way.
     */
    checked?: boolean;
    /**
     *  Automatically focuses the radio when the component mounts.
     */
    autoFocus?: boolean;
    /**
     *  Extra information displayed with the label for clarity or guidance.
     */
    infoText?: string;
    /**
     *  Helper text to provide context or explain any errors, warnings related to the radio.
     */
    helperText?: string;
    /**
     *  The initial checked state of the radio before user interaction.
     */
    defaultChecked?: boolean;
    /**
     *  Determines the radioes appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    type?: "rest" | "warning" | "error";
    /**
     *  HTML name attribute for the input element.<br>
     *  A unique identifier for the radio within a form.
     */
    name?: string;
    /**
     *  Fires when the user changes the radio state. Provides the change event as a callback's argument.
     */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /**
     *  Event handler for when the radio input element loses focus. Provides the focus event as a callback's argument.
     */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     *  Event handler for when the radio input element receives focus. Provides the focus event as a callback's argument.
     */
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * radio component allows users to select one or more options from a set of choices. Each radio can be either checked or unchecked, indicating a binary state. radioes are commonly used in forms, settings, and lists where multiple selections are needed.
 */
const Radio: FC<IRadioProps> = ({
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

    return (
        <div
            className={classNames(
                "radio ",
                `radio_${type}`,
                {
                    radio_disabled: disabled,
                    radio_readOnly: readOnly,
                    radio_labelTop: vertical
                },
                className
            )}
            {...((disabled || readOnly) && { tabIndex: -1 })}
        >
            <Label
                labelText={label}
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
                            ref={interRef}
                            {...(name && { name })}
                            {...(autoFocus && { autoFocus })}
                            {...((disabled || readOnly) && { tabIndex: -1 })}
                        />
                        <span className="radio__imitation">
                            <Dot className="radio__icon" size={16} />
                        </span>
                    </span>
                </span>
            </Label>
            {helperText && (
                <div className="radio__infoContainer">
                    <HelperText text={helperText} isDisabled={disabled} type={type} />
                </div>
            )}
        </div>
    );
};

export { IRadioProps, Radio as default };
