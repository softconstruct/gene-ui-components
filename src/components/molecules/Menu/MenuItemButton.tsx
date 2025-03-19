import React, { FC, ReactNode, useMemo } from "react";
import classNames from "classnames";

import { CheckMark, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

import Divider from "@components/atoms/Divider";

interface IMenuItemButtonProps {
    type: "header" | "parent" | "simple" | "custom";
    onItemClickHandler: (isOpen: boolean) => void;
    disabled?: boolean;
    danger?: boolean;
    isOpen?: boolean;
    children?: ReactNode;
    selected?: boolean;
    divider?: boolean;
    propsForPopover?: Record<string, HTMLButtonElement>;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
    title?: string;
}

const MenuItemButton: FC<IMenuItemButtonProps> = ({
    type,
    onItemClickHandler,
    disabled,
    children,
    danger,
    propsForPopover = {},
    IconBefore,
    IconAfter,
    selected,
    title,
    isOpen,
    divider
}) => {
    const onItemClick = () => {
        switch (type) {
            case "parent":
                return onItemClickHandler(!!isOpen);
            case "header":
                return onItemClickHandler(true);
            default:
                return onItemClickHandler(false);
        }
    };

    const MemoizedIconAfter = useMemo(() => {
        if (type === "parent") {
            return <ChevronRight className="menu__icon menu__icon_after" size={20} />;
        }
        if (type !== "header") {
            if (selected) {
                return <CheckMark className="menu__icon menu__icon_after" size={20} />;
            }
            if (IconAfter) {
                return <IconAfter className="menu__icon menu__icon_after" size={20} />;
            }
        }

        return <></>;
    }, [type, selected, IconAfter, onItemClick]);

    return (
        <>
            <button
                type="button"
                className={classNames("menu__item", {
                    menu__item_danger: danger,
                    menu__item_disabled: disabled,
                    menu__item_active: isOpen,
                    menu__header: type === "header"
                })}
                onClick={onItemClick}
                {...(disabled ? { tabIndex: -1 } : {})}
                {...propsForPopover}
            >
                <span className="menu__cell">
                    {type === "header" && <ChevronLeft className="menu__icon menu__icon_before" size={20} />}
                    {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                    {title ? (
                        <span className={type === "header" ? "menu__headerTitle" : "menu__itemTitle"}>{title}</span>
                    ) : (
                        children
                    )}
                </span>
                {MemoizedIconAfter}
            </button>
            {divider && <Divider />}
        </>
    );
};

export { IMenuItemButtonProps, MenuItemButton as default };
