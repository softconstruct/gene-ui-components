import React, { FC } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Styles
import "./SegmentedControl.scss";

interface ISegmentedControlButtonProps {
    /**
     * The text will show as content of the `button`.
     */
    children?: string;
    /**
     * Specifies the name of the `button`, which can be useful for identify which button was clicked.
     */
    name: string;
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the button text.
     */
    Icon?: FC<IconProps>;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Function that will execute using parameter name for each selection
     */
    onSelect?: (name: string) => void;
    /**
     *Displays the selected item
     */
    selected?: boolean;
    /**
     * Tab index managed by parent for roving focus
     */
    tabIndex?: number;
}

const SegmentedControlButton: FC<ISegmentedControlButtonProps> = ({
    children,
    name,
    Icon,
    size = "medium",
    selected = false,
    onSelect,
    tabIndex
}) => {
    const selectHandler = () => {
        onSelect?.(name);
    };

    return (
        <button
            name={name}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={tabIndex}
            onClick={selectHandler}
            className={classNames(`segmentedControl__button segmentedControl__button_size_${size}`, {
                segmentedControl__button_icon_only: Icon && !children,
                segmentedControl__button_selected: selected,
                segmentedControl__button_withIcon: Icon && children
            })}
        >
            {Icon && <Icon size={20} />}
            {children && <span className="segmentedControl__text">{children}</span>}
        </button>
    );
};

export { SegmentedControlButton as default, ISegmentedControlButtonProps };
