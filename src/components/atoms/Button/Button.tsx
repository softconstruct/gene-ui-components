import React, { FC, forwardRef, MouseEvent } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Components
import Loader from "@components/atoms/Loader";

// Styles
import "./Button.scss";

const iconSizes: Record<"large" | "medium" | "small" | "smallNudge", IconProps["size"]> = {
    large: 20,
    medium: 20,
    small: 20,
    smallNudge: 16
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
    size?: "large" | "medium" | "small" | "smallNudge";
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
    layout?: "fill" | "outline" | "text";
    /**
     * Indicates the action meaning. <br>
     * Possible values: `primary | secondary | danger | success | inverse | transparent`
     */
    appearance?: "primary" | "secondary" | "danger" | "success" | "inverse" | "transparent";
    /**
     * The text will shown as content of the `button`.
     */
    children?: string;
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
     * Possible values: `before | after`
     */
    iconPosition?: "before" | "after";
    /**
     * The prop responsible for showing the loading spinner if passed `true`. The default value is `false`
     */
    loading?: boolean;
    /**
     * Additional class for the parent element.<br>
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
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
            layout = "fill",
            children,
            Icon,
            onClick,
            className,
            iconPosition,
            loading
        }: IButtonProps,
        ref
    ) => {
        const isSizeXS = size === "smallNudge";
        const isTextDisplayForXS =
            (appearance === "primary" || appearance === "danger" || appearance === "success") && isSizeXS;

        return (
            <button
                ref={ref}
                name={name}
                type="button"
                onClick={onClick}
                disabled={disabled && !loading}
                {...(loading ? { tabIndex: -1 } : {})}
                className={classNames(
                    `button button_size_${size} 
                    button_color_${appearance} 
                    button_type_${isTextDisplayForXS ? "text" : layout}`,
                    className,
                    {
                        button_fullWidth: fullWidth,
                        button_icon_before: iconPosition === "before" && Icon && children,
                        button_icon_after: iconPosition === "after" && Icon && children,
                        button_icon_only: (!children || isSizeXS) && Icon,
                        button_loading: loading
                    }
                )}
            >
                {loading && (
                    <Loader
                        size="smallNudge"
                        className="button__loader"
                        appearance={loadingTypes[appearance][layout]}
                    />
                )}

                {Icon && <Icon size={iconSizes[size]} className="button__icon" />}

                {children && !isSizeXS && <span className="button__text">{children}</span>}
            </button>
        );
    }
);

export { IButtonProps, Button as default };
