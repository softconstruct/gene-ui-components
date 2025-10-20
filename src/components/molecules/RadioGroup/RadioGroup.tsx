import React, { ChangeEvent, FC, FocusEvent, useEffect, useState } from "react";
import classNames from "classnames";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Radio from "@components/atoms/Radio";

// Styles
import "./RadioGroup.scss";

export interface IRadioOption {
    /**
     * The value of the radio option.
     * This is what will be returned in onChange and stored as the selected value.
     */
    value: string;
    /**
     * The label text displayed next to the radio option.
     */
    label: string;
    /**
     * Optional. Whether this specific option is disabled.
     */
    disabled?: boolean;
}

interface IRadioGroupProps {
    /**
     *  The text displayed as the label for the radio group, describing its purpose or function.
     */
    label?: string;
    /**
     *  Specifies whether the radio group is mandatory for completing a form.
     */
    required?: boolean;
    /**
     *  Disables the entire radio group, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     *  Displays the radio group as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     *  Helper text to provide context or explain any errors related to the radio group.
     */
    helperText?: string;
    /**
     *  Error message to display when the radio group is in error state.
     */
    errorMessage?: string;
    /**
     *  Determines the radio groups appearance based on its status.<br>
     *  Possible values: `rest | error`
     */
    type?: "rest" | "error";
    /**
     *  The alignment of the radio group content.<br>
     *  Possible values: `left | right`
     */
    alignment?: "left" | "right";
    /**
     *  Array of radio options to display in the group.<br/>
     *  Each item: `{ value: string; label: string; disabled?: boolean }`
     */
    options: IRadioOption[];
    /**
     *  The name attribute for all radio inputs in the group.
     */
    name: string;
    /**
     *  The currently selected value (controlled).
     */
    value?: string;
    /**
     *  The initial selected value (uncontrolled).
     */
    defaultValue?: string;
    /**
     *  Fires when the user changes the selected radio option.
     */
    onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    /**
     *  Fires when the radio group loses focus.
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     *  Fires when the radio group receives focus.
     */
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Additional descriptive text that appears alongside the `label`,
     * typically displayed as a tooltip triggered by an info icon.
     * Helps provide extra context or guidance to the user.
     */
    infoText?: string;
}

/**
 * A radio group allows users to select one option from a group of related choices. Each radio in the group is accompanied by a label, and only one radio within the group can be selected at any time.
 */
const RadioGroup: FC<IRadioGroupProps> = (props) => {
    const {
        label,
        infoText,
        required,
        disabled,
        readOnly,
        helperText,
        errorMessage,
        type = "rest",
        alignment = "left",
        options,
        name,
        value,
        defaultValue,
        onChange,
        onBlur,
        onFocus,
        className
    } = props;

    const isControlled = value !== undefined;
    const [selectedValue, setSelectedValue] = useState(defaultValue || "");

    const currentValue = isControlled ? value : selectedValue;

    const handleChange = (optionValue: string, event: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setSelectedValue(optionValue);
        }
        onChange?.(optionValue, event);
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
    };

    useEffect(() => {
        if (isControlled && value !== undefined) {
            setSelectedValue(value);
        }
    }, [value, isControlled]);

    const displayText = type === "error" && errorMessage ? errorMessage : helperText;
    const displayType = type === "error" ? "error" : "rest";

    return (
        <div
            className={classNames(
                "radioGroup",
                `radioGroup_${alignment}`,
                {
                    radioGroup_disabled: disabled,
                    radioGroup_readOnly: readOnly,
                    radioGroup_error: type === "error"
                },
                className
            )}
        >
            {label && (
                <Label text={label} required={required} disabled={disabled} readOnly={readOnly} infoText={infoText} />
            )}

            <div className="radioGroup__options">
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        name={name}
                        checked={currentValue === option.value}
                        disabled={disabled || option.disabled}
                        readOnly={readOnly}
                        type={displayType}
                        onChange={(e) => handleChange(option.value, e)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                ))}
            </div>

            {displayText && (
                <div className="radioGroup__infoContainer">
                    <HelperText text={displayText} disabled={disabled} type={displayType} />
                </div>
            )}
        </div>
    );
};

export { IRadioGroupProps, RadioGroup as default };
