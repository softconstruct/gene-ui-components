import React, { FC, JSX } from "react";
import classNames from "classnames";

// Styles
import "./Badge.scss";

const getValue = (value?: number, maxValue?: number, size?: string) => {
    if (size !== "small") return null;
    if (!value && value !== 0) return null;
    if (!maxValue) return value;
    return value > maxValue ? `${maxValue}+` : value;
};

interface IBadgeProps {
    /**
     * Determines whether the badge component should display a border around it.
     * When set to `true`, the `badge` will render with a visible `border`.
     */
    withBorder?: boolean;
    /**
     * Size <br>
     * Possible values: `small | smallNudge | xSmall | 3xSmall`
     */
    size?: "small" | "smallNudge" | "xSmall" | "3xSmall";
    /**
     * Determines the visual appearance of the `badge`. <br>
     * Possible values: `brand | neutral | red | inverse`
     */
    appearance?: "brand" | "neutral" | "red" | "inverse";
    /**
     * The value will shown as content of the `badge`.
     */
    value?: number;
    /**
     *  When the `value` is greater than `maxValue` `badge` will show `maxValue` value and `+`
     */
    maxValue?: number;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using `BEM` conventions.
     */
    className?: string;
    /**
     * Specifies the element or component on which the `badge` will be displayed.
     * The `badge` is positioned `relative` to this child `element`, allowing it to overlay or attach to the `element`.
     */
    children?: JSX.Element;
}

/**
 * Numeric Badge component is a small, circular indicator that displays numerical information, often used to highlight counts or statuses. It is typically positioned adjacent to icons or labels, providing users with a quick visual cue about the number of notifications, messages, or items requiring attention.
 */

const Badge: FC<IBadgeProps> = ({
    className,
    appearance = "brand",
    withBorder,
    size = "small",
    value,
    maxValue,
    children
}) => {
    const badgeValue = getValue(value, maxValue, size);

    return (
        <div className={classNames("badge", className)}>
            <div
                className={classNames(
                    `badge__content badge__content_color_${appearance} badge__content_size_${size}`,
                    className,
                    {
                        badge__content_bordered: withBorder,
                        badge__content_position_absolute: children
                    }
                )}
            >
                {!!badgeValue && <p className="badge__num">{badgeValue}</p>}
            </div>
            {children}
        </div>
    );
};

export { IBadgeProps, Badge as default };
