import React, { FC, useRef } from "react";
import classNames from "classnames";
// Components
import {
    CellMeasurer,
    CellMeasurerCache,
    Index,
    IndexRange,
    InfiniteLoader,
    List,
    ListRowProps
} from "react-virtualized";

import Loader from "@components/atoms/Loader";
import DataCard, { IDataCardProps } from "@components/molecules/DataCard";
import { IMenuItemProps } from "@components/molecules/Menu";

// Hooks
import useContainerSize from "@hooks/useContainerSize";

// Styles
import "./DataCardList.scss";

const noop = () => Promise.resolve();

interface IDataCardListProps {
    /**
     * The data used to render the list of DataCard components.
     */
    data: IDataCardProps[];
    /**
     * Function to load the next page of data when the user scrolls near the end of the list.
     */
    loadNextPage?: (params: IndexRange) => Promise<void>;
    /**
     * Indicates whether more data is available to load.
     * If `true`, the `loadNextPage` function will be triggered when the user reaches the end of the list.
     */
    hasNextPage?: boolean;
    /**
     * Shows a loading indicator at the bottom of the list.
     * Should be `true` while the next page of data is being loaded.
     */
    isNextPageLoading?: boolean;
    /**
     * Defines the size of each DataCard.
     * Possible values: `'medium'` | `'large'`.
     */
    size?: "medium" | "large";
    /** Actions to display on each DataCard. */
    actions?: IMenuItemProps[];
    /** Custom text for Show More button on each DataCard. */
    showMoreText?: string;
    /** Custom text for Actions button on each DataCard. */
    actionsText?: string;
    /** Callback when an action is clicked in any DataCard. */
    onActionClick?: (menuItem: IMenuItemProps) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * DataCardList Component is a responsive alternative to a data table, designed specifically for smaller screens or mobile devices.
 */
const DataCardList: FC<IDataCardListProps> = ({
    className,
    data,
    loadNextPage,
    hasNextPage,
    size = "medium",
    isNextPageLoading,
    actions,
    showMoreText,
    actionsText,
    onActionClick
}) => {
    const rowCount = hasNextPage ? data.length + 1 : data.length;
    const loadMoreRows = isNextPageLoading || !loadNextPage ? noop : loadNextPage;
    const isRowLoaded = ({ index }: Index) => !hasNextPage || index < data.length;
    const cache = useRef(new CellMeasurerCache({ defaultHeight: size === "medium" ? 326 : 374, fixedWidth: true }));
    const { containerRef, sizes } = useContainerSize<HTMLDivElement>();

    const rowRenderer = ({ index, key, style, parent }: ListRowProps) => (
        <CellMeasurer cache={cache.current} columnIndex={0} key={key} parent={parent} rowIndex={index}>
            <div style={style}>
                <DataCard
                    cardData={data[index].cardData}
                    actions={data[index].actions || actions}
                    showMoreText={showMoreText}
                    actionsText={actionsText}
                    onActionClick={data[index].onActionClick || onActionClick}
                />
            </div>
        </CellMeasurer>
    );

    return (
        <div className={classNames("dataCardList", className)} ref={containerRef}>
            <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount} threshold={1}>
                {({ onRowsRendered, registerChild }) => (
                    <>
                        <List
                            ref={registerChild}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={rowRenderer}
                            height={sizes.height}
                            rowHeight={cache.current.rowHeight}
                            rowCount={data.length}
                            width={sizes.width}
                            deferredMeasurementCache={cache.current}
                        />
                        {isNextPageLoading && (
                            <div className="dataCardList__loader">
                                <Loader size="small" />
                            </div>
                        )}
                    </>
                )}
            </InfiniteLoader>
        </div>
    );
};

export { IDataCardListProps, DataCardList as default };
