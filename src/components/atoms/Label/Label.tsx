import React, { FC, JSX, useRef } from "react";
import classnames from "classnames";

// Components
import Info from "@components/atoms/Info";
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Label.scss";

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
    text?: string;
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
    loading?: boolean;
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
    /**
     * ID of the component that the label is labelling.
     */
    labelFor?: string;
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
    text,
    disabled,
    required,
    infoText,
    loading,
    className,
    children,
    readOnly,
    labelFor
}) => {
    const labelTextRef = useRef<HTMLSpanElement | null>(null);

    const isTruncated: boolean = useEllipsisDetection(labelTextRef);

    const handlePreventLabelInteraction = (event: React.MouseEvent) => {
        if (!(readOnly || disabled)) return;

        event.preventDefault();
        event.stopPropagation();
    };

    if (!text && labelFor) return null;

    if (!text && children) {
        if (className) {
            return <label className={className}>{children}</label>;
        }
        return children;
    }

    const Component = children || labelFor ? "label" : "div";

    const actualVariant = Component === "label" && !disabled ? "interactive" : "descriptive";

    if (loading) {
        return (
            <div className={classnames(`label`, `label_variant_${actualVariant}`, className)}>
                <span>skeleton</span>
            </div>
        );
    }

    const TextAndRequired = text ? (
        <>
            <span className="label__containerInner">
                <Tooltip text={text} isVisible={isTruncated}>
                    <Text
                        ref={labelTextRef}
                        as="span"
                        variant={size === "medium" ? "labelMediumMedium" : "labelSmallMedium"}
                        className={classnames(`ellipsis-text label__text`, {
                            label__text_disabled: disabled
                        })}
                    >
                        {text}
                    </Text>
                </Tooltip>
                {required && (
                    <Text
                        as="span"
                        variant={size === "medium" ? "labelMediumMedium" : "labelSmallMedium"}
                        className={classnames(`label__asterisk`, {
                            label__text_disabled: disabled
                        })}
                    >
                        *
                    </Text>
                )}
            </span>
            {infoText && (
                <Info infoText={infoText} disabled={disabled} size={iconSizes[size]} className="label__info" />
            )}
        </>
    ) : null;

    return (
        <Component
            className={classnames(
                `label`,
                `label_variant_${actualVariant}`,
                {
                    label_readOnly: readOnly
                },
                className
            )}
            {...(labelFor && { htmlFor: labelFor })}
            aria-label={text}
            onClick={handlePreventLabelInteraction}
        >
            {children}
            {!labelFor && TextAndRequired ? (
                <span className={classnames("label__container")}>{TextAndRequired}</span>
            ) : (
                TextAndRequired
            )}
        </Component>
    );
};

export { ILabelProps, Label as default };
