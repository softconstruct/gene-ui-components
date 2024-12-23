import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Switch.scss";

interface ISwitchProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Switch component props interface
}

/**
 * A switch component allows users to toggle between two states, typically "on" and "off". It is commonly used in settings and preferences to enable or disable features or functionalities.
 */
const Switch: FC<ISwitchProps> = ({ className }) => {
    return <div className={classNames("switch", className)}>Switch</div>;
};

export { ISwitchProps, Switch as default };
