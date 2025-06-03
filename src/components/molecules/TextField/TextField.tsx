import React, { FC } from "react";
import classNames from "classnames";

import { InfoOutlined, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";

// Styles
import "./TextField.scss";

import { Label } from "../../../index";

interface ITextFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TextField component props interface
}

/**
 * Text field is an input element in a user interface where users can enter and edit text. Text fields are commonly used in forms for collecting user data such as names, email addresses, and messages.
 */
const TextField: FC<ITextFieldProps> = ({ className }) => {
    return (
        <div className={classNames("textField", className)}>
            <Label text="Label" />
            {/*
            Sizes / textField__wrapper_size_large, textField__wrapper_size_medium, textField__wrapper_size_small
            ReadOnlyState / textField__wrapper_readOnly (for readOnly state add readOnly={true})
            DisabledState / textField__wrapper_disabled (for disabled state add tabIndex={-1} for input)
            ErrorState / textField__wrapper_error */}
            <label className="textField__wrapper textField__wrapper textField__wrapper_size_large textField__wrapper_withIcons">
                <span className="textField__icon">
                    <InfoOutlined size="20" />
                </span>
                <input className="textField__input" type="text" placeholder="Placeholder" />
                <span className="textField__actions">
                    <Button Icon={X} appearance="secondary" size="smallNudge" layout="text" />
                    <Button Icon={X} appearance="secondary" size="smallNudge" layout="text" />
                </span>
            </label>
            <HelperText text="Helper text" />
        </div>
    );
};

export { ITextFieldProps, TextField as default };
