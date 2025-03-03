import React, { Children, FC, ReactNode, useContext, useState } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { CheckMark, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

import { Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";

// components
import Divider from "../../atoms/Divider";
import { MenuContext } from "./Menu";

interface IMenuItemProps {
    selected?: boolean;
    preventIndex: string;
    children: ReactNode;
    title?: string;
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
    generateId: string;
    paths: string[];
}

const MenuItem: FC<IMenuItemProps> = ({
    children,
    title,
    activeElement,

    selected,
    IconBefore,
    IconAfter,
    danger,
    disabled,
    id,
    divider,
    ComponentRender,
    emptyText,
    paths,
    generateId
}) => {
    const [propsForPopover, setPropsForPopover] = useState({});
    const { onChangeHandler, swappable } = useContext(MenuContext);

    const customElement = isValidElementType(ComponentRender) && (
        <div className="menu__item_custom">
            <ComponentRender />
        </div>
    );
    const isOpen = paths.join("_").includes(generateId);

    const parentButtonClickHandler = () => {
        if (onChangeHandler) {
            onChangeHandler({ index: generateId, id, isBack: isOpen, routeAction: true });
        }
    };

    const popoverCloseHandler = () => {
        // console.log(innerActiveState, activeElement, index, "popoverCloseHandler");
    };

    return swappable ? (
        <>
            <span>swipe</span>
        </>
    ) : (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    <button
                        type="button"
                        className={classNames("menu__item", {
                            menu__item_danger: danger,
                            menu__item_disabled: disabled,
                            menu__item_active: activeElement
                        })}
                        {...(disabled ? { tabIndex: -1 } : {})}
                        {...propsForPopover}
                        onClick={parentButtonClickHandler}
                    >
                        <span className="menu__cell">
                            {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                            <span className="menu__itemTitle">{title}</span>
                        </span>

                        <ChevronRight className="menu__icon menu__icon_after" size={20} />
                    </button>
                    {divider && <Divider />}
                    {/* menu list wrapper */}
                    <Popover
                        setProps={setPropsForPopover}
                        size={swappable ? "mobile" : "small"}
                        disableReposition
                        position="right-top"
                        withArrow={false}
                        padding={5}
                        onClose={popoverCloseHandler}
                        open={isOpen}
                    >
                        <PopoverBody withPadding={false}>
                            <div
                                className={classNames("menu__list  ", {
                                    menu__list_current: activeElement,
                                    menu__item_disabled: disabled
                                })}
                            >
                                {/* header */}
                                {swappable && (
                                    <button
                                        type="button"
                                        className="menu__header"
                                        onClick={() => {
                                            if (onChangeHandler) {
                                                onChangeHandler({
                                                    index: generateId,
                                                    id,
                                                    isBack: isOpen,
                                                    routeAction: true
                                                });
                                            }
                                        }}
                                    >
                                        <ChevronLeft className="menu__icon menu__icon_before" size={20} />
                                        <p className="menu__headerTitle">{title}</p>
                                    </button>
                                )}

                                <Scrollbar className="menu__content">
                                    {Children.count(children) > 0 ? (
                                        <span className="menu__itemTitle">{children}</span>
                                    ) : (
                                        <div className="menu__empty">
                                            <h1>{emptyText || "No data to show"} e</h1>
                                        </div>
                                    )}
                                </Scrollbar>
                            </div>
                        </PopoverBody>
                    </Popover>
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
                                    onChangeHandler({ index: generateId, id, isBack: false, routeAction: false });
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
