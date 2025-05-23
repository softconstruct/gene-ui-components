import React, { FC, ReactNode, useMemo } from "react";
import classNames from "classnames";

import { CheckMark, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

import Divider from "@components/atoms/Divider";

interface IMenuItemButtonProps {
    type: "header" | "parent" | "simple" | "custom";
    onItemClickHandler: (isBack: boolean) => void;
    disabled?: boolean;
    danger?: boolean;
    active?: boolean;
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
    active,
    divider
}) => {
    const isRTLMode = document.dir === "rtl";
    const onItemClick = () => {
        switch (type) {
            case "parent":
                return onItemClickHandler(!!active);
            case "header":
                return onItemClickHandler(true);
            default:
                return onItemClickHandler(false);
        }
    };

    const MemoizedIconAfter = useMemo(() => {
        if (type === "parent") {
            return isRTLMode ? (
                <ChevronLeft className="menu__icon menu__icon_after" size={20} />
            ) : (
                <ChevronRight className="menu__icon menu__icon_after" size={20} />
            );
        }
        if (type !== "header" && type !== "custom") {
            if (selected && !IconAfter && !danger) {
                return <CheckMark className="menu__icon menu__icon_after" size={20} />;
            }
            if (IconAfter) {
                return <IconAfter className="menu__icon menu__icon_after" size={20} />;
            }
        }

        return <></>;
    }, [type, selected, IconAfter, onItemClick, danger]);

    return (
        <>
            <button
                type="button"
                role="menuitem"
                className={classNames("menu__item", {
                    menu__item_danger: danger,
                    menu__item_disabled: disabled,
                    menu__item_active: active,
                    menu__item_selected: selected,
                    menu__item_header: type === "header"
                })}
                onClick={onItemClick}
                {...(disabled ? { tabIndex: -1 } : {})}
                {...propsForPopover}
            >
                <span className="menu__cell">
                    {type === "header" &&
                        (isRTLMode ? (
                            <ChevronRight className="menu__icon menu__icon_before" size={20} />
                        ) : (
                            <ChevronLeft className="menu__icon menu__icon_before" size={20} />
                        ))}
                    {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                    {title ? <span className={type === "header" ? "menu__headerTitle" : ""}>{title}</span> : children}
                </span>
                {MemoizedIconAfter}
            </button>
            {divider && (
                <div className="menu__divider">
                    <Divider />
                </div>
            )}
        </>
    );
};

export { IMenuItemButtonProps, MenuItemButton as default };
