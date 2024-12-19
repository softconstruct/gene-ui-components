import React, { FC, useState, useMemo, KeyboardEvent } from "react";
import classnames from "classnames";
import { InfoOutlined, IconProps } from "@geneui/icons";

// Components
import Tooltip from "../../molecules/Tooltip";

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
}

/**
 * Info icon component used to provide additional contextual information to users. It appears as a small icon, and is placed near elements where further explanation or clarification is useful.
 */
const Info: FC<IInfoProps> = ({ infoText, disabled, size = "smallNudge", appearance = "default", className }) => {
    const [alwaysShow, setAlwaysShow] = useState(false);

    const keyDownHandler = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (event.key === "Enter") {
            setAlwaysShow((prev) => !prev);
        }
    };

    const handleBlur = () => !disabled && alwaysShow && setAlwaysShow(false);

    const buttonClassNames = useMemo(
        () =>
            classnames("info", className, {
                [`info_appearance_${appearance}`]: appearance,
                info_disabled: disabled
            }),
        [appearance, className, disabled]
    );

    return (
        <Tooltip text={infoText} alwaysShow={alwaysShow} appearance={appearance === "inverse" ? "inverse" : "default"}>
            <button
                type="button"
                disabled={disabled}
                aria-pressed={alwaysShow}
                className={buttonClassNames}
                onKeyDown={keyDownHandler}
                onBlur={handleBlur}
            >
                <InfoOutlined className="info__icon" size={iconSizes[size]} />
            </button>
        </Tooltip>
    );
};

export { IInfoProps, Info as default };
