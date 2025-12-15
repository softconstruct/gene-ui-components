import React, { ChangeEvent, FC, FocusEvent, useEffect, useState } from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Checkbox from "@components/molecules/Checkbox";

// Styles
import "./CheckboxGroup.scss";

export interface ICheckboxOption {
    /**
     * The value of the checkbox option.
     * This is what will be returned in onChange and stored as the selected value.
     */
    value: string;
    /**
     * The label text displayed next to the checkbox option.
     */
    label: string;
    /**
     * Optional. Whether this specific option is disabled.
     */
    disabled?: boolean;
}

interface ICheckboxGroupProps {
    /**
     *  The text displayed as the label for the checkbox group, describing its purpose or function.
     */
    label?: string;
    /**
     *  Specifies whether the checkbox group is mandatory for completing a form.
     */
    required?: boolean;
    /**
     *  Disables the entire checkbox group, preventing it from being interacted with.
     */
    disabled?: boolean;
    /**
     *  Displays the checkbox group as read-only, where users cannot modify its value.
     */
    readOnly?: boolean;
    /**
     *  Helper text to provide context or explain any errors related to the checkbox group.
     */
    helperText?: string;
    /**
     *  Determines the checkbox groups appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     *  Array of checkbox options to display in the group.<br/>
     *  Each item: `{ value: string; label: string; disabled?: boolean }`
     */
    options: ICheckboxOption[];
    /**
     *  The name attribute for all checkbox inputs in the group.
     */
    name?: string;
    /**
     *  The currently selected values (controlled).
     */
    value?: string[];
    /**
     *  The initial selected values (uncontrolled).
     */
    defaultValue?: string[];
    /**
     *  Fires when the user changes the selected checkbox options.
     */
    onChange?: (values: string[], event: ChangeEvent<HTMLInputElement>) => void;
    /**
     *  Fires when the checkbox group loses focus.
     */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /**
     *  Fires when the checkbox group receives focus.
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
 * A checkbox group allows users to select multiple options from a group of related choices. Each checkbox in the group is accompanied by a label, and multiple checkboxes within the group can be selected simultaneously.
 */
const CheckboxGroup: FC<ICheckboxGroupProps> = ({
    label,
    infoText,
    required,
    disabled,
    readOnly,
    helperText,
    status = "rest",
    options,
    name,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    className
}) => {
    const isControlled = value !== undefined;
    const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue || []);

    const currentValues = isControlled ? value : selectedValues;

    const handleChange = (optionValue: string, event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        let newValues: string[];

        if (isChecked) {
            newValues = [...currentValues, optionValue];
        } else {
            newValues = currentValues.filter((val) => val !== optionValue);
        }

        if (!isControlled) {
            setSelectedValues(newValues);
        }
        onChange?.(newValues, event);
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
    };

    useEffect(() => {
        if (isControlled && value !== undefined) {
            setSelectedValues(value);
        }
    }, [value, isControlled]);

    return (
        <div
            className={classNames(
                "checkboxGroup",
                {
                    checkboxGroup_disabled: disabled,
                    checkboxGroup_readOnly: readOnly
                },
                className
            )}
            role="group"
        >
            {label && (
                <Label text={label} required={required} disabled={disabled} readOnly={readOnly} infoText={infoText} />
            )}

            <div className="checkboxGroup__options">
                {options.map((option) => (
                    <Checkbox
                        key={option.value}
                        label={option.label}
                        value={option.value}
                        name={name}
                        checked={currentValues.includes(option.value)}
                        disabled={disabled || option.disabled}
                        readOnly={readOnly}
                        status={status}
                        onChange={(e) => handleChange(option.value, e)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                ))}
            </div>

            {helperText && (
                <div className="checkboxGroup__infoContainer">
                    <HelperText text={helperText} disabled={disabled} status={status} />
                </div>
            )}
        </div>
    );
};

export { ICheckboxGroupProps, CheckboxGroup as default };
