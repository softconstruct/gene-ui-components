import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Switch.scss";
import { CheckMark } from "@geneui/icons";
import HelperText from "../../atoms/HelperText";

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
    return (
        // todo: switch in the next classNames for labelText alignment: "switch_labelAfter", "switch_labelBefore", "switch_labelTop"
        <div className={classNames("switch switch_labelAfter", className)}>
            <label className="switch__label">
                <input type="checkbox" className="switch__input" disabled={false} readOnly={false} />
                <span className="switch__slider">
                    <CheckMark size={16} className="switch__icon" />
                </span>
                <span className="switch__labelText">Label</span>
            </label>
            <HelperText text="Helper Text" className="switch__helperText" />
        </div>
    );
};

export { ISwitchProps, Switch as default };
