import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Badge.scss";
import { Button } from "../../../index";

interface IBadgeProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Badge component props interface
}

/**
 * Numeric Badge component is a small, circular indicator that displays numerical information, often used to highlight counts or statuses. It is typically positioned adjacent to icons or labels, providing users with a quick visual cue about the number of notifications, messages, or items requiring attention.
 */
const Badge: FC<IBadgeProps> = ({ className }) => {
    return (
        <div className={classNames("badge", className)}>
            <div className="badge__content badge__content_position_absolute badge__content_size_small badge__content_color_brand badge__content_bordered">
                {/* size - // badge_size_small // badge_size_smallNudge // badge_size_xSmall // badge_size_3xSmall */}
                {/* color - // badge_color_brand // badge_color_neutral //badge_color_red // badge_color_inverse */}
                {/* border - // badge_bordered */}
                <p className="badge__num">1</p>
            </div>
            <Button appearance="danger" text="Button" />
        </div>
    );
};

export { IBadgeProps, Badge as default };
