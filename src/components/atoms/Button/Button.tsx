import React, { FC, forwardRef, MouseEvent } from "react";
import classNames from "classnames";
import { IconProps } from "@geneui/icons";

// Styles
import "./Button.scss";

// Components
import Loader from "../Loader";

const iconSizes: Record<"large" | "medium" | "small" | "XSmall", IconProps["size"]> = {
    large: 20,
    medium: 20,
    small: 20,
    XSmall: 16
} as const;

interface IButtonProps {
    /**
     * Specifies the name of the `button`, which can be useful for form submission to identify which button was clicked.
     */
    name?: string;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small" | "XSmall";
    /**
     * If `true`, the `button` will stretch to occupy the full width of its container.
     */
    fullWidth?: boolean;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * Affect form styling point of view. <br>
     * Possible values: `fill | outline | text`
     */
    displayType?: "fill" | "outline" | "text";
    /**
     * Indicates the action meaning. <br>
     * Possible values: `primary | secondary | danger | success | inverse | transparent`
     */
    appearance?: "primary" | "secondary" | "danger" | "success" | "inverse" | "transparent";
    /**
     * The text will shown as content of the `button`.
     */
    text?: string;
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the button text.
     */
    Icon?: FC<IconProps>;
    /**
     * A callback function that is called when the `button` is clicked or entered. <br>
     * It receives an argument containing the event object, which can be a mouse or keyboard event.
     */
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Icon position <br>
     * If the prop is `true` the `Icon` will be shown after the `text` otherwise before the `text`.
     */
    iconAfter?: boolean;
    /**
     * The prop responsible for showing the loading spinner if passed `true`. The default value is `false`
     */
    isLoading?: boolean;
    /**
     * Additional class for the parent element.<br>
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;

    /**
     *  Defines a string value that labels the current element.
     */
    ariaLabel?: string;
}

const loadingTypes = {
    primary: { fill: "inverse", outline: "brand", text: "brand" },
    secondary: { fill: "neutral", outline: "neutral", text: "neutral" },
    danger: { fill: "inverse", outline: "neutral", text: "neutral" },
    success: { fill: "neutral", outline: "neutral", text: "neutral" },
    inverse: { fill: "neutral", outline: "inverse", text: "inverse" },
    transparent: { fill: "inverse", outline: "inverse", text: "inverse" }
} as const;

/**
 * Button initiates an action or event. Use buttons for key actions like submitting a form, saving changes, or advancing to the next step.
 */
const Button = forwardRef<HTMLButtonElement, IButtonProps>(
    (
        {
            appearance = "primary",
            disabled,
            fullWidth,
            name,
            size = "medium",
            displayType = "fill",
            text,
            Icon,
            onClick,
            className,
            iconAfter,
            isLoading,
            ariaLabel
        }: IButtonProps,
        ref
    ) => {
        const isSizeXS = size === "XSmall";
        const isTextDisplayForXS =
            (appearance === "primary" || appearance === "danger" || appearance === "success") && isSizeXS;

        return (
            <button
                ref={ref}
                name={name}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={classNames(
                    `button button_size_${size} 
                    button_color_${appearance} 
                    button_type_${isTextDisplayForXS ? "text" : displayType}`,
                    className,
                    {
                        button_fullWidth: fullWidth,
                        button_icon_before: !iconAfter && Icon && text,
                        button_icon_after: iconAfter && Icon && text,
                        button_icon_only: (!text || isSizeXS) && Icon,
                        button_loading: isLoading
                    }
                )}
                aria-label={ariaLabel}
            >
                {isLoading && (
                    <Loader
                        size="smallNudge"
                        className="button__loader"
                        appearance={loadingTypes[appearance][displayType]}
                    />
                )}

                {Icon && <Icon size={iconSizes[size]} className="button__icon" />}

                {text && !isSizeXS && <span className="button__text">{text}</span>}
            </button>
        );
    }
);

export { IButtonProps, Button as default };
