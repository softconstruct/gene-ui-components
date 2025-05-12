import React, { FC } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

import Text from "@components/atoms/Text";

interface INavigationColItemProps {
    Icon?: FC<IconProps>;
    selected?: boolean;
    disabled?: boolean;
    title?: string;
    index?: number;
    opened?: boolean;
    onClick?: (index: number, path?: string) => void;
    onMouseEnter?: (index: number) => void;
    path?: string;
    propsForPopover?: Record<string, HTMLButtonElement>;
    isVisible?: boolean;
}

const NavigationColItem: FC<INavigationColItemProps> = ({
    Icon,
    selected,
    disabled,
    title,
    onClick,
    index,
    onMouseEnter,
    propsForPopover = {},
    opened,
    path,
    isVisible
}) => {
    const onClickHandler = (activeIndex?: number) => {
        if (onClick) {
            onClick(activeIndex || 0, path);
        }
    };

    const onMouseEnterHandler = (activeIndex: number | undefined) => {
        if (onMouseEnter && activeIndex !== undefined && activeIndex >= 0) {
            onMouseEnter(activeIndex);
        }
    };

    return (
        <div className="navigation__colItem">
            <button
                type="button"
                disabled={disabled || !isVisible}
                className={classNames("navigation__iconButton", {
                    navigation__iconButton_selected: selected,
                    navigation__iconButton_opened: opened && !selected,
                    navigation__iconButton_disabled: disabled
                })}
                onClick={() => onClickHandler(index)}
                onMouseEnter={() => onMouseEnterHandler(index)}
                {...propsForPopover}
            >
                {Icon && <Icon />}
            </button>
            {title && (
                <Text as="p" className="navigation__colItemText" truncate>
                    {title}
                </Text>
            )}
        </div>
    );
};

export { INavigationColItemProps, NavigationColItem as default };
