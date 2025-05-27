import React, { Children, FC, ReactNode, UIEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { IconProps } from "@geneui/icons";

// Components
import Loader from "@components/atoms/Loader";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import MenuItemButton from "@components/molecules/Menu/MenuItemButton";

// Helpers
import { isActiveElementInside } from "./helper";
import { MenuContext, popoverSizeMapping } from "./Menu";

interface IMenuItemProps {
    /**
     * Highlights the menu item as selected.
     */
    selected?: boolean;
    /**
     * Content displayed inside the menu item. Can be nested items or a string label.
     */
    children?: ReactNode;
    /**
     * Title shown for the menu item, when it acts as a parent for nested items.
     */
    title?: string;
    /**
     * Used to apply an active style when rendering popover content.
     */
    activeElement?: boolean;
    /**
     * Optional icon shown before the title/content.
     */
    IconBefore?: FC<IconProps>;
    /**
     * Optional icon shown after the title/content.
     */
    IconAfter?: FC<IconProps>;
    /**
     * Applies a "danger" style to the item (e.g., red text for destructive actions).
     */
    danger?: boolean;
    /**
     * Disables the menu item, preventing interaction.
     */
    disabled?: boolean;
    /**
     * Unique identifier for the item, used in selection and navigation logic.
     */
    id: number | string;
    /**
     * If true, adds a visual divider after the item.
     */
    divider?: boolean;
    /**
     * Fallback text shown when the item has no children.
     */
    emptyText?: string;
    /**
     * Custom component rendered inside the item (for more flexible layouts).
     */
    ComponentRender?: FC;
    /**
     * Controls the open state for menu.
     */
    paths?: string[];
    /**
     *  Indicates whether the menu is in a loading state. If true, a loading indicator is displayed instead of the menu items.
     */
    loading?: boolean;
    /**
     * The text to display alongside the loader when loading is true.
     */
    loadingText?: string;
    generatedId?: string;
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
    generatedId,
    loading,
    loadingText
}) => {
    const [propsForPopover, setPropsForPopover] = useState({});
    const parentRef = useRef<HTMLDivElement | null>(null);
    const { onChangeHandler, swappable, relativeRefsSetter, size, openSelectedPath } = useContext(MenuContext);
    const [popoverOpenState, setPopoverOpenState] = useState(false);
    const [isActiveSwappableContent, setIsActiveSwappableContent] = useState(false);

    const isRTLMode = document.dir === "rtl";

    useEffect(() => {
        const shouldOpenPopover =
            !!generatedId?.length && (paths?.join("_").startsWith(generatedId) || paths?.join("_") === generatedId);
        setPopoverOpenState(shouldOpenPopover);
    }, [generatedId, paths]);

    const popoverFloatingRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const onItemClickHandler = (isBack: boolean) => {
        if (onChangeHandler && generatedId) {
            onChangeHandler({ generatedId, id, isBack, closeMenu: typeof children === "string" });
        }
    };

    useEffect(() => {
        const floatingElement = popoverFloatingRef?.current?.floatingElement;
        if (floatingElement) {
            relativeRefsSetter({
                generatedId: generatedId || "",
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
        const pathsForOpenSelectedPath = paths && Array.isArray(paths) ? [...paths.slice(0, -1)] : [];
        const pathId = openSelectedPath ? pathsForOpenSelectedPath.join("_") : paths?.join("_");
        const isMatch = generatedId?.startsWith(pathId || "");

        setIsActiveSwappableContent(!paths?.length || !!isMatch);
    }, [paths, swappable, generatedId, children, openSelectedPath]);

    const menuContent = useMemo(() => {
        if (loading) {
            return (
                <div className="menu__loader">
                    <Loader text={loadingText} textPosition="below" />
                </div>
            );
        }

        if (Children.count(children) === 0) {
            return (
                <div className="menu__empty">
                    <h1>{emptyText}</h1>
                </div>
            );
        }
        if (swappable && isActiveSwappableContent) {
            return (
                <Scrollbar className="menu__scrollbar">
                    <div className="menu__content">{children}</div>
                </Scrollbar>
            );
        }
        return <div className="menu__content">{children}</div>;
    }, [children, emptyText, loading, loadingText, swappable, isActiveSwappableContent]);

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
                            <div className="menu__header">
                                <MenuItemButton type="header" onItemClickHandler={onItemClickHandler} title={title} />
                            </div>
                        )}
                        {menuContent}
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
                        position={isRTLMode ? "left-top" : "right-top"}
                        withArrow={false}
                        margin={10}
                        open={popoverOpenState}
                        ref={popoverFloatingRef}
                    >
                        <PopoverBody
                            withPadding={false}
                            className={`menu__body menu__body_size menu__body_size_${size}`}
                            withScrollbar={false}
                        >
                            <div
                                ref={parentRef}
                                className={classNames("menu__list", {
                                    menu__list_current: activeElement,
                                    menu__item_disabled: disabled
                                })}
                            >
                                <Scrollbar className="menu__scrollbar" onScroll={onScrollHandler}>
                                    {menuContent}
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
