import React, { FC } from "react";
import { ErrorAlertFill, IconProps, WarningFill } from "@geneui/icons";
import classnames from "classnames";

// Styles
import "./HelperText.scss";

interface IHelperTextProps {
    /**
     * Defines the size of the helper text.<br>
     * Possible values: `medium | small`.
     */
    size?: "medium" | "small";
    /**
     * Specifies the type of the helper text. <br>
     * Possible values: `rest | error | warning`.
     * `rest` for default information, `error` for error messages, or `warning` for cautions.
     */
    type?: "rest" | "error" | "warning";
    /**
     * The actual text content to be displayed as helper text.
     * This provides guidance or additional information related to the input field.
     */
    text: string;
    /**
     * Optional. Icon to be displayed alongside the helper text.
     * If the `type` prop is set to `error` or `warning`, a default icon will be used (ErrorAlertFill for `error` and WarningFill for `warning`) unless an `Icon` is explicitly provided.
     * If `type` is `rest`, the provided `Icon` will be used (if supplied), otherwise no icon will be displayed.
     * The size of the icon will automatically adjust based on the `size` prop (`small` or `medium`).
     */
    Icon?: React.FC<IconProps>;
    /**
     * Determines whether the helper text is disabled.
     * If `true`, the helper text will appear dimmed and non-interactive.
     */
    isDisabled?: boolean;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const iconSize = {
    small: 16,
    medium: 20
} as const;

/**
 * The Helper Text provides users with additional information or guidance related to a specific input field in a form. This text helps users understand the expected format, requirements, or purpose of the input, thereby improving form completion accuracy and user confidence.
 */
const HelperText: FC<IHelperTextProps> = ({ size = "medium", type = "rest", text, Icon, isDisabled, className }) => {
    const iconMap = {
        error: <ErrorAlertFill size={iconSize[size]} />,
        warning: <WarningFill size={iconSize[size]} />,
        rest: Icon && <Icon size={iconSize[size]} />
    };

    return (
        <div
            className={classnames(`helperText helperText_type_${type} helperText_size_${size}`, className, {
                helperText_disabled: isDisabled
            })}
        >
            {iconMap[type] && <div className="helperText__icon">{iconMap[type]}</div>}
            <p className="helperText__text">{text}</p>
        </div>
    );
};

export { IHelperTextProps, HelperText as default };
