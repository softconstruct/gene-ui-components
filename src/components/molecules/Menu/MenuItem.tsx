import React, { Children, FC, ReactNode, UIEvent, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { IconProps } from "@geneui/icons";

import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import { isActiveElementInside } from "@components/molecules/Menu/helper";
import MenuItemButton from "@components/molecules/Menu/MenuItemButton";

// components
import { MenuContext } from "./Menu";

interface IMenuItemProps {
    selected?: boolean;
    children?: ReactNode;
    title?: string;
    activeElement?: boolean;
    isLoading?: never;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
    danger?: boolean;
    disabled?: boolean;
    id: number | string;
    divider?: boolean;
    loadingText?: never;
    emptyText?: string;
    ComponentRender?: FC;
    generateId?: string;
    paths?: string[];
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
    const parentRef = useRef<HTMLDivElement | null>(null);
    const { onChangeHandler, swappable, relativeRefsSetter } = useContext(MenuContext);
    const [popoverOpenState, setPopoverOpenState] = useState(false);
    useEffect(() => {
        setPopoverOpenState(
            !!generateId?.length && (paths?.join("_").startsWith(generateId) || paths?.join("_") === generateId)
        );
    }, [generateId, paths]);

    const popoverFloatingRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const onItemClickHandler = (isBack: boolean) => {
        if (onChangeHandler && generateId) {
            onChangeHandler({ generateId, id, isBack, closeMenu: typeof children === "string" });
        }
    };

    useEffect(() => {
        const floatingElement = popoverFloatingRef?.current?.floatingElement;
        if (floatingElement) {
            relativeRefsSetter({
                generateId: generateId || "",
                popoverFloatingRef: floatingElement
            });
        }
    }, [popoverFloatingRef, propsForPopover]);
    const onScrollHandler = (e: UIEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (swappable) return;
        if (popoverOpenState) {
            if (!isActiveElementInside(parentRef, ".menu__item_active")) onItemClickHandler(false);
        }
    };

    const CustomElement = isValidElementType(ComponentRender) && (
        <MenuItemButton
            type="custom"
            onItemClickHandler={onItemClickHandler}
            selected={selected}
            danger={danger}
            disabled={disabled}
            divider={divider}
        >
            <ComponentRender />
        </MenuItemButton>
    );

    return swappable ? (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    <MenuItemButton
                        type="parent"
                        onItemClickHandler={onItemClickHandler}
                        title={title}
                        IconBefore={IconBefore}
                        IconAfter={IconAfter}
                        disabled={disabled}
                        danger={danger}
                        propsForPopover={propsForPopover}
                        active={popoverOpenState}
                        divider={divider}
                    />
                    {/* menu list wrapper */}
                    <div
                        style={{ display: popoverOpenState ? "block" : "none" }}
                        className={classNames("menu__list  ", {
                            menu__list_current: popoverOpenState,
                            menu__item_disabled: disabled
                        })}
                    >
                        <MenuItemButton type="header" onItemClickHandler={onItemClickHandler} title={title} />

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
                </>
            ) : (
                // Simple menu item
                CustomElement || (
                    <MenuItemButton
                        type="simple"
                        onItemClickHandler={onItemClickHandler}
                        danger={danger}
                        selected={selected}
                        disabled={disabled}
                        IconBefore={IconBefore}
                        IconAfter={IconAfter}
                        divider={divider}
                    >
                        {children}
                    </MenuItemButton>
                )
            )}
        </>
    ) : (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    <MenuItemButton
                        type="parent"
                        onItemClickHandler={onItemClickHandler}
                        title={title}
                        IconBefore={IconBefore}
                        IconAfter={IconAfter}
                        disabled={disabled}
                        danger={danger}
                        propsForPopover={propsForPopover}
                        active={popoverOpenState}
                        divider={divider}
                    />
                    {/* menu list wrapper */}
                    <Popover
                        setProps={setPropsForPopover}
                        size={swappable ? "mobile" : "small"}
                        disableReposition
                        position="right-top"
                        withArrow={false}
                        margin={5}
                        open={popoverOpenState}
                        ref={popoverFloatingRef}
                    >
                        <PopoverBody withPadding={false}>
                            <div
                                ref={parentRef}
                                className={classNames("menu__list", {
                                    menu__list_current: activeElement,
                                    menu__item_disabled: disabled
                                })}
                            >
                                <Scrollbar className="menu__content" onScroll={onScrollHandler}>
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
                CustomElement || (
                    <MenuItemButton
                        type="simple"
                        onItemClickHandler={onItemClickHandler}
                        danger={danger}
                        selected={selected}
                        disabled={disabled}
                        IconBefore={IconBefore}
                        IconAfter={IconAfter}
                        divider={divider}
                    >
                        {children}
                    </MenuItemButton>
                )
            )}
        </>
    );
};

export { IMenuItemProps, MenuItem as default };
