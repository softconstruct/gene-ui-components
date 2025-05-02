import React, { FC } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

import Text from "@components/atoms/Text";

interface INavigationColItemProps {
    Icon?: FC<IconProps>;
    active?: boolean;
    disabled?: boolean;
    title?: string;
    index?: number;
    opened?: boolean;
    onClick?: (index: number) => void;
    onMouseEnter?: (index: number) => void;
    onMouseLeave?: () => void;
    propsForPopover?: Record<string, HTMLButtonElement>;
}

const NavigationColItem: FC<INavigationColItemProps> = ({
    Icon,
    active,
    disabled,
    title,
    onClick,
    index,
    onMouseEnter,
    onMouseLeave,
    propsForPopover = {},
    opened
}) => {
    const onClickHandler = (activeIndex?: number) => {
        if (onClick) {
            onClick(activeIndex || 0);
        }
    };

    const onMouseEnterHandler = (activeIndex: number | undefined) => {
        // const hasIndex = typeof activeIndex === "number";

        if (onMouseEnter && activeIndex !== undefined && activeIndex >= 0) {
            onMouseEnter(activeIndex);
        }
    };

    return (
        <div className="navigation__colItem" onMouseLeave={onMouseLeave}>
            <button
                type="button"
                disabled={disabled}
                className={classNames("navigation__iconButton", {
                    navigation__iconButton_active: active,
                    navigation__iconButton_opened: opened && !active,
                    navigation__iconButton_disabled: disabled
                })}
                onClick={() => onClickHandler(index)}
                onMouseEnter={() => onMouseEnterHandler(index)}
                {...propsForPopover}
            >
                {Icon && <Icon />}
            </button>
            {title && (
                <Text as="p" className="navigation__colItem_text" truncate>
                    {title}
                </Text>
            )}
        </div>
    );
};

export { INavigationColItemProps, NavigationColItem as default };
