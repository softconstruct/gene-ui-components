import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { noop, Logger } from 'utils';

import { searchConfigs } from '../../../../utils/configs/tableConfigs';
import Table from '../../Table';
import { PaginationSelector } from '../utils';

function PaginationTable({
    rows,
    rowsCount,
    startPage,
    rowsPerPage,
    searchQuery,
    selectorData,
    onPageChange,
    selectorProps,
    withPagination,
    withPageSelector,
    onSelectorChange,
    defaultOpenedPage,
    onPaginationChange,
    selectorDefaultValue,
    nextIconTooltipText,
    previousIconTooltipText,
    columns,
    ...tableProps
}) {
    if (onPageChange) {
        Logger.deprecate('"onPageChange" is deprecated. Use "onPaginationChange" change instead.');
    }

    const isSelectorControlled = 'selectorValue' in tableProps;
    const isPaginationControlled = 'currentPage' in tableProps;
    const currentPage = isPaginationControlled && tableProps.currentPage;
    const selectorValue = isSelectorControlled && tableProps.selectorValue;
    const [rowState, setRowState] = useState(rows);
    const totalCount = useMemo(() => rowsCount || rowState.length, [rowsCount, rowState.length]);
    const selectorValueInNumber = useMemo(
        () => (selectorValue === 'all' ? totalCount : selectorValue),
        [totalCount, selectorValue]
    );
    const defaultRowsPerPage =
        rowsPerPage || selectorData.find((data) => data.value === selectorDefaultValue) || selectorData[0];
    const [itemsPerPage, setItemsPerPage] = useState(() =>
        isSelectorControlled ? selectorValueInNumber : defaultRowsPerPage.value
    );
    const [page, setPage] = useState(defaultOpenedPage);
    const [filterState, setFilterState] = useState([]);
    const [rowStartIndex, setRowStartIndex] = useState((defaultOpenedPage - 1) * itemsPerPage);
    const hasSearch = useMemo(() => columns.some((x) => !!x.searchInColumns), [columns]);

    useEffect(() => {
        setRowState(rows);
    }, [rows]);

    useEffect(() => {
        !isPaginationControlled && setRowStartIndex((defaultOpenedPage - 1) * itemsPerPage);
        setPage(defaultOpenedPage);
    }, [rowState.length]);

    useEffect(() => {
        isSelectorControlled && setItemsPerPage(selectorValueInNumber);
    }, [selectorValue, isSelectorControlled, selectorValueInNumber]);

    useEffect(() => {
        setRowStartIndex((defaultOpenedPage - 1) * itemsPerPage);
    }, [currentPage]);

    useEffect(() => {
        if (!hasSearch) return;
        (columns || [])
            .filter((item) => item.searchInColumns?.type === searchConfigs.typeEnum.select)
            .forEach(
                (item) =>
                    (item.searchInColumns.data = [...new Set(rows.map((elem) => elem.data[item.dataKey]))].map(
                        (elem) => ({ label: elem, value: elem })
                    ))
            );
    }, [columns, rows]);

    const searchHandler = useCallback(
        ({ type, dataKey, value }) => {
            const newFilterState = [...filterState];
            const existRow = newFilterState.find((x) => x.dataKey === dataKey);
            if (existRow) {
                existRow.value = value;
            } else {
                newFilterState.push({ type, dataKey, value });
            }
            setFilterState(newFilterState);
        },
        [setFilterState, filterState]
    );

    useEffect(() => {
        if (!filterState.length) return;
        const newData = rows.filter((x) =>
            filterState.every(
                (y) =>
                    (y.type === searchConfigs.typeEnum.text && y.value && x.data[y.dataKey].includes(y.value)) ||
                    !y.value ||
                    (y.type === searchConfigs.typeEnum.select &&
                        y.value?.length &&
                        y.value.includes(x.data[y.dataKey])) ||
                    !y.value?.length
            )
        );
        setRowState(newData);
    }, [filterState]);

    const itemsCount = useMemo(
        () => (searchQuery ? rowState.length : totalCount),
        [searchQuery, rowState.length, totalCount]
    );

    const pageChange = useCallback(
        (page) => {
            if (!isPaginationControlled) {
                setPage(page);
                setRowStartIndex((page - 1) * itemsPerPage);
            }

            onPageChange && onPageChange(page, itemsPerPage);
            onPaginationChange(page, itemsPerPage);
        },
        [isPaginationControlled, onPageChange, itemsPerPage, onPaginationChange]
    );

    const pageSelectorChange = useCallback(
        ({ value }) => {
            if (!isSelectorControlled) {
                setItemsPerPage(value === 'all' ? itemsCount : value);
            }

            if (!isPaginationControlled) {
                setPage(1);
                setRowStartIndex(0);
            }

            onPaginationChange(value === 'all' || value !== rowStartIndex ? 1 : page, value);
            onSelectorChange(value, page);
        },
        [
            isSelectorControlled,
            isPaginationControlled,
            onPaginationChange,
            rowStartIndex,
            page,
            onSelectorChange,
            itemsCount
        ]
    );

    const pageNotExist = (currentPage - 1) * itemsPerPage > itemsCount;

    if (pageNotExist) {
        console.warn('Page does not exist');
        onPageChange && onPageChange(Math.ceil(itemsCount / itemsPerPage), itemsPerPage);
    }

    const selectorSelectedValue = useMemo(
        () => (isSelectorControlled ? selectorValueInNumber : itemsPerPage),
        [isSelectorControlled, selectorValueInNumber, itemsPerPage]
    );
    const maxPage = useMemo(() => Math.ceil(itemsCount / itemsPerPage), [itemsCount, itemsPerPage]);
    const startNumber = useMemo(
        () => (!isPaginationControlled ? rowStartIndex : (currentPage - 1) * selectorSelectedValue),
        [isPaginationControlled, rowStartIndex, currentPage, selectorSelectedValue]
    );
    const tableRows = useMemo(
        () =>
            rowState.filter(
                (_, index) =>
                    index >= rowStartIndex &&
                    index < rowStartIndex + (isSelectorControlled ? selectorSelectedValue : itemsPerPage)
            ),
        [rowState, rowStartIndex, itemsPerPage, isSelectorControlled, selectorSelectedValue]
    );

    return (
        <Table
            {...tableProps}
            page={page}
            rows={tableRows}
            columns={columns}
            searchHandler={searchHandler}
            hasSearch={hasSearch}
            pagination={
                tableRows.length ? (
                    <PaginationSelector
                        maxPage={maxPage}
                        selectedPage={page}
                        totalCount={itemsCount}
                        startNumber={startNumber}
                        selectorData={selectorData}
                        selectorProps={selectorProps}
                        showPagination={withPagination}
                        showSelector={withPageSelector}
                        defaultOpenedPage={defaultOpenedPage}
                        selectorValue={selectorSelectedValue}
                        currentPage={!pageNotExist ? currentPage : maxPage}
                        nextIconTooltipText={nextIconTooltipText}
                        previousIconTooltipText={previousIconTooltipText}
                        onPageChange={pageChange}
                        onSelectorChange={pageSelectorChange}
                        onPaginationChange={onPaginationChange}
                    />
                ) : null
            }
        />
    );
}

PaginationTable.selectorProps = {
    data: [
        {
            label: '10',
            value: 10
        },
        {
            label: '50',
            value: 50
        },
        {
            label: '100',
            value: 100
        },
        {
            label: 'All',
            value: 'all'
        }
    ]
};

PaginationTable.propTypes = {
    /**
     * Page number that must be opened by default
     */
    defaultOpenedPage: PropTypes.number,
    /**
     * Rows total count
     */
    rowsCount: PropTypes.number,
    /**
     * Data for selector dropdown
     */
    selectorData: PropTypes.array,
    /**
     * Define pagination will be shown or no.
     */
    withPagination: PropTypes.bool,
    /**
     * Define page selector will be shown or no.
     */
    withPageSelector: PropTypes.bool,
    /**
     * Default value for selector dropdown
     */
    selectorDefaultValue: PropTypes.number,
    /**
     * Value for selector dropdown
     */
    selectorValue: PropTypes.number
};

PaginationTable.defaultProps = {
    withPageSelector: true,
    withPagination: true,
    rows: [],
    defaultOpenedPage: 1,
    onPaginationChange: noop,
    selectorData: PaginationTable.selectorProps.data,
    onSelectorChange: noop
};

export default PaginationTable;
