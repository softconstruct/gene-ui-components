import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
// Components
import { Index, IndexRange, InfiniteLoader, List, ListRowProps } from "react-virtualized";

// Styles
import "./DataCardList.scss";

import Loader from "../../atoms/Loader";
import DataCard, { IDataCardProps } from "./DataCard";

const noop = () => Promise.resolve();
type Data = IDataCardProps["cardData"][];

const DIMENSIONS = { height: 400, width: 280 };

interface IDataCardListProps {
    /**
     * The data used to render the list of DataCard components.
     */
    data: Data;
    /**
     * Function to load the next page of data when the user scrolls near the end of the list.
     */
    loadNextPage?: (params: IndexRange) => Promise<any>;
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
    size?: IDataCardProps["size"];
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
    isNextPageLoading
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const rowCount = hasNextPage ? data.length + 1 : data.length;
    const loadMoreRows = isNextPageLoading || !loadNextPage ? noop : loadNextPage;
    const isRowLoaded = ({ index }: Index) => !hasNextPage || index < data.length;
    const [dimensions, setDimensions] = useState(DIMENSIONS);

    useEffect(() => {
        const resizeHandler = () => {
            if (ref.current) {
                const { height, width } = ref.current.getBoundingClientRect();
                setDimensions({ height, width });
            }
        };
        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        return () => window.removeEventListener("resize", resizeHandler);
    }, [ref.current]);

    const rowRenderer = ({ index, key, style }: ListRowProps, itemSize: IDataCardListProps["size"]) => (
        <div key={key} style={style} role="row">
            <DataCard cardData={data[index]} size={itemSize} role="cell" />
        </div>
    );

    return (
        <div className={classNames("dataCardList", className)} ref={ref}>
            <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount} threshold={1}>
                {({ onRowsRendered, registerChild }) => (
                    <>
                        <List
                            ref={registerChild}
                            onRowsRendered={onRowsRendered}
                            rowRenderer={(props) => rowRenderer(props, size)}
                            height={dimensions.height}
                            rowHeight={size === "medium" ? 326 : 374}
                            rowCount={data.length}
                            width={dimensions.width}
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
