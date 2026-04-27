import React, { FC, ReactNode, useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";

// Components
import Loader from "@components/atoms/Loader";
import Scrollbar, { ScrollbarRefType } from "@components/atoms/Scrollbar";
import Skeleton from "@components/atoms/Skeleton";
import Empty from "@components/molecules/Empty";
import Item from "@components/molecules/List/Item/Item";
import ListFooter from "@components/molecules/List/ListFooter";

// Styles
import "./List.scss";

interface IListItemData {
    id: number | string;
    label?: ReactNode;
    disabled?: boolean;
    onClick?: (item: IListItemData) => void;
    render?: (item: IListItemData) => ReactNode;
}

interface IListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    items: IListItemData[];
    /**
     * Indicates whether the list is in a loading state.
     * If true, a loading indicator is displayed instead of the items.
     */
    loading?: boolean;
    /**
     * The text to display alongside the loader when loading is true.
     */
    loadingText?: string;
    /**
     * Text to display when there are no items to show (no results).
     */
    emptyText?: string;
    /**
     * When true, shows the footer with the "Show more" button.
     */
    showMore?: boolean;
    /**
     * Callback when the "Show more" button is clicked.
     */
    onShowMore?: () => void;
    /**
     * Text for the "Show more" button.
     */
    showMoreLabel?: string;
    /**
     * Disables the "Show more" button.
     * Useful when there are no more items to load.
     */
    showMoreDisabled?: boolean;
    /**
     * Shows loading state for the "Show more" button.
     * Useful while waiting for the next batch of server data.
     */
    showMoreLoading?: boolean;
}

const ESTIMATED_ROW_HEIGHT_PX = 32;

/**
 * List is a reusable list container that renders virtualized items with loading, empty, and "show more" states.
 * It is designed to fill its parent dimensions and can be composed inside any layout, popover, or panel.
 */
const List: FC<IListProps> = ({
    className,
    items,
    loading,
    loadingText,
    emptyText,
    showMore,
    onShowMore,
    showMoreLabel,
    showMoreDisabled = false,
    showMoreLoading = false
}) => {
    const hasChildren = useMemo(() => items.length > 0, [items.length]);
    const scrollbarRef = useRef<ScrollbarRefType | null>(null);
    const itemsArray = useMemo(() => items, [items]);
    const shouldRenderShowMoreSkeleton = !!showMore && !!showMoreLoading && hasChildren;
    const totalVirtualCount = itemsArray.length + (shouldRenderShowMoreSkeleton ? 1 : 0);

    const virtualizer = useVirtualizer({
        count: hasChildren ? totalVirtualCount : 0,
        getScrollElement: () => scrollbarRef.current?.scrollbarRef?.scrollerElement ?? null,
        estimateSize: () => ESTIMATED_ROW_HEIGHT_PX,
        overscan: 4
    });

    useEffect(() => {
        if (!shouldRenderShowMoreSkeleton) return;

        const scrollerElement = scrollbarRef.current?.scrollbarRef?.scrollerElement;
        if (!scrollerElement) return;

        scrollerElement.scrollTo({ top: scrollerElement.scrollHeight, behavior: "smooth" });
    }, [shouldRenderShowMoreSkeleton]);

    if (loading) {
        return (
            <div className={classNames("list", className)}>
                <div className="list__state list__loader">
                    <Loader text={loadingText} textPosition="below" />
                </div>
            </div>
        );
    }

    if (!hasChildren) {
        return (
            <div className={classNames("list", className)}>
                <div className="list__state list__empty">
                    <Empty description={emptyText} appearance="noResult" size="small" />
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("list", className)}>
            <div className="list__scrollWrapper">
                <Scrollbar ref={scrollbarRef}>
                    <ul className="list__content list__virtualContainer" style={{ height: virtualizer.getTotalSize() }}>
                        {virtualizer.getVirtualItems().map((row) => {
                            if (shouldRenderShowMoreSkeleton && row.index === itemsArray.length) {
                                return (
                                    <li
                                        className="list__virtualRow"
                                        key="list-showMore-skeleton-row"
                                        data-index={row.index}
                                        style={{ transform: `translateY(${row.start}px)` }}
                                    >
                                        <div className="list__skeletonRow" aria-hidden="true">
                                            <Skeleton className="list__skeletonItem" height={16} rounded="rounded4X" />
                                        </div>
                                    </li>
                                );
                            }

                            const item = itemsArray[row.index];
                            return (
                                item && (
                                    <Item
                                        virtualClassName="list__virtualRow"
                                        key={item.id ?? `list-item-${row.index}`}
                                        ref={virtualizer.measureElement}
                                        virtualIndex={row.index}
                                        id={item.id}
                                        disabled={item.disabled}
                                        onClick={item.onClick ? () => item.onClick?.(item) : undefined}
                                        virtualStyle={{ transform: `translateY(${row.start}px)` }}
                                    >
                                        {item.render ? item.render(item) : item.label}
                                    </Item>
                                )
                            );
                        })}
                    </ul>
                </Scrollbar>
            </div>
            {showMore && (
                <ListFooter
                    showMore={showMore}
                    onShowMore={onShowMore}
                    showMoreLabel={showMoreLabel}
                    loading={showMoreLoading}
                    disabled={showMoreDisabled || showMoreLoading}
                />
            )}
        </div>
    );
};

export { IListItemData, IListProps, List as default };
