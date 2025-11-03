import React, { FC, useContext } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

import Text from "@components/atoms/Text";
import { SegmentedControlContext } from "@components/molecules/SegmentedControl/SegmentedControl";

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
     *Displays the selected item
     */
    selected?: boolean;
}

const SegmentedControlButton: FC<ISegmentedControlButtonProps> = ({ children, name, Icon, selected = false }) => {
    const { size, onSelect } = useContext(SegmentedControlContext);

    const selectHandler = () => {
        onSelect?.(name);
    };

    return (
        <button
            name={name}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={selectHandler}
            className={classNames(`segmentedControl__button segmentedControl__button_size_${size}`, {
                segmentedControl__button_icon_only: Icon && !children,
                segmentedControl__button_selected: selected,
                segmentedControl__button_withIcon: Icon && children
            })}
        >
            {Icon && <Icon size={20} />}
            {children && (
                <Text as="span" variant="labelMediumSemibold" className="segmentedControl__text">
                    {children}
                </Text>
            )}
        </button>
    );
};

export { SegmentedControlButton as default, ISegmentedControlButtonProps };
