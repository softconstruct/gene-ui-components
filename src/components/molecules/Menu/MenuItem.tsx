import React, { Children, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { IconProps } from "@geneui/icons";

import { Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
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
    const { onChangeHandler, swappable, relativeRefsSetter } = useContext(MenuContext);
    const isOpen = !!generateId?.length && (paths?.join("_").startsWith(generateId) || paths?.join("_") === generateId);
    const popoverBodyRef = useRef<HTMLDivElement | null>(null);

    const onItemClickHandler = (isBack: boolean) => {
        if (onChangeHandler && generateId) {
            onChangeHandler({ generateId, id, isBack });
        }
    };

    useEffect(() => {
        relativeRefsSetter({ generateId: generateId || "", popoverBodyRef });
    }, [popoverBodyRef.current, propsForPopover]);

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

    const popoverCloseHandler = () => {
        // console.log(innerActiveState, activeElement, index, "popoverCloseHandler");
    };

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
                        isOpen={isOpen}
                        divider={divider}
                    />
                    {/* menu list wrapper */}
                    <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className={classNames("menu__list  ", {
                            menu__list_current: isOpen,
                            menu__item_disabled: disabled
                        })}
                    >
                        {/* header */}
                        {swappable && (
                            <MenuItemButton type="header" onItemClickHandler={onItemClickHandler} title={title} />
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
                        isOpen={isOpen}
                        divider={divider}
                    />
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
                        <PopoverBody withPadding={false} ref={popoverBodyRef}>
                            <div
                                className={classNames("menu__list  ", {
                                    menu__list_current: activeElement,
                                    menu__item_disabled: disabled
                                })}
                            >
                                {/* header */}
                                {swappable && (
                                    <MenuItemButton
                                        type="header"
                                        onItemClickHandler={onItemClickHandler}
                                        title={title}
                                    />
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
