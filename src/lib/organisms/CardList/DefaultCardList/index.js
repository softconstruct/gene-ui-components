import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { List, WindowScroller, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';

import { oneIsRequired, noop } from 'utils';

import BusyLoader from '../../../atoms/BusyLoader';
import Empty from '../../../atoms/Empty';
import Icon from '../../../atoms/Icon';

import Widget from '../../../molecules/Widget';
import Card from '../../../molecules/Card';

import Dropdown from '../../Dropdown';

import './index.scss';

const defaultSortFn = (prev, next, dataKey, type) => {
    const first = prev.data[dataKey];
    const second = next.data[dataKey];

    if (first === null) return 1;
    if (second === null) return -1;

    const firstLowerCased = typeof first === 'string' ? first.toLowerCase() : first;
    const secondLowerCased = typeof second === 'string' ? second.toLowerCase() : second;

    if (type === 'asc') {
        return firstLowerCased > secondLowerCased ? 1 : -1;
    }
    if (type === 'desc') {
        return firstLowerCased > secondLowerCased ? -1 : 1;
    }
    return 0;
};

function CardList(props) {
    const {
        rowClassName,
        onPaginationChange,
        shadow,
        border,
        sortableColumns,
        rowKey,
        sortedColumn,
        sortType,
        defaultSortedColumn,
        defaultSortType,
        onSortChange,
        columnLimit,
        resultText,
        className,
        loading,
        rows,
        rowsCount,
        columns,
        columnKey,
        rowActionBar,
        getPopupProps,
        customSubHeader,
        rowsPerPage,
        sortingPlaceholder,
        viewCardText,
        expandText,
        cancelText,
        sortByText,
        expandedText,
        emptyContent,
        expandedCloseText,
        scrollElement,
        renderRowNestedChildren,
        rowExtraClickMenuTitle,
        getExpandIconDisableState,
        onColumnChange,
        totals,
        rowExtraClick,
        rowExtraClickNeeded,
        closeWithOutsideClick,
        isEditMode,
        ...restProps
    } = props;
    const isCustomScrollElement = 'scrollElement' in props;
    const isSortControlled = 'onSortChange' in props;

    const virtualizedList = useRef(null);
    const [sortDir, setSortDir] = useState(defaultSortType || null);
    const [sortCol, setSortCol] = useState(defaultSortedColumn || null);
    const [page, setPage] = useState(1);
    const [listWidth, setListWidth] = useState(null);
    const [pageLoading, setPageLoading] = useState(false);

    const columnsWithSort = useMemo(
        () => columns.filter(({ sortable }) => (typeof sortable === 'boolean' ? sortable : sortableColumns)),
        [columns, sortableColumns]
    );

    const sortedRows = useMemo(() => {
        if (isSortControlled || !sortDir) return rows;

        const column = columns.find((col) => col.dataKey === sortCol) || {};

        const sortFn = column.sortFn
            ? (prev, next) => column.sortFn(prev, next, sortCol, sortDir, column.formatter, column.removeSymbol)
            : (prev, next) => defaultSortFn(prev, next, sortCol, sortDir);

        if (sortDir !== null) return [...rows].sort(sortFn);

        return rows;
    }, [isSortControlled, sortDir, rows, columns, sortCol]);

    const handleSortChange = useCallback(() => {
        const dir = !sortDir ? 'asc' : sortDir === 'asc' ? 'desc' : null;
        const sortedColValue = isSortControlled ? sortedColumn : sortCol;
        const column = columns.find((col) => col[columnKey] === sortedColValue) || {};

        if (sortCol) {
            !isSortControlled && setSortDir(dir);
        }
        onSortChange && onSortChange({ column }, sortCol, dir);
    }, [sortDir, columns, sortCol, onSortChange, columnKey, sortedColumn, isSortControlled]);

    const handlePageLoad = useCallback(
        ({ stopIndex }) => {
            const loadedCount = stopIndex + 1;

            if (loadedCount === rowsCount) return false;

            if (loadedCount === rowsPerPage * page) {
                const newPage = page + 1;
                onPaginationChange(newPage, rowsPerPage);
                setPageLoading(true);
                setPage(newPage);
            }
        },
        [rowsCount, rowsPerPage, page, onPaginationChange]
    );

    useEffect(() => {
        if (!loading) setPageLoading(false);
    }, [loading]);

    const sortedRowsLength = sortedRows.length;
    const cache = useMemo(
        () =>
            new CellMeasurerCache({
                minHeight: 75,
                defaultHeight: 200,
                fixedWidth: true
            }),
        []
    );

    const rowRenderer = ({ index, style, parent }) => {
        const { onClick, ...restItem } = sortedRows[index];
        return (
            <CellMeasurer cache={cache} columnIndex={0} key={index} parent={parent} rowIndex={index}>
                <Card
                    {...restItem}
                    style={{ top: style.top }}
                    closeWithOutsideClick={closeWithOutsideClick}
                    isCustomScrollElement={isCustomScrollElement}
                    rowExtraClickMenuTitle={rowExtraClickMenuTitle}
                    getExpandIconDisableState={getExpandIconDisableState}
                    onRowClick={onClick}
                    index={index}
                    columnKey={columnKey}
                    columnLimit={columnLimit}
                    rowActionBar={rowActionBar}
                    getPopupProps={getPopupProps}
                    rowExtraClick={rowExtraClick}
                    isEditMode={isEditMode}
                    rowExtraClickNeeded={rowExtraClickNeeded}
                    rowHeightCache={cache}
                    row={restItem}
                    columns={columns}
                    className={rowClassName}
                    shadow={shadow}
                    border={border}
                    virtualizedList={virtualizedList.current}
                    viewCardText={viewCardText}
                    expandText={expandText}
                    cancelText={cancelText}
                    expandedText={expandedText}
                    expandedCloseText={expandedCloseText}
                    renderRowNestedChildren={renderRowNestedChildren}
                />
            </CellMeasurer>
        );
    };

    const handleColumnChange = useCallback(
        ({ [columnKey]: value, ...rest }) => {
            setSortCol(value);
            setSortDir(null);
            onColumnChange && onColumnChange(value, rest);
        },
        [columnKey, onColumnChange]
    );

    const customScrollElement = isCustomScrollElement && scrollElement ? scrollElement.current : undefined;

    return (
        <div className={classnames('mobile-table-holder', className)} {...restProps}>
            {sortedRows.length ? (
                <>
                    {customSubHeader}
                    {!!Object.keys(totals).length && (
                        <div className="mc-widgets-holder">
                            <ul>
                                {columns.map(
                                    ({ text, widgetColor, [columnKey]: unique }) =>
                                        totals[unique] && (
                                            <li key={unique}>
                                                <Widget
                                                    type="colorful"
                                                    title={text}
                                                    color={widgetColor}
                                                    text={totals[unique]}
                                                    size="small"
                                                />
                                            </li>
                                        )
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="mobile-table-head">
                        {!!columnsWithSort.length && (
                            <ul>
                                <li>
                                    <button className="mobile-sort-button" onClick={handleSortChange}>
                                        <p
                                            className={classnames({
                                                active: sortDir || sortType
                                            })}
                                        >
                                            {sortByText}
                                        </p>
                                        <div className="mobile-sort-icons">
                                            <Icon
                                                type="bc-icon-sorting-down"
                                                className={classnames({
                                                    active:
                                                        sortDir === 'desc' || (isSortControlled && sortType === 'desc')
                                                })}
                                            />
                                            <Icon
                                                type="bc-icon-sorting-up"
                                                className={classnames({
                                                    active:
                                                        sortDir === 'asc' || (isSortControlled && sortType === 'asc')
                                                })}
                                            />
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <Dropdown
                                        data={columnsWithSort}
                                        defaultValue={isSortControlled ? sortedColumn : sortCol || null}
                                        onChange={handleColumnChange}
                                        placeholder={sortingPlaceholder}
                                        labelKey="text"
                                        valueKey={columnKey}
                                    />
                                </li>
                            </ul>
                        )}
                        <div className="mt-results-holder">
                            {resultText} {rowsCount || rows.length}
                        </div>
                    </div>
                    <div
                        className="mobile-table-body"
                        style={{ height: '100%' }}
                        ref={(ref) => ref && setListWidth(ref.clientWidth)}
                    >
                        {listWidth && (!isCustomScrollElement || scrollElement.current) && (
                            <InfiniteLoader
                                minimumBatchSize={0}
                                threshold={0}
                                isRowLoaded={(index) => !!sortedRows[index]}
                                loadMoreRows={handlePageLoad}
                                rowCount={sortedRowsLength}
                            >
                                {({ onRowsRendered }) => (
                                    <WindowScroller scrollElement={customScrollElement}>
                                        {({ height = 0, scrollTop, isScrolling }) => (
                                            <List
                                                ref={virtualizedList}
                                                autoHeight
                                                height={height}
                                                onRowsRendered={onRowsRendered}
                                                isScrolling={isScrolling}
                                                rowCount={sortedRowsLength}
                                                rowHeight={(row) => cache.rowHeight(row)}
                                                rowRenderer={rowRenderer}
                                                scrollTop={scrollTop}
                                                width={listWidth}
                                            />
                                        )}
                                    </WindowScroller>
                                )}
                            </InfiniteLoader>
                        )}
                    </div>
                </>
            ) : (
                <div className="cards-empty-holder">{emptyContent}</div>
            )}
            {loading && (
                <div
                    className={classnames('mobile-table-loading', {
                        'absolute-splash': !pageLoading
                    })}
                >
                    <BusyLoader spinnerSize={pageLoading ? 'big' : 'small'} />
                </div>
            )}
        </div>
    );
}

CardList.propTypes = {
    /**
     * Show busy wrapper
     */
    loading: PropTypes.bool,
    /**
     * Is have shadow
     */
    shadow: PropTypes.bool,
    /**
     * Is have border
     */
    border: PropTypes.bool,
    /**
     * Is card in edit mode
     */
    isEditMode: PropTypes.bool,
    /**
     * Text for showing result
     */
    resultText: PropTypes.string,
    /**
     * Classname for card items
     */
    rowClassName: PropTypes.string,
    /**
     * Classname for card list
     */
    className: PropTypes.string,
    /**
     * Type of sorting when it's controlled
     */
    sortType: PropTypes.oneOf(['asc', 'desc', null]),
    /**
     * DataKey of column which was sorted
     */
    sortedColumn: PropTypes.string,
    /**
     * DataKey of column which was sorted by default
     */
    defaultSortedColumn: PropTypes.string,
    /**
     * Type of default sorting
     */
    defaultSortType: PropTypes.oneOf(['asc', 'desc', null]),
    /**
     * Title for rowExtraClick menu item
     */
    rowExtraClickMenuTitle: PropTypes.string,
    /**
     * Function which should return boolean
     */
    getExpandIconDisableState: PropTypes.func,
    /**
     * Custom elements for sub header
     */
    customSubHeader: PropTypes.node,
    /**
     * Are columns sortable?
     */
    sortableColumns: PropTypes.bool,
    /**
     * Pass this function to catch sorting event and get related data
     * ((type: string, dataKey: sting, column: PropTypes.columns[item]) => void
     */
    onSortChange: PropTypes.func,
    /**
     * Placeholder for sorting dropdown
     */
    sortingPlaceholder: PropTypes.string,
    /**
     * sortFn: Custom sort function for columns.((prev: PropTypes.rows[item], next: PropTypes.rows[item], rows: PropTypes.rows, dataKey: string) => {
     *   if (prev is less than next by some ordering criterion) {
     *      return -1;
     *   }
     *    if (prev is greater than next by the ordering criterion) {
     *      return 1;
     *    }
     *    prev is equal to next
     *   return 0;
     *  }
     * })
     *
     * text: Text value for columns
     *
     * render: Function to render custom text.((column: PropTypes.columns[item], index: number, isEditActive: boolean) =>  return any)
     *
     * sortable: Allows sorting if true
     *
     * resizable: Allows resizing if true
     *
     * current column's data key
     *
     * draggable: Allows dragging if true
     *
     * colRenderer: Render custom component on certain column of each row. ((value: string || number, index: number, row: PropTypes.rows[item], isEditActive: boolean) => {
     *  return <div>Hello World</div>})
     *
     * getter: Function to define custom text. ((row: PropTypes.rows[item], index: number, isEditActive: boolean)) => {
     *  return some string
     * })
     *
     * formatter: Function tp format displaying text. ((middleText: string, row: PropTypes.rows[item], index: number, isEditActive: boolean) => {
     *  return some string
     * })
     *
     */
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            sortFn: PropTypes.func,
            ...oneIsRequired({
                text: PropTypes.node,
                render: PropTypes.func
            }),
            sortable: PropTypes.bool,
            resizable: PropTypes.bool,
            dataKey: PropTypes.string,
            draggable: PropTypes.bool,
            colRenderer: PropTypes.func,
            getter: PropTypes.func,
            formatter: PropTypes.func,
            hide: PropTypes.bool
        })
    ).isRequired,
    /**
     * Key from column's data which value is surely unique
     */
    columnKey: PropTypes.string.isRequired,
    /**
     * hasHover: Allow hovering
     * data: rows column's data
     * nestedTable: object of columns: array of objects and rows: array of objects
     * className: additional className for row element
     * render: Render custom component on (row: PropTypes.rows[item] index: number) => {
     *  return <div>Hello World</div>})
     */
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            /**
             * Expand button disabled state
             */
            expandDisabled: PropTypes.bool,
            data: PropTypes.object,
            className: PropTypes.string,
            render: PropTypes.func
        })
    ),
    /**
     * Rows total count
     */
    rowsCount: PropTypes.number,
    /**
     * Number of columns that will be shown
     */
    columnLimit: PropTypes.number,
    /**
     * Function which will return Array of objects as row's action bar on the right corner of the row. ((row: PropTypes.rows[item] ,index: number) => [])
     */
    rowActionBar: PropTypes.func,
    /**
     * Function which will return props for mobile popup. ((row: PropTypes.rows[item] ,index: number) => {})
     */
    getPopupProps: PropTypes.func,
    /**
     * Text for View Card
     */
    viewCardText: PropTypes.string,
    /**
     * Text for Expand
     */
    expandText: PropTypes.string,
    /**
     * Text for Cancel
     */
    cancelText: PropTypes.string,
    /**
     * Key from row's data  which value is surely unique
     */
    rowKey: PropTypes.string.isRequired,
    /**
     * Will render when there are no rows to render
     */
    emptyContent: PropTypes.node,
    /**
     * Text for Expanded popup close button
     */
    expandedCloseText: PropTypes.string,
    /**
     * Text for Expanded popup title
     */
    expandedText: PropTypes.string,
    /**
     * Function which should return null or another
     * Function which will return valid node
     */
    renderRowNestedChildren: PropTypes.func,
    /**
     * Function will be called when page changes (page, rowsPerPage) => void
     */
    onPaginationChange: PropTypes.func,
    /**
     * Rows count per page
     */
    rowsPerPage: PropTypes.number,
    /**
     * Text for sort by
     */
    sortByText: PropTypes.string,
    /**
     * Object with dataKeys and totals
     */
    totals: PropTypes.object,
    /**
     * Extra click function for rows. ((e: event object, data: object, index: number, row: PropTypes.rows[item]) => custom logic)
     */
    rowExtraClick: PropTypes.func,
    /**
     * Function for determining which rows should have extra click. ((e: event object, data: object, index: number, row: PropTypes.rows[item]) => return true or false)
     */
    rowExtraClickNeeded: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
};

CardList.defaultProps = {
    totals: {},
    resultText: 'Result:',
    sortByText: 'Sort by',
    onPaginationChange: noop,
    emptyContent: <Empty title="No data to display" />,
    columnKey: 'dataKey',
    sortingPlaceholder: 'Column',
    rowExtraClickNeeded: noop,
    sortableColumns: false,
    columnLimit: 6,
    shadow: true,
    border: true,
    rowsPerPage: 20
};

export default CardList;
