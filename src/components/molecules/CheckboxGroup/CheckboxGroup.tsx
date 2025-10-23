import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./CheckboxGroup.scss";

import HelperText from "../../atoms/HelperText";
import Label from "../../atoms/Label";
import Checkbox from "../Checkbox";

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
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill CheckboxGroup component props interface
}

/**
 * A checkbox group component is a set of related checkboxes that allows users to select multiple options from a list. Each checkbox within the group operates independently, meaning multiple boxes can be checked or unchecked simultaneously.
 */
const CheckboxGroup: FC<ICheckboxGroupProps> = ({
    label,
    required,
    disabled,
    readOnly,
    helperText,
    status = "rest" as const,
    className
}) => {
    return (
        <div className={classNames("checkboxGroup", className)}>
            <Label text={label} required={required} disabled={disabled} readOnly={readOnly} />

            <Checkbox label="Label" status={status} value="" name="" disabled={disabled} readOnly={readOnly} />
            <Checkbox label="Label" status={status} value="" name="" disabled={disabled} readOnly={readOnly} />
            <Checkbox label="Label" status={status} value="" name="" disabled={disabled} readOnly={readOnly} />
            <Checkbox label="Label" status={status} value="" name="" disabled={disabled} readOnly={readOnly} />

            {helperText && (
                <div className="checkbox__infoContainer">
                    <HelperText text={helperText} disabled={disabled} status={status} />
                </div>
            )}
        </div>
    );
};

export { ICheckboxGroupProps, CheckboxGroup as default };
