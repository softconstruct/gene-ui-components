import React, { FC, JSX, useRef } from "react";
import classnames from "classnames";

// Components
import Tooltip from "../../molecules/Tooltip";

// Hooks
import { useEllipsisDetection } from "../../../hooks";

// Styles
import "./Label.scss";
import Info from "../Info";

interface ILabelProps {
    /**
     * Label size.<br/>
     * Possible values: `medium | small`
     */
    size?: "medium" | "small";
    /**
     * The text content of the `label`.
     * This is the main text displayed within the `label`.
     */
    labelText?: string;
    /**
     * Indicates whether the label represents a required field.
     * When set to `true`, a visual indicator (asterisk) will be added to denote that the field is required.
     */
    required?: boolean;
    /**
     * Additional informational text displayed alongside the label.
     * When provided, an info icon will be displayed next to the label,
     * which can be hovered over to reveal the additional context or instructions via a tooltip.
     */
    infoText?: string;
    /**
     * Indicates whether the `label` should be displayed as `disabled`.
     * When set to `true`, the `label` will be styled to appear `disabled`, which can indicate that the associated input field is not editable.
     */
    disabled?: boolean;
    /**
     * Indicates whether the `label` is in a loading state.
     * When set to `true` a `skeleton` indicator will be shown instead of the `label` text.
     */
    isLoading?: boolean;
    /**
     * Indicates whether the `label` should be read-only.
     * This prop will not make visual changes but sets `pointer-events: auto` to prevent triggering label click events.
     */
    readOnly?: boolean;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The form element associated with the label, such as an input, checkbox, or radio button.
     * The label will wrap around this element, ensuring proper association for accessibility.
     */
    children?: JSX.Element;
}

const iconSizes = {
    small: "XSmall",
    medium: "smallNudge"
} as const;

/**
 * Labels identify a component or group of components. Use them with elements such as checkboxes and input fields to guide users in providing specific information, or with plain text to organize information.
 */

const Label: FC<ILabelProps> = ({
    size = "medium",
    labelText,
    disabled,
    required,
    infoText,
    isLoading,
    className,
    children,
    readOnly
}) => {
    const labelRef = useRef<HTMLLabelElement | null>(null);

    const isTruncated: boolean = useEllipsisDetection(labelRef);

    return (
        <label className={classnames(`label`, className)}>
            {children}
            {isLoading ? (
                <span>skeleton</span>
            ) : (
                labelText && (
                    <span
                        className={classnames("label__container", { label__container_readOnly: readOnly && !disabled })}
                    >
                        <div className="label__container-inner">
                            {labelText && (
                                <Tooltip text={labelText} isVisible={isTruncated}>
                                    <span
                                        ref={labelRef}
                                        className={classnames(`ellipsis-text label__text label__text_size_${size}`, {
                                            label__text_disabled: disabled
                                        })}
                                    >
                                        {labelText}
                                    </span>
                                </Tooltip>
                            )}
                            {required && (
                                <span
                                    className={classnames(`label__asterisk label__text_size_${size} `, {
                                        label__text_disabled: disabled
                                    })}
                                >
                                    *
                                </span>
                            )}
                        </div>
                        {infoText && <Info infoText={infoText} disabled={disabled} size={iconSizes[size]} />}
                    </span>
                )
            )}
        </label>
    );
};

export { ILabelProps, Label as default };
