import React, { FC, useEffect, useRef } from "react";
import classNames from "classnames";

import { ChevronRight, IconProps } from "@geneui/icons";

// Components
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

interface INavigationItemProps {
    title: string;
    children?: React.ReactNode;
    onClick?: (path: string) => void;
    disabled?: boolean;
    selected?: boolean;
    depth: number;
    Icon?: FC<IconProps>;
    path?: string;
}

const NavigationItem: FC<INavigationItemProps> = ({
    title,
    children,
    onClick,
    disabled,
    selected,
    depth,
    Icon,
    path
}) => {
    const [isNavItemOpen, setIsNavItemOpen] = React.useState(false);
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
    return (
        <div className="navigationItem">
            <button
                disabled={disabled}
                type="button"
                className={classNames("navigationItem__button", `navigationItem__button_shift_${depth}`, {
                    navigationItem__button_disabled: disabled,
                    navigationItem__button_selected: selected,
                    navigationItem__button_pointer_none: selected && !children,
                    navigationItem__button_selected_noChildren: !children && selected
                })}
                onClick={onClickHandler}
            >
                {Icon && (
                    <span className="navigationItem__icon">
                        <Icon size={20} />
                    </span>
                )}
                <Tooltip text={title} isVisible={isTruncated}>
                    <Text as="p" className="menu__title ellipsis-text" ref={textRef}>
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
            </button>
            {isNavItemOpen && children}
        </div>
    );
};

export { INavigationItemProps, NavigationItem as default };
