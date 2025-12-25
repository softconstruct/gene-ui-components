import React, { ChangeEvent, FC, FocusEvent, MouseEvent, useMemo } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import Pill, { IPillProps } from "@components/atoms/Pill";
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import Switch from "@components/molecules/Switch";

// Styles
import "./InteractiveCard.scss";

const iconSizes: Record<"large" | "medium" | "small", IconProps["size"]> = {
    large: 32,
    medium: 24,
    small: 20
} as const;
const textVariants: Record<"large" | "medium" | "small", "labelMediumMedium" | "labelSmallMedium"> = {
    large: "labelMediumMedium",
    medium: "labelSmallMedium",
    small: "labelSmallMedium"
} as const;

interface IInteractiveCardActionProps {
    /**
     * The type of action to perform.
     * Possible values: `checkbox` | `switch`
     */
    type: "checkbox" | "switch";
    /**
     * The function to call when the action is clicked.
     */
    onClick?: (e: MouseEvent<HTMLInputElement>) => void;
    /**
     * The function to call when the action is changed.
     */
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /**
     * The function to call when the action is focused.
     */
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     * The function to call when the action is blurred.
     */
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    /**
     * The name of the action.
     */
    name?: string;
    /**
     * The value of the action.
     */
    value?: string;
    /**
     * The checked state of the action.
     */
    checked?: boolean;
    /**
     * The default checked state of the action.
     */
    defaultChecked?: boolean;
}

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
     * Pill component configuration.
     * When provided, renders a `Pill` with these props.
     */
    pill?: IPillProps;
    /**
     * Action component configuration.
     * When provided, renders either `Checkbox` or `Switch` with these props.
     */
    actionProps?: IInteractiveCardActionProps;
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
    size = "medium",
    label,
    infoText,
    description,
    Icon,
    disabled,
    interactive,
    onClick,
    actionProps,
    pill,
    onFocus
}) => {
    const baseClassName = classNames(
        "interactiveCard",
        `interactiveCard_size_${size}`,
        `interactiveCard_mode_${interactive ? "interactive" : "static"}`,
        {
            interactiveCard_withIcon: Icon,
            interactiveCard_disabled: interactive && disabled
        },
        className
    );

    const actionComponent = useMemo(() => {
        if (actionProps?.type === "checkbox") {
            return (
                <Checkbox
                    {...actionProps}
                    disabled={disabled}
                    name={actionProps?.name || ""}
                    value={actionProps?.value || ""}
                />
            );
        }
        return <Switch {...actionProps} disabled={disabled} />;
    }, [actionProps, disabled]);

    if (interactive) {
        return (
            <button type="button" className={baseClassName} onClick={onClick} disabled={disabled} onFocus={onFocus}>
                <span className="interactiveCard__main">
                    {Icon && <Icon className="interactiveCard__icon" size={iconSizes[size]} />}
                    <span
                        className={classNames("interactiveCard__content", {
                            interactiveCard__content_onlyDescription: !label && description
                        })}
                    >
                        {label && (
                            <Label
                                text={label}
                                infoText={infoText}
                                size={size === "large" ? "medium" : size}
                                disabled={disabled}
                            />
                        )}
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
                <span
                    className={classNames("interactiveCard__content", {
                        interactiveCard__content_onlyDescription: !label && description
                    })}
                >
                    {label && <Label text={label} infoText={infoText} size={size === "large" ? "medium" : size} />}
                    {description && (
                        <Text className="interactiveCard__description" as="span" variant={textVariants[size]}>
                            {description}
                        </Text>
                    )}
                </span>
            </span>
            <span className="interactiveCard__actions">
                {pill && <Pill {...pill} />}
                {actionComponent}
            </span>
        </div>
    );
};

export { IInteractiveCardProps, InteractiveCard as default };
