import React, { Children, FC, ReactNode, UIEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { IconProps } from "@geneui/icons";

// Components
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import MenuItemButton from "@components/molecules/Menu/MenuItemButton";

// Helpers
import { isActiveElementInside } from "./helper";
import { MenuContext, popoverSizeMapping } from "./Menu";

interface IMenuItemProps {
    selected?: boolean;
    children?: ReactNode;
    title?: string;
    activeElement?: boolean;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
    danger?: boolean;
    disabled?: boolean;
    id: number | string;
    divider?: boolean;
    emptyText?: string;
    ComponentRender?: FC;
    generateId?: string;
    paths?: string[];
    // todo remove loadingText and isLoading
    loadingText?: never;
    isLoading?: never;
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
    emptyText = "No data to show",
    paths,
    generateId
}) => {
    const [propsForPopover, setPropsForPopover] = useState({});
    const parentRef = useRef<HTMLDivElement | null>(null);
    const { onChangeHandler, swappable, relativeRefsSetter, size } = useContext(MenuContext);
    const [popoverOpenState, setPopoverOpenState] = useState(false);
    const [isActiveSwappableContent, setIsActiveSwappableContent] = useState(false);

    useEffect(() => {
        const shouldOpenPopover =
            !!generateId?.length && (paths?.join("_").startsWith(generateId) || paths?.join("_") === generateId);
        setPopoverOpenState(shouldOpenPopover);
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

    useEffect(() => {
        if (!swappable) return;
        const pathId = paths?.join("_");
        const isMatch = generateId?.startsWith(pathId || "");
        setIsActiveSwappableContent(!paths?.length || !!isMatch);
    }, [paths, swappable, generateId]);

    const renderedSwappableContent = useMemo(() => {
        if (Children.count(children) === 0) {
            return (
                <div className="menu__empty">
                    <h1>{emptyText}</h1>
                </div>
            );
        }

        if (isActiveSwappableContent) {
            return (
                <Scrollbar className="menu__content">
                    <span className="menu__itemTitle">{children}</span>
                </Scrollbar>
            );
        }

        return <span className="menu__itemTitle">{children}</span>;
    }, [children, emptyText, isActiveSwappableContent]);

    return swappable ? (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    {isActiveSwappableContent && !popoverOpenState && (
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
                    )}
                    {/* menu list wrapper */}
                    <div
                        className={classNames("menu__list", {
                            menu__list_current: popoverOpenState,
                            menu__list_hidden: !popoverOpenState
                        })}
                    >
                        {isActiveSwappableContent && (
                            <MenuItemButton type="header" onItemClickHandler={onItemClickHandler} title={title} />
                        )}

                        {renderedSwappableContent}
                    </div>
                </>
            ) : (
                // Simple menu item
                isActiveSwappableContent &&
                (CustomElement || (
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
                ))
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
                        size={popoverSizeMapping[size]}
                        disableReposition
                        position="right-top"
                        withArrow={false}
                        margin={5}
                        open={popoverOpenState}
                        ref={popoverFloatingRef}
                    >
                        <PopoverBody
                            withPadding={false}
                            className={`menu__body menu__body_size_${size}`}
                            withScrollbar={false}
                        >
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
                                            <h1>{emptyText}</h1>
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
