/* eslint-disable react/button-has-type */
import React from "react";

// Styles
import "./SplitButton.scss";
// import { Icon } from "../../../index";
// import { ArrowBigRight, ArrowRight } from "lucide-react";

interface ISplitButtonProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * A split button allows users to choose from several related actions. The primary action is displayed as the button label, while additional actions are accessible from a dropdown menu.
 */
const SplitButton = ({ size }: ISplitButtonProps) => {
    return (
        <div className="splitButton">
            <div className="splitButton__content">
                <button
                    className={`splitButton__button splitButton__button_size_${size} splitButton__button_color_primary splitButton__button_type_fill splitButton__button_icon_before`}
                >
                    {/* <Icon className="splitButton__icon" type={"bc-icon-info"} disabled={false} isFilled={true} /> */}
                    <span className="splitButton__text">Button</span>
                </button>
                <button className="splitButton__button splitButton__button_size_large splitButton__button_color_primary splitButton__button_type_fill splitButton__button_icon_only">
                    {/* <Icon className="splitButton__icon" type={"bc-icon-info"} disabled={false} isFilled={true} /> */}
                </button>
            </div>
        </div>
    );
};

export { ISplitButtonProps, SplitButton as default };
