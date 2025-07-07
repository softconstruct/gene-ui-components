import React, { FC } from "react";
import classNames from "classnames";

import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Radio from "@components/atoms/Radio";

// Styles
import "./RadioGroup.scss";

interface IRadioGroupProps {
    /**
     *  The text displayed as the label for the checkbox group, describing its purpose or function.
     */
    label?: string;
    /**
     *  Specifies whether the checkbox group is mandatory for completing a form.
     */
    required?: boolean;
    /**
     *  Disables the checkbox group, preventing it from being interacted with.
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
     *  Possible values: `rest | error`
     */
    type?: "rest" | "error";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill RadioGroup component props interface
}

/**
 * A radio group allows users to select one option from a group of related choices. Each radio in the group is accompanied by a label, and only one radio within the group can be selected at any time.
 */
const RadioGroup: FC<IRadioGroupProps> = ({
    label,
    required,
    disabled,
    readOnly,
    helperText,
    type = "rest" as const,
    className
}) => {
    return (
        <div className={classNames("radioGroup", className)}>
            <Label text={label} required={required} disabled={disabled} readOnly={readOnly} />

            <Radio label="Label" type={type} value="" name="name" disabled={disabled} readOnly={readOnly} />
            <Radio label="Label" type={type} value="" name="name" disabled={disabled} readOnly={readOnly} />
            <Radio label="Label" type={type} value="" name="name" disabled={disabled} readOnly={readOnly} />
            <Radio label="Label" type={type} value="" name="name" disabled={disabled} readOnly={readOnly} />

            {helperText && (
                <div className="checkbox__infoContainer">
                    <HelperText text={helperText} disabled={disabled} type={type} />
                </div>
            )}
        </div>
    );
};

export { IRadioGroupProps, RadioGroup as default };
