import React, { FC, useEffect } from "react";
import classNames from "classnames";

import { ChevronRight, IconProps } from "@geneui/icons";

import Text from "@components/atoms/Text";

interface INavigationItemProps {
    title: string;
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    selected?: boolean;
    depth: number;
    Icon?: FC<IconProps>;
}

const NavigationItem: FC<INavigationItemProps> = ({ title, children, onClick, disabled, selected, depth, Icon }) => {
    const [isNavItemOpen, setIsNavItemOpen] = React.useState(false);

    const onclickHandler = () => {
        if (onClick) {
            onClick();
        }
        setIsNavItemOpen((prev) => !prev);
    };
    useEffect(() => {
        setIsNavItemOpen(false);
    }, [title]);
    return (
        <div className="navigationItem">
            <button
                disabled={disabled}
                type="button"
                className={classNames("navigationItem__button", `navigationItem__button_shift_${depth}`, {
                    navigationItem__button_disabled: disabled,
                    navigationItem__button_selected: selected,
                    navigationItem__button_selected_noChildren: !children && selected
                })}
                onClick={onclickHandler}
            >
                {Icon && (
                    <span className="navigationItem__icon">
                        <Icon size={20} />
                    </span>
                )}
                <Text as="p" className="menu__title" truncate>
                    {title}
                </Text>
                {children && (
                    <ChevronRight
                        className={classNames("navigationItem__chevron", {
                            navigationItem__chevron_open: isNavItemOpen
                        })}
                        size={20}
                    />
                )}
            </button>
            {isNavItemOpen && children && children}
        </div>
    );
};

export { INavigationItemProps, NavigationItem as default };
