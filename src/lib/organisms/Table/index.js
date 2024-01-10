import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import { List, WindowScroller, CellMeasurer, CellMeasurerCache, InfiniteLoader, AutoSizer } from 'react-virtualized';
import classnames from 'classnames';

import { oneIsRequired, noop, stopEvent, debounce, guid } from 'utils';
import { useMount, useUpdate, useThrottle } from 'hooks';

import Empty from '../../atoms/Empty';
import Scrollbar from '../../atoms/Scrollbar';
import BusyLoader from '../../atoms/BusyLoader';
import { searchConfigs } from '../../../utils/configs/tableConfigs';

import Row from './Row';
import Header from './Header';
import Footer from './Footer';

import {
    sortHandler,
    useSortConfigs,
    arrayReorder,
    useGetColsInfo,
    hasStickyElements,
    observeElementResize,
    observeStickyInfo,
    getOffsetValuesAndSubscriptions
} from './utils';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function Table(props) {
    const {
        page,
        rows,
        rowKey,
        loader,
        loading,
        sortType,
        hasDoubleHeader,
        groups,
        sortedColumn,
        getRowsAsync,
        currentPage,
        columnKey,
        rowsHover,
        pagination,
        onRowMove,
        onRowClick,
        selectedRow,
        onSortChange,
        footerValues,
        emptyContent,
        rowActionBar,
        isEditActive,
        rowExtraClick,
        columns: cols,
        selectableRows,
        toggleTooltips,
        rowExtraClickIconTooltip,
        closeExpandedAfterFilter,
        handleRowSelect,
        defaultColWidth,
        defaultSortType,
        defaultSortedColumn,
        infiniteLoader,
        toggledRows,
        sortableColumns,
        CustomPreview,
        resizableColumns,
        draggableColumns,
        rowToggleHandler,
        getDragAcceptType,
        handleColumnSorting,
        rowExtraClickNeeded,
        stickyColumnsLimitCount,
        renderRowNestedChildren,
        getExpandIconDisableState,
        columnSizeChangeHandler,
        searchHandler,
        hasSearch,
        customToggledRowsKeys
    } = props;
    if (!('columnKey' in props)) {
        ger.deprecate(
            '"columnKey" prop is required for Table component. In the next major release the default value will be removed(now default to "dataKey").'
        );
    }

    const rowSelectIsControlled = 'selectedRow' in props;
    const isSortControlled = 'handleColumnSorting' in props;
    const columns = useMemo(() => cols.map((item) => ({ ...item, uid: item[columnKey] })), [cols, columnKey]);

    const holderRef = useRef(null);
    const eventRef = useRef(Table.eventName + Table.eventCounter++);
    const firstColRef = useRef(null);
    const lastColRef = useRef(null);
    const scrollRef = useRef(null);
    const virtualizedList = useRef(null);

    const [toggledRowsKeys, setToggledRowsKeys] = useState([]);
    const [holderWidth, setHolderWidth] = useState(0);
    const [sortConfigs, setSortConfigs] = useState(() => ({
        id: defaultSortedColumn || null,
        type: defaultSortType || null,
        index: null
    }));
    const [popoverOpenedId, setPopoverOpenedId] = useState(null);
    const [toggledRefs, setToggledRefs] = useState({});
    const [selectedRowKey, setSelectedRowKey] = useState(null);

    const [columnsOrder, setColumnsOrder] = useState(() =>
        columns.map(({ uid, dataKey, sizeParams }) => ({
            id: uid,
            dataKey,
            sizeParams
        }))
    );

    // Unique prefix for every table, needed for autosize
    const prefix = useMemo(() => guid(), []);

    const [colsInfo, updateColsInfo, reInitColsInfo] = useGetColsInfo(
        () =>
            columnsOrder.reduce(
                (acc, { id, sizeParams }) => ({
                    ...acc,
                    [id]: {
                        autoSizeOn: null,
                        customWidth: null,
                        autoSizeWidth: null,
                        ...sizeParams
                    }
                }),
                {}
            ),
        prefix
    );
    const [rowsOrder, setRowsOrder] = useState(() => rows.map((ignored, index) => index));
    const [stickyColumns, setStickyColumns] = useState({});

    const hasNestedElements = useMemo(
        () => !!renderRowNestedChildren || rows.some((row) => !!row.children),
        [rows, renderRowNestedChildren]
    );

    const withLeftCorners = useMemo(
        () => [!!rowExtraClick && !!rowExtraClickNeeded, hasNestedElements],
        [rowExtraClickNeeded, rowExtraClick, hasNestedElements]
    );

    const withRightCorner = useMemo(() => !!rowActionBar, [rowActionBar]);
    const initialColWidth = useMemo(() => {
        if (holderWidth) {
            const colLength = columns.length;

            if (holderWidth / defaultColWidth > colLength) {
                const firsColWidth = firstColRef.current
                    ? withLeftCorners.reduce((acc, curr) => {
                          if (curr) return acc + firstColRef.current.clientWidth;
                          return acc;
                      }, 0)
                    : 0;
                const lastColWidth = lastColRef.current ? lastColRef.current.clientWidth : 0;
                const colWidth = (holderWidth - firsColWidth - lastColWidth) / colLength;

                return colWidth;
            }
            return defaultColWidth;
        }
    }, [holderWidth, columns.length, defaultColWidth, withLeftCorners, firstColRef.current, lastColRef.current]);

    const handleStickyClick = useCallback(
        (index, left, right, target, unpin) => {
            const { current: firstCol } = firstColRef;
            const { current: lastCol } = lastColRef;
            const { clientWidth: clientWidthLeft } = firstCol || {};
            const { clientWidth: clientWidthRight } = lastCol || {};

            setStickyColumns((prev) => {
                const prevValues = Object.values(prev);
                const belowLimit = prevValues.length < stickyColumnsLimitCount;

                prevValues.forEach((item) => item.subscriptions.map((unsubscribe) => unsubscribe()));

                if (prev.hasOwnProperty(index) || unpin) {
                    const { [index]: ignored, ...next } = prev;
                    const result = Object.keys(next)
                        .map(Number)
                        .reduce(
                            (acc, itemIndex) =>
                                getOffsetValuesAndSubscriptions(
                                    acc,
                                    itemIndex,
                                    next,
                                    clientWidthLeft,
                                    clientWidthRight,
                                    observeStickyInfo,
                                    holderRef.current,
                                    eventRef.current
                                ),
                            {}
                        );

                    return result;
                }
                if (belowLimit) {
                    const newPinned = getOffsetValuesAndSubscriptions(
                        prev,
                        index,
                        { ...prev, [index]: { left, right, target } },
                        clientWidthLeft,
                        clientWidthRight,
                        observeStickyInfo,
                        holderRef.current,
                        eventRef.current
                    );

                    const result = Object.keys(newPinned)
                        .map(Number)
                        .reduce((acc, itemIndex) => {
                            if (itemIndex !== index) {
                                return getOffsetValuesAndSubscriptions(
                                    acc,
                                    itemIndex,
                                    newPinned,
                                    clientWidthLeft,
                                    clientWidthRight,
                                    observeStickyInfo,
                                    holderRef.current,
                                    eventRef.current
                                );
                            }

                            return {
                                ...acc,
                                [itemIndex]: newPinned[itemIndex]
                            };
                        }, {});

                    return result;
                }
                return prev;
            });
        },
        [stickyColumnsLimitCount, holderRef.current, lastColRef.current, firstColRef.current]
    );

    const cache = useMemo(
        () =>
            new CellMeasurerCache({
                defaultHeight: 43,
                fixedWidth: true
            }),
        [rows]
    );

    useEffect(() => {
        closeExpandedAfterFilter && (setToggledRefs({}) || setToggledRowsKeys([]));
        setRowsOrder(rows.map((ignored, index) => index));
        cache.clearAll();
    }, [rows.length]);

    useEffect(() => {
        toggledRows && setToggledRowsKeys((indexes) => [...indexes, ...toggledRows]);
    }, [toggledRows]);

    useEffect(() => {
        scrollRef.current && scrollRef.current.scrollTo({ top: 0 });
    }, [page, currentPage, scrollRef.current]);

    useEffect(() => {
        customToggledRowsKeys && setToggledRowsKeys(customToggledRowsKeys);
    }, [customToggledRowsKeys]);

    useUpdate(() => {
        const newOrder = columns.map(({ dataKey, uid }) => ({
            id: uid,
            dataKey
        }));

        setColumnsOrder(newOrder);
        reInitColsInfo(newOrder);
    }, [columns]);

    useMount(() => {
        const observed = observeElementResize(
            holderRef.current,
            debounce(([ResizeObserver]) => setHolderWidth(ResizeObserver.contentRect.width), 0, true)
        );

        const handler = (e) => {
            stopEvent(e);
            const {
                isSticky,
                position,
                additionalInfo: { index }
            } = e.detail;
            setStickyColumns((prev) => {
                const {
                    [index]: { isStickyRight: stickyFromRight, isStickyLeft: stickyFromLeft }
                } = prev;

                return {
                    ...prev,
                    [index]: {
                        ...prev[index],
                        isStickyLeft: position === 'left' ? isSticky : stickyFromLeft,
                        isStickyRight: position === 'right' ? isSticky : stickyFromRight
                    }
                };
            });
        };

        document.addEventListener(eventRef.current, handler);
        return () => {
            document.removeEventListener(eventRef.current, handler);
            observed.unobserve();
        };
    });

    const changeSortColumn = useCallback(
        (nextSortObject) => {
            sortHandler(nextSortObject, setSortConfigs, onSortChange, sortableColumns, sortConfigs);
        },
        [onSortChange, sortableColumns, sortConfigs]
    );

    const changeSortColumnThrottled = useThrottle(isSortControlled ? handleColumnSorting : changeSortColumn, 50);

    const sortConfig = useSortConfigs(sortConfigs, columns, rows, columnKey);
    const [type, columnDataKey, sortFn] = isSortControlled ? [sortType, sortedColumn] : sortConfig;

    const isEqual = infiniteLoader || rowsOrder.length === rows.length;
    const sortedRows = useMemo(() => {
        const ordered = rowsOrder.length === rows.length ? rowsOrder : rows.map((ignored, index) => index);
        if (isSortControlled) return ordered;

        if (type !== null && isEqual) return [...ordered].sort(sortFn);

        return ordered;
    }, [isSortControlled, type, rows.length, rowsOrder, sortFn, isEqual]);

    const sortedRowsLength = sortedRows.length;

    const moveItem = useCallback(
        (dragIndex, hoverIndex) => {
            const newRowsOrder = arrayReorder(rowsOrder, rowsOrder.indexOf(dragIndex), rowsOrder.indexOf(hoverIndex));
            onRowMove(dragIndex, hoverIndex);
            setRowsOrder(newRowsOrder);
        },
        [rowsOrder, arrayReorder, onRowMove]
    );

    const hasFooter = !!Object.keys(footerValues).length;

    const { stickyRightExist, stickyLeftExist } = useMemo(() => hasStickyElements(stickyColumns), [stickyColumns]);

    const handleSelectRow = useCallback(
        (row, index, rowKey) => {
            if (selectableRows) {
                rowSelectIsControlled
                    ? handleRowSelect(row, index, rowKey)
                    : setSelectedRowKey((prev) => (prev === rowKey ? null : rowKey));
            }
        },
        [selectableRows, rowSelectIsControlled, handleRowSelect]
    );

    const expandedHeight = useMemo(
        () =>
            Object.keys(toggledRefs).reduce(
                (acc, key) => (acc += toggledRefs[key].current ? toggledRefs[key].current.clientHeight : 0),
                0
            ),
        [toggledRefs]
    );

    const withLeftCorner = useMemo(() => withLeftCorners.some((some) => some), [withLeftCorners]);

    const tableWidth = useMemo(() => holderWidth || 0, [holderWidth]);

    const disabledColumnPin = useMemo(
        () =>
            scrollRef &&
            scrollRef.current &&
            scrollRef.current.scrollWidth &&
            scrollRef.current.scrollWidth <= tableWidth,
        [scrollRef && scrollRef.current && scrollRef.current.scrollWidth, tableWidth]
    );

    const hasData = rows.length && sortedRowsLength && scrollRef.current && isEqual;

    // This effect needed for recalculated auto sized columns width
    // when user change page ( because next page values can be bigger then prev page)
    useEffect(() => {
        Object.entries(colsInfo).forEach(([id, data]) => data.autoSizeOn && updateColsInfo(id, true, data.customWidth));
    }, [currentPage, page, type, columnDataKey, rows]);

    useEffect(() => {
        rows && setRowsOrder(rows.map((ignored, index) => index));
    }, [rows]);

    // initialize row in the arguments.
    const onRowsRendered = ({ index, parent, style, nonExisting: row = rows[sortedRows[index]] }) => (
        <CellMeasurer cache={cache} columnIndex={0} key={row.data[rowKey]} parent={parent} rowIndex={index}>
            <Row
                {...row}
                style={{ ...style }}
                prefix={prefix}
                sortType={type}
                columns={columns}
                colsInfo={colsInfo}
                moveItem={moveItem}
                eventRef={eventRef}
                onClick={onRowClick}
                CustomPreview={CustomPreview}
                orders={columnsOrder}
                rowsHover={rowsHover}
                hasFooter={hasFooter}
                rowOrderNumber={index}
                rowCount={rows.length}
                rowHeightCache={cache}
                lastColRef={lastColRef}
                sortedRows={sortedRows}
                actionBar={rowActionBar}
                index={sortedRows[index]}
                rowKey={row.data[rowKey]}
                rowsLength={sortedRowsLength}
                isEditActive={isEditActive}
                stickyColumns={stickyColumns}
                rowExtraClick={rowExtraClick}
                setToggledRefs={setToggledRefs}
                toggleTooltips={toggleTooltips}
                getDragAcceptType={getDragAcceptType}
                rowExtraClickIconTooltip={rowExtraClickIconTooltip}
                withLeftCorner={withLeftCorner}
                selectableRows={selectableRows}
                selectedRowKey={rowSelectIsControlled ? selectedRow : selectedRowKey}
                initialColWidth={initialColWidth}
                handleSelectRow={handleSelectRow}
                stickyLeftExist={stickyLeftExist}
                handleRowClick={rowToggleHandler}
                stickyRightExist={stickyRightExist}
                disabledColumnPin={disabledColumnPin}
                setSelectedRowKey={setSelectedRowKey}
                hasNestedElements={hasNestedElements}
                virtualizedList={virtualizedList.current}
                rowExtraClickNeeded={rowExtraClickNeeded}
                setToggledRowsKeys={setToggledRowsKeys}
                renderRowNestedChildren={renderRowNestedChildren}
                getExpandIconDisableState={getExpandIconDisableState}
                opened={toggledRowsKeys.includes(row.data[rowKey])}
            />
        </CellMeasurer>
    );

    const onToggleColumnAutoSize = useCallback(
        (id, autoSizeOn, width) => {
            updateColsInfo(id, autoSizeOn, width);
        },
        [updateColsInfo]
    );

    return (
        <DndProvider backend={HTML5Backend} context={window}>
            {CustomPreview && <CustomPreview />}
            <div
                className={classnames('table-holder', {
                    'content-empty': !sortedRowsLength
                })}
                style={{ '--table-max-width': `${tableWidth}px` }}
                ref={holderRef}
            >
                <Scrollbar
                    ref={(scrollbar) => {
                        if (!scrollRef.current) {
                            scrollRef.current = scrollbar.view;
                        }
                    }}
                    onScrollStart={() => popoverOpenedId && setPopoverOpenedId(null)}
                    autoHeight={!sortedRowsLength}
                    style={{
                        height: sortedRowsLength
                            ? `${
                                  ((sortedRowsLength + (hasFooter ? 2 : 1) + (hasDoubleHeader ? 1 : 0)) *
                                      cache._defaultHeight +
                                      expandedHeight) /
                                  10
                              }rem`
                            : null
                    }}
                >
                    <Header
                        disabledColumnPin={disabledColumnPin}
                        sortedRowsLength={sortedRowsLength}
                        hasDoubleHeader={hasDoubleHeader}
                        groups={groups}
                        prefix={prefix}
                        sortOrder={type}
                        ref={firstColRef}
                        columns={columns}
                        eventRef={eventRef}
                        disabled={!hasData && !hasSearch}
                        colsInfo={colsInfo}
                        tableRef={holderRef}
                        orders={columnsOrder}
                        lastColRef={lastColRef}
                        actionBar={rowActionBar}
                        firstColRef={firstColRef}
                        isEditActive={isEditActive}
                        sortActiveId={columnDataKey}
                        stickyColumns={stickyColumns}
                        searchHandler={searchHandler}
                        changeOrders={setColumnsOrder}
                        withRightCorner={withRightCorner}
                        withLeftCorners={withLeftCorners}
                        updateColsInfo={updateColsInfo}
                        stickyLeftExist={stickyLeftExist}
                        initialColWidth={initialColWidth}
                        sortableColumns={sortableColumns}
                        resizableColumns={resizableColumns}
                        setStickyColumns={setStickyColumns}
                        draggableColumns={draggableColumns}
                        popoverOpenedId={popoverOpenedId}
                        handleStickyClick={handleStickyClick}
                        setPopoverOpenedId={setPopoverOpenedId}
                        changeSortColumn={changeSortColumnThrottled}
                        onToggleColumnAutoSize={onToggleColumnAutoSize}
                        columnSizeChangeHandler={columnSizeChangeHandler}
                    />
                    <div className="ta-body">
                        {hasData ? (
                            infiniteLoader ? (
                                <InfiniteLoader
                                    isRowLoaded={({ index }) => !!rows[index + 1]}
                                    loadMoreRows={getRowsAsync}
                                    rowCount={sortedRowsLength}
                                >
                                    {({ onRowsRendered: onRowsRend, registerChild }) => (
                                        <WindowScroller scrollElement={scrollRef.current}>
                                            {({ height, isScrolling, scrollTop }) => (
                                                <AutoSizer disableHeight>
                                                    {() => (
                                                        <List
                                                            onRowsRendered={onRowsRend}
                                                            autoHeight
                                                            height={height}
                                                            width={tableWidth}
                                                            ref={(ref) => {
                                                                virtualizedList.current = ref;
                                                                registerChild.current = ref;
                                                            }}
                                                            scrollTop={scrollTop}
                                                            isScrolling={isScrolling}
                                                            rowCount={sortedRowsLength}
                                                            rowHeight={cache.rowHeight}
                                                            rowRenderer={onRowsRendered}
                                                        />
                                                    )}
                                                </AutoSizer>
                                            )}
                                        </WindowScroller>
                                    )}
                                </InfiniteLoader>
                            ) : (
                                <WindowScroller scrollElement={scrollRef.current}>
                                    {({ height = 0, isScrolling, scrollTop }) => (
                                        <List
                                            autoHeight
                                            height={height}
                                            width={tableWidth}
                                            ref={virtualizedList}
                                            scrollTop={scrollTop}
                                            isScrolling={isScrolling}
                                            rowCount={sortedRowsLength}
                                            rowHeight={cache.rowHeight}
                                            rowRenderer={onRowsRendered}
                                        />
                                    )}
                                </WindowScroller>
                            )
                        ) : (
                            <div className="ta-nested-child-holder table-empty-holder">{emptyContent}</div>
                        )}
                    </div>
                    {!!sortedRowsLength && hasFooter && (
                        <div className="ta-n-body ta-footer">
                            <Footer
                                colsInfo={colsInfo}
                                columnKey={columnKey}
                                orders={columnsOrder}
                                values={footerValues}
                                actionBar={rowActionBar}
                                stickyColumns={stickyColumns}
                                withLeftCorners={withLeftCorners}
                                withRightCorner={withRightCorner}
                                stickyLeftExist={stickyLeftExist}
                                initialColWidth={initialColWidth}
                            />
                        </div>
                    )}
                </Scrollbar>
                {pagination}
                {loading && <div className="table-splash-loader">{loader}</div>}
            </div>
        </DndProvider>
    );
}

