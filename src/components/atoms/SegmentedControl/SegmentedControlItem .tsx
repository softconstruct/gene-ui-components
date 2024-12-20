import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./SegmentedControl.scss";
import { IconProps } from "@geneui/icons";

interface ISegmentedControlItemProps {
    /**
     * The text will shown as content of the `button`.
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
     * Function that will executed using parameter name for each selection
     */
    onSelect?: (name: string) => void;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     *Displays the selected item
     */
    selected?: boolean;
}

const SegmentedControlItem: FC<ISegmentedControlItemProps> = ({
    children,
    name,
    Icon,
    size = "medium",
    disabled = false,
    selected = false,
    onSelect
}) => {
    return (
        <button
            name={name}
            type="button"
            onClick={() => onSelect?.(name)}
            className={classNames(`segmentedControl__block segmentedControl__block_size_${size}`, {
                segmentedControl__block_icon_only: Icon && !children,
                segmentedControl__block_selected: selected,
                segmentedControl__block_withIcon: Icon && children
            })}
            disabled={disabled}
        >
            {Icon && <Icon size={20} />}
            {children && <span className="segmentedControl__text">{children}</span>}
        </button>
    );
};

export { SegmentedControlItem as default, ISegmentedControlItemProps };
