import React, { FC, ReactNode, useContext } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { CheckMark, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

import Divider from "../../atoms/Divider";
import { MenuContext, OnchangeHandlerType } from "./Menu";

interface IMenuItemProps {
    selected?: boolean;
    children: ReactNode;
    title?: string;
    onChangeHandler?: (change: OnchangeHandlerType) => void;
    activeElement?: boolean;
    index: number;
    defaultOpened?: never;
    isLoading?: never;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
    danger?: boolean;
    disabled?: boolean;
    id: number | string;
    divider?: boolean;
    loadingText?: string;
    emptyText?: string;
    ComponentRender?: FC;
}

const MenuItem: FC<IMenuItemProps> = ({
    children,
    title,
    activeElement,
    index,
    selected,
    IconBefore,
    IconAfter,
    danger,
    disabled,
    id,
    divider,
    ComponentRender
}) => {
    const customElement = isValidElementType(ComponentRender) && (
        <div className="menu__item_custom">
            <ComponentRender />
        </div>
    );
    const { onChangeHandler } = useContext(MenuContext);
    return (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    <button
                        type="button"
                        className={classNames("menu__item", {
                            menu__item_danger: danger,
                            menu__item_disabled: disabled
                        })}
                        {...(disabled ? { tabIndex: -1 } : {})}
                        onClick={() => {
                            if (onChangeHandler) {
                                onChangeHandler({ index, id, isBack: false, routeAction: true });
                            }
                        }}
                    >
                        <span className="menu__cell">
                            {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                            <span className="menu__itemTitle">{title}</span>
                        </span>

                        <ChevronRight className="menu__icon menu__icon_after" size={20} />
                    </button>
                    {divider && <Divider />}
                    {/* menu list wrapper */}
                    <div
                        className={classNames("menu__list  ", {
                            menu__list_current: activeElement,
                            menu__item_disabled: disabled
                        })}
                    >
                        {/* header */}
                        <button
                            type="button"
                            className="menu__header"
                            onClick={() => {
                                if (onChangeHandler) {
                                    onChangeHandler({ index, id, isBack: true, routeAction: true });
                                }
                            }}
                        >
                            <ChevronLeft className="menu__icon menu__icon_before" size={20} />
                            <p className="menu__headerTitle">{title}</p>
                        </button>
                        <div className="menu__content">{children}</div>
                    </div>
                </>
            ) : (
                // Simple menu item
                <>
                    {customElement || (
                        <button
                            type="button"
                            className={classNames("menu__item", {
                                menu__item_danger: danger,
                                menu__item_selected: selected,
                                menu__item_disabled: disabled
                            })}
                            onClick={() => {
                                if (onChangeHandler) {
                                    onChangeHandler({ index, id, isBack: false, routeAction: false });
                                }
                            }}
                            {...(disabled ? { tabIndex: -1 } : {})}
                        >
                            <span className="menu__cell">
                                {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                                <span className="menu__itemTitle">{children}</span>
                            </span>
                            {(selected && <CheckMark className="menu__icon menu__icon_after" size={20} />) ||
                                (IconAfter && <IconAfter className="menu__icon menu__icon_after" size={20} />)}
                        </button>
                    )}
                    {divider && <Divider />}
                </>
            )}
        </>
    );
};

export { IMenuItemProps, MenuItem as default };
