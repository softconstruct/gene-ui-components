import React, { FC, PointerEvent, useState } from "react";

import { CaretDown, IconProps } from "@geneui/icons";

// Styles
import "./SplitButton.scss";

import { Popover } from "../Popover";

// import { Icon } from "../../../index";

interface ISplitButtonProps {
    /**
     * size description
     */
    size?: "large" | "medium" | "small";

    appearance?: "outline" | "fill" | "inverse";

    type?: "primary" | "secondary";
    Icon?: FC<IconProps>;

    onClick: (e: PointerEvent<HTMLButtonElement>) => void;
}

/**
 * A split button allows users to choose from several related actions. The primary action is displayed as the button label, while additional actions are accessible from a dropdown menu.
 */
const SplitButton: FC<ISplitButtonProps> = ({
    size = "large",
    appearance = "fill",
    type = "primary",
    onClick,
    Icon
}) => {
    const [props, setProps] = useState({});

    return (
        <div className="splitButton">
            <div className="splitButton__content">
                <button
                    type="button"
                    onClick={onClick}
                    className={`splitButton__button splitButton__button_size_${size} splitButton__button_color_${type} splitButton__button_type_${appearance} splitButton__button_icon_before`}
                >
                    {Icon && <Icon size={20} className="button__icon" />}
                    <span className="splitButton__text">Button</span>
                </button>

                <button
                    type="button"
                    {...props}
                    className={`splitButton__button splitButton__button_size_${size} splitButton__button_color_${type} splitButton__button_type_${appearance} splitButton__button_icon_only`}
                >
                    <CaretDown className="splitButton__icon" />
                </button>
                <Popover setProps={setProps} position="bottom-left">
                    sqw
                </Popover>
            </div>
        </div>
    );
};

export { ISplitButtonProps, SplitButton as default };
