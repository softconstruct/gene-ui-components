import React, { FC, JSX } from "react";
import classNames from "classnames";

// Styles
import "./Badge.scss";

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
     *  Specifies the maximum value to display inside the `badge`.
     *  If the badge's `value` exceeds this maximum, it will display as `{maxValue}+`.
     *  The maximum allowable value for `maxValue` is capped at `99`.
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
     *
     * **Note**: When using the `children` prop, only `xSmall` and `3xSmall` sizes are supported for the `badge`.
     *
     * The default size for the badge when `children` is provided is `3xSmall`.
     */
    children?: JSX.Element;
}

const MAX_VALUE = 99;

const getValue = (value?: number, maxValue?: number, size?: IBadgeProps["size"]) => {
    if (!Number(value) || size !== "small" || !value) return null;
    if (!maxValue) return value;

    const calculatedMaxValue = maxValue > 0 && maxValue < MAX_VALUE ? maxValue : MAX_VALUE;

    return value > calculatedMaxValue ? `${calculatedMaxValue}+` : value;
};

const getSize = (withChildren: boolean, size?: IBadgeProps["size"]) => {
    if (!withChildren || size === "xSmall") return size;
    return "3xSmall";
};

/**
 * Numeric Badge component is a small, circular indicator that displays numerical information, often used to highlight counts or statuses. It is typically positioned adjacent to icons or labels, providing users with a quick visual cue about the number of notifications, messages, or items requiring attention.
 */

const Badge: FC<IBadgeProps> = ({
    className,
    appearance = "brand",
    withBorder,
    size = "small",
    value,
    maxValue = 99,
    children
}) => {
    const badgeSize = getSize(!!children, size);
    const badgeValue = getValue(value, maxValue, badgeSize);

    return (
        <div className={classNames("badge", className)}>
            <div
                className={classNames(
                    `badge__content badge__content_color_${appearance} badge__content_size_${badgeSize}`,
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
