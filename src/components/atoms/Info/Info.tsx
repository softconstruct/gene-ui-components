import React, { FC, KeyboardEvent, MouseEvent, useMemo, useState } from "react";
import classnames from "classnames";

import { IconProps, Info as InfoIcon } from "@geneui/icons";

// Components
import Tooltip from "@components/molecules/Tooltip";

// Styles
import "./Info.scss";

const iconSizes: Record<"small" | "smallNudge" | "XSmall", IconProps["size"]> = {
    small: 24,
    smallNudge: 20,
    XSmall: 16
} as const;

interface IInfoProps {
    /**
     * The text that will be displayed inside the tooltip when the user interacts with the info icon.
     */
    infoText: string;
    /**
     * Disables the info icon button, preventing any interaction (click, key down, or focus).<br>
     * When `disabled` is true, the button becomes non-interactive, and the tooltip won't be shown.
     */
    disabled?: boolean;
    /**
     * Defines the size of the info icon.<br>
     * Possible values: `small | smallNudge | XSmall`
     */
    size?: keyof typeof iconSizes;
    /**
     * Determines the visual appearance of the info icon.<br>
     * Possible values: `default | brand | inverse`
     */
    appearance?: "default" | "brand" | "inverse";
    /**
     * Additional class for the parent element.<br>
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Provides an accessible label for the info icon button for screen readers.<br>
     * If not provided, defaults to "press enter to open tooltip". This label describes the button's purpose and interaction method.
     */
    "aria-label"?: string;
    /**
     * Renders a non-button trigger when Info is placed inside another interactive element
     * (e.g. a dropdown option). Required to avoid invalid nested `<button>` markup.
     */
    presentational?: boolean;
}

/**
 * Info icon component used to provide additional contextual information to users. It appears as a small icon, and is placed near elements where further explanation or clarification is useful.
 */
const Info: FC<IInfoProps> = ({
    infoText,
    disabled,
    size = "smallNudge",
    appearance = "default",
    className,
    "aria-label": ariaLabel,
    presentational = false
}) => {
    const [alwaysShow, setAlwaysShow] = useState(false);

    const keyDownHandler = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (event.key === "Enter") {
            setAlwaysShow((prev) => !prev);
        }
    };

    const handleBlur = () => !disabled && alwaysShow && setAlwaysShow(false);

    const stopPresentationalTriggerPropagation = (event: MouseEvent<HTMLSpanElement>) => {
        event.stopPropagation();
    };

    const buttonClassNames = useMemo(
        () =>
            classnames("info", className, {
                [`info_appearance_${appearance}`]: appearance,
                info_disabled: disabled
            }),
        [appearance, className, disabled]
    );
    const tooltipAppearance = appearance === "inverse" ? "inverse" : "default";
    const icon = <InfoIcon className="info__icon" size={iconSizes[size]} />;

    const trigger = presentational ? (
        <span
            aria-hidden="true"
            className={buttonClassNames}
            onClick={stopPresentationalTriggerPropagation}
            onMouseDown={stopPresentationalTriggerPropagation}
        >
            {icon}
        </span>
    ) : (
        <button
            type="button"
            aria-label={ariaLabel || "press enter to open tooltip"}
            disabled={disabled}
            aria-pressed={alwaysShow}
            className={buttonClassNames}
            onKeyDown={keyDownHandler}
            onBlur={handleBlur}
        >
            {icon}
        </button>
    );

    return (
        <Tooltip
            text={infoText}
            alwaysShow={presentational ? undefined : alwaysShow}
            appearance={tooltipAppearance}
            isVisible={!disabled}
        >
            {trigger}
        </Tooltip>
    );
};

export { IInfoProps, Info as default };
