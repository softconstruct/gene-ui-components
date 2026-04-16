import React, { Children, FC, ReactElement, useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";

// Components
import Loader from "@components/atoms/Loader";
import Scrollbar, { ScrollbarRefType } from "@components/atoms/Scrollbar";
import Skeleton from "@components/atoms/Skeleton";
import Empty from "@components/molecules/Empty";
import ItemListFooter from "@components/molecules/ItemList/ItemListFooter";

// Styles
import "./ItemList.scss";

interface IItemListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The content of the item list. These should be `ItemListItem` components.
     */
    children: ReactElement | ReactElement[];
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
 * ItemList is a reusable list container that renders virtualized items with loading, empty, and "show more" states.
 * It is designed to fill its parent dimensions and can be composed inside any layout, popover, or panel.
 */
const ItemList: FC<IItemListProps> = ({
    className,
    children,
    loading,
    loadingText,
    emptyText,
    showMore,
    onShowMore,
    showMoreLabel,
    showMoreDisabled = false,
    showMoreLoading = false
}) => {
    const hasChildren = useMemo(() => Children.count(children) > 0, [children]);

    const scrollbarRef = useRef<ScrollbarRefType | null>(null);
    const childrenArray = useMemo(() => Children.toArray(children) as ReactElement[], [children]);
    const shouldRenderShowMoreSkeleton = !!showMore && !!showMoreLoading && hasChildren;
    const totalVirtualCount = childrenArray.length + (shouldRenderShowMoreSkeleton ? 1 : 0);

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
            <div className={classNames("itemList", className)}>
                <div className="itemList__state itemList__loader">
                    <Loader text={loadingText} textPosition="below" />
                </div>
            </div>
        );
    }

    if (!hasChildren) {
        return (
            <div className={classNames("itemList", className)}>
                <div className="itemList__state itemList__empty">
                    <Empty description={emptyText} appearance="noResult" size="small" />
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("itemList", className)}>
            <div className="itemList__scrollWrapper">
                <Scrollbar ref={scrollbarRef}>
                    <div className="itemList__content" style={{ height: virtualizer.getTotalSize() }}>
                        <div className="itemList__virtualContainer">
                            {virtualizer.getVirtualItems().map((row) => {
                                if (shouldRenderShowMoreSkeleton && row.index === childrenArray.length) {
                                    return (
                                        <div
                                            className="itemList__virtualRow"
                                            key="itemList-showMore-skeleton-row"
                                            data-index={row.index}
                                            style={{ transform: `translateY(${row.start}px)` }}
                                        >
                                            <div className="itemList__skeletonRow" aria-hidden="true">
                                                <Skeleton
                                                    className="itemList__skeletonItem"
                                                    height={16}
                                                    rounded="rounded4X"
                                                />
                                            </div>
                                        </div>
                                    );
                                }

                                const item = childrenArray[row.index];
                                return (
                                    item && (
                                        <div
                                            className="itemList__virtualRow"
                                            key={
                                                item.key ??
                                                (item.props as { id?: string | number }).id ??
                                                `itemList-item-${row.index}`
                                            }
                                            ref={virtualizer.measureElement}
                                            data-index={row.index}
                                            style={{ transform: `translateY(${row.start}px)` }}
                                        >
                                            {item}
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    </div>
                </Scrollbar>
            </div>
            {showMore && (
                <ItemListFooter
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

export { IItemListProps, ItemList as default };
