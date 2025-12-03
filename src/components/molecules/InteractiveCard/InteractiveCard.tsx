import React, { FC, FocusEvent, MouseEvent } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

import Label from "@components/atoms/Label";
import Pill, { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
import { ISwitchProps } from "@components/molecules/Switch";

// Styles
import "./InteractiveCard.scss";

import { Text } from "../../../index";

// Size mapping constants - will be used in subsequent commits
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const iconSizes: Record<"large" | "medium" | "small", IconProps["size"]> = {
    large: 32,
    medium: 24,
    small: 20
} as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const textVariants: Record<"large" | "medium" | "small", "labelMediumMedium" | "labelSmallMedium"> = {
    large: "labelMediumMedium",
    medium: "labelSmallMedium",
    small: "labelSmallMedium"
} as const;

interface IInteractiveCardProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Size of the interactive card.<br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * The label text displayed in the card.
     */
    label?: string;
    /**
     *  Specifies whether the interactive card is mandatory for completing a form.
     */
    required?: boolean;
    /**
     * Additional informational text displayed alongside the label via tooltip.
     */
    infoText?: string;
    /**
     * Description text displayed below the label.
     */
    description?: string;
    /**
     * Icon component to display before the label.
     */
    Icon?: FC<IconProps>;
    /**
     * Disables the interactive card.
     * For interactive cards, this disables the entire card.
     * For non-interactive cards, this only disables the action (checkbox or switch).
     */
    disabled?: boolean;
    /**
     * Determines if the card is interactive (rendered as a button) or non-interactive (rendered as a div).
     * When `true`, the card is rendered as a button and can be clicked.
     * When `false` or undefined, the card is rendered as a div with optional action controls.
     */
    interactive?: boolean;
    /**
     * Click handler for interactive cards.
     * This prop is only used when `interactive` is `true`.
     */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Action component for non-interactive cards.
     * Can be either a Checkbox or Switch configuration object.
     * This prop is only used when `interactive` is `false` or undefined.
     */
    action?: React.ReactElement<ICheckboxProps> | React.ReactElement<ISwitchProps>;
    /**
     * Pill component configuration for non-interactive cards.
     * This prop is only used when `interactive` is `false` or undefined.
     */
    pill?: IPillProps;
    /**
     *  Event handler for when the interactive card element receives focus. Provides the focus event as a callback's argument.
     */
    onFocus?: (e: FocusEvent<HTMLButtonElement>) => void;
}

/**
 * Interactive Card component displays information and engage users through actionable content. Unlike static cards, Interactive Cards respond to user interactions, such as clicks or hovers, triggering actions or revealing additional information.
 */
const InteractiveCard: FC<IInteractiveCardProps> = ({
    className,
    size = "large",
    label,
    required,
    infoText,
    description,
    Icon,
    disabled,
    interactive,
    onClick,
    action,
    pill,
    onFocus
}) => {
    const baseClassName = classNames(
        "interactiveCard",
        `interactiveCard_size_${size}`,
        {
            interactiveCard_interactive: interactive,
            interactiveCard_withIcon: Icon,
            interactiveCard_disabled: interactive && disabled
        },
        className
    );

    if (interactive) {
        return (
            <button type="button" className={baseClassName} onClick={onClick} disabled={disabled} onFocus={onFocus}>
                <span className="interactiveCard__main">
                    {Icon && <Icon className="interactiveCard__icon" size={iconSizes[size]} />}
                    <span className="interactiveCard__content">
                        <Label
                            text={label}
                            infoText={infoText}
                            required={required}
                            size={size === "large" ? "medium" : size}
                            disabled={disabled}
                        />
                        {description && (
                            <Text className="interactiveCard__description" as="span" variant={textVariants[size]}>
                                {description}
                            </Text>
                        )}
                    </span>
                </span>
            </button>
        );
    }
    return (
        <div className={baseClassName}>
            <span className="interactiveCard__main">
                {Icon && <Icon className="interactiveCard__icon" size={iconSizes[size]} />}
                <span className="interactiveCard__content">
                    <Label
                        text={label}
                        infoText={infoText}
                        required={required}
                        size={size === "large" ? "medium" : size}
                    />
                    {description && (
                        <Text className="interactiveCard__description" as="span" variant={textVariants[size]}>
                            {description}
                        </Text>
                    )}
                </span>
            </span>
            {(pill || action) && (
                <span className="interactiveCard__actions">
                    {pill && <Pill {...pill} />}
                    {action}
                </span>
            )}
        </div>
    );
};

export { IInteractiveCardProps, InteractiveCard as default };
