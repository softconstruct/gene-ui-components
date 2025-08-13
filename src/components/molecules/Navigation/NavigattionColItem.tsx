import React, { cloneElement, FC, isValidElement, useRef } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { INavigationProps } from "../Navigation";

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
    hasChildren?: boolean;
    currentSelected?: boolean;
    render?: INavigationProps["render"];
    compact?: boolean;
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
    isVisible,
    hasChildren,
    currentSelected,
    render,
    compact = false
}) => {
    const textRef = useRef<HTMLHeadingElement | null>(null);
    const isTruncated: boolean = useEllipsisDetection(textRef, [title]);
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

    const propsToApply = {
        ...propsForPopover,
        "aria-label": title,
        disabled: disabled || !isVisible,
        className: classNames("navigation__iconButton", {
            navigation__iconButton_selected: selected,
            navigation__iconButton_currentSelected: currentSelected && !selected && opened,
            navigation__iconButton_pointer_none: selected && !hasChildren,
            navigation__iconButton_disabled: disabled
        }),
        onClick: () => onClickHandler(index || 0),
        onMouseEnter: () => onMouseEnterHandler(index || 0)
    };

    const linkData = {
        path,
        title,
        Icon,
        isActive: selected,
        hasChildren,
        isDisabled: disabled
    };

    const interactiveElement = (() => {
        if (render && path) {
            const renderedElement = render(linkData);
            if (isValidElement(renderedElement)) {
                return cloneElement(renderedElement, { ...propsToApply }, Icon && <Icon />);
            }
        }
        return (
            <button type="button" {...propsToApply}>
                {Icon && <Icon />}
            </button>
        );
    })();

    return (
        <div className="navigation__listItem">
            {interactiveElement}
            {title && !compact && (
                <Tooltip text={title} isVisible={isTruncated}>
                    <Text
                        as="p"
                        variant="captionMediumMedium"
                        className="navigation__listItemText ellipsis-text"
                        ref={textRef}
                    >
                        {title}
                    </Text>
                </Tooltip>
            )}
        </div>
    );
};

export { INavigationColItemProps, NavigationColItem as default };
