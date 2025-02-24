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
     * The data used to draw the list of DataCard components
     */
    data: Data;
    /**
     * Function to load the next page of data
     */
    loadNextPage?: (params: IndexRange) => Promise<any>;
    /**
     * Indicating if there is a next page to load. If the value is true the loadNextPage function will be called <br/>
     * when user scrolls and riches to the end of list
     */
    hasNextPage?: boolean;
    /**
     * Shows loading indicator at the end of list. This props should be used to show loading when next page request is processing
     */
    isNextPageLoading?: boolean;
    /**
     * DataCard size
     * Possible values: `medium | large`;
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
