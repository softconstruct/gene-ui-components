import React, { cloneElement, FC, isValidElement, ReactNode, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { ChevronRight, IconProps } from "@geneui/icons";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

import { INavigationProps } from "../Navigation";

interface INavigationItemProps {
    title: string;
    children?: ReactNode;
    onClick?: (path: string) => void;
    disabled?: boolean;
    selected?: boolean;
    depth: number;
    Icon?: FC<IconProps>;
    path?: string;
    render?: INavigationProps["render"];
}

const NavigationItem: FC<INavigationItemProps> = ({
    title,
    children,
    onClick,
    disabled,
    selected,
    depth,
    Icon,
    path,
    render
}) => {
    const [isNavItemOpen, setIsNavItemOpen] = useState(false);
    const textRef = useRef<HTMLHeadingElement | null>(null);
    const isTruncated: boolean = useEllipsisDetection(textRef, [title]);
    const onClickHandler = () => {
        if (onClick && path) {
            onClick(path);
        }
        setIsNavItemOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!selected) return;
        setIsNavItemOpen(selected);
    }, [title, selected]);

    const itemContent = (
        <>
            {Icon && <Icon className="navigationItem__icon" size={20} />}
            <Tooltip text={title} isVisible={isTruncated}>
                <Text as="span" variant="labelMediumMedium" className="menu__title ellipsis-text" ref={textRef}>
                    {title}
                </Text>
            </Tooltip>
            {children && (
                <ChevronRight
                    className={classNames("navigationItem__chevron", {
                        navigationItem__chevron_open: isNavItemOpen
                    })}
                    size={20}
                />
            )}
        </>
    );

    const propsToApply = {
        "aria-expanded": children ? isNavItemOpen : undefined,
        disabled,
        className: classNames("navigationItem__button", `navigationItem__button_shift_${depth}`, {
            navigationItem__button_disabled: disabled,
            navigationItem__button_selected: selected,
            navigationItem__button_pointer_none: selected && !children,
            navigationItem__button_selected_noChildren: !children && selected,
            navigationItem__button_render: render && path
        }),
        onClick: onClickHandler
    };

    const linkData = { path, title, isActive: selected, hasChildren: !!children, isDisabled: disabled };

    const interactiveElement = (() => {
        if (render && path) {
            const renderedElement = render(linkData);
            if (isValidElement(renderedElement)) {
                return cloneElement(renderedElement, { ...propsToApply }, itemContent);
            }
        }
        return (
            <button type="button" {...propsToApply}>
                {itemContent}
            </button>
        );
    })();

    return (
        <div className="navigationItem">
            {interactiveElement}
            {isNavItemOpen && children}
        </div>
    );
};

export { INavigationItemProps, NavigationItem as default };