Table.eventCounter = 0;
Table.eventName = 'sticky-update';
Table.propTypes = {
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
     * exportDisabled: Hide that column from export
     *
     * copyTooltipText: Text for the tooltip when you hover on the element that can be copied.
     *
     * copiedTooltipText: Text for the tooltip when you already pushed copy button on the element that can be copied.
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
     * hasOptions: Renders dropdown of options in header items
     * searchInColumns: Property for the searching in column. There are  two types for search: "text" && "select". Table should not have the rowsCount property.
     */
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            sortFn: PropTypes.func,
            ...oneIsRequired({
                text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
                render: PropTypes.func
            }),
            copyable: PropTypes.bool,
            exportDisabled: PropTypes.bool,
            copyTooltipText: PropTypes.string,
            copiedTooltipText: PropTypes.string,
            copyableValue: PropTypes.string,
            sortable: PropTypes.bool,
            resizable: PropTypes.bool,
            dataKey: PropTypes.string,
            draggable: PropTypes.bool,
            colRenderer: PropTypes.func,
            getter: PropTypes.func,
            formatter: PropTypes.func,
            hasOptions: PropTypes.bool,
            searchInColumns: {
                type: PropTypes.oneOf(searchConfigs.types),
                data: PropTypes.array
            },
            sizeParams: {
                autoSizeOn: PropTypes.bool,
                customWidth: PropTypes.number,
                autoSizeWidth: PropTypes.number,
                defaultCustomWidth: PropTypes.number
            }
        })
    ).isRequired,
    /**
     * Called after move row.((dragIndex: number, hoverIndex: number) => custom logic)
     */
    onRowMove: PropTypes.func,
    /**
     * Called after clicking on row.((data: object, index: number, row: PropTypes.rows[item]) => custom logic)
     */
    onRowClick: PropTypes.func,
    /**
     * Pass this function to catch sorting event and get related data
     * ((type: string, dataKey: sting, column: PropTypes.columns[item]) => void
     */
    onSortChange: PropTypes.func,
    /**
     * Custom loader component
     */
    loader: PropTypes.node,
    /**
     * Will render when there are no rows to render
     */
    emptyContent: PropTypes.node,
    /**
     * Key from row's data  which value is surely unique
     */
    rowKey: PropTypes.string.isRequired,
    /**
     * Key from column's data which value is surely unique
     */
    columnKey: PropTypes.string.isRequired,
    /**
     * If all rows should have hover effect you can pass rowsHover true instead of controlling hovNer effect on each rows individually
     */
    rowsHover: PropTypes.bool,
    /**
     * If true then expanded rows will be closed after rows count change
     */
    closeExpandedAfterFilter: PropTypes.bool,
    /**
     * hasHover: Allow hovering
     * data: rows column's data
     * nestedTable: object of columns: array of objects and rows: array of objects
     * className: additional className for row element
     * disabled: disable row
     * render: Render custom component on (row: PropTypes.rows[item] index: number) => {
     *  return <div>Hello World</div>})
     */
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            hasHover: PropTypes.bool,
            data: PropTypes.object,
            nestedTable: PropTypes.any,
            className: PropTypes.string,
            render: PropTypes.func,
            disabled: PropTypes.bool
        })
    ),
    footer: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
    /**
     *
     */
    selectableRows: PropTypes.bool,
    /** Default minimum width for columns */
    defaultColWidth: PropTypes.number,
    /**
     * Maximum limit for sticky columns.
     */
    stickyColumnsLimitCount: PropTypes.number,
    /**
     * Extra click function for rows. ((e: event object, data: object, index: number, row: PropTypes.rows[item]) => custom logic)
     */
    rowExtraClick: PropTypes.func,
    /**
     * Function for determining which rows should have extra click. ((e: event object, data: object, index: number, row: PropTypes.rows[item]) => return true or false)
     */
    rowExtraClickNeeded: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    /**
     * Function which will return React components as row's action bar on the right corner of the row. ((row: PropTypes.rows[item] ,index: number) =>
     *  <button>custom component</button>)
     */
    rowActionBar: PropTypes.func,
    /**
     * Function which should return null or another
     * Function which will return valid node
     */
    renderRowNestedChildren: PropTypes.func,
    /**
     * Array of toggled rows unique keys
     */
    toggledRows: PropTypes.arrayOf(PropTypes.number),
    /**
     * Function which should return boolean
     */
    getExpandIconDisableState: PropTypes.func,
    /**
     * Search Handler
     */
    columnSizeChangeHandler: PropTypes.func,
    /**
     * columnSizeChangeHandler: (params:object) => void
     * with the help of this function you can get column key, size and action type after size changing.
     */
    searchHandler: PropTypes.func,
    /**
     * there is a search in the table if hasSearch is true
     */
    hasSearch: PropTypes.bool,
    /**
     * controls whether columns should be sortable or not
     */
    sortableColumns: PropTypes.bool,
    /**
     * controls whether columns should be resizable or not
     */
    resizableColumns: PropTypes.bool,
    /**
     * controls whether columns should be draggable or not
     */
    draggableColumns: PropTypes.bool,
    /**
     * Value of row data[rowKey]
     */
    selectedRow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     *  Function to control row selection. ((row: PropTypes.rows[item], index: number, rowKey: string) => void
     */
    handleRowSelect: PropTypes.func,
    /**
     *  Function for controlling column sorting. ((isSortable: boolean, sortData: object) => void
     */
    handleColumnSorting: PropTypes.func,
    /**
     * Type of sorting when it's controlled
     */
    sortType: PropTypes.oneOf(['asc', 'desc', null]),
    /**
     * DataKey of column which was sorted
     */
    sortedColumn: PropTypes.string,
    /**
     * Array of two strings, which will be applied as tooltips to arrow icons of collapsable rows
     */
    toggleTooltips: PropTypes.arrayOf(PropTypes.string),
    /**
     * Tooltips for arrow icons of extra click rows
     */
    rowExtraClickIconTooltip: PropTypes.string,
    /**
     * Initial sort state
     */
    defaultSortType: PropTypes.oneOf(['asc', 'desc']),
    /**
     * Initially sorted column
     */
    defaultSortedColumn: PropTypes.string,
    /**
     * True if u want to load elements when scroll
     */
    infiniteLoader: PropTypes.bool,
    /**
     * Function for fetching new rows
     */
    getRowsAsync: PropTypes.func,
    /**
     * Function for getting draggable element ref
     */
    getDragAcceptType: PropTypes.func,
    /**
     * Custom node for drag preview
     */
    CustomPreview: PropTypes.node,
    /**
     * custom toggle rows
     */
    customToggledRowsKeys: PropTypes.array | undefined
};

Table.defaultProps = {
    footerValues: {},
    rows: [],
    loading: false,
    loader: <BusyLoader className="p-absolute" />,
    onRowMove: noop,
    onSortChange: noop,
    getDragAcceptType: noop,
    emptyContent: <Empty title="No data to display" />,
    columnKey: 'dataKey',
    selectableRows: false,
    stickyColumnsLimitCount: 3,
    defaultColWidth: 150,
    rowToggleHandler: noop,
    toggleTooltips: [],
    rowExtraClickIconTooltip: '',
    defaultSortType: null,
    defaultSortedColumn: null
};

export default Table;
