import React, { FC } from "react";
import { Table } from "@tanstack/react-table";

import Loader, { ILoaderProps } from "@components/atoms/Loader";
import { ScrollbarRefType } from "@components/atoms/Scrollbar";
import Empty, { IEmptyProps } from "@components/molecules/Empty";
import TableRow from "@components/molecules/Table/TableRow";
import VirtualScrollTBody from "@components/molecules/Table/VirtualScrollTBody";

import { Row, TableCol } from ".";

interface ITableBody {
    table: Table<Row>;
    columnsMap: Map<string, TableCol<Row>>;
    withExpandable?: boolean;
    withCheckbox?: boolean;
    withEditMode?: boolean;
    hasRowActions?: boolean;
    loading?: boolean;
    loaderSize?: ILoaderProps["size"];
    loaderText?: string;
    withVirtualScroll?: boolean;
    scrollbarContainerRef: ScrollbarRefType | null;
    withDynamicFetch?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    tableHeadRef?: HTMLTableSectionElement | null;
    tableFootRef?: HTMLTableSectionElement | null;
    noDataProps?: IEmptyProps;
}

const TBody: FC<ITableBody> = ({
    table,
    columnsMap,
    withExpandable,
    withCheckbox,
    withEditMode = false,
    hasRowActions = false,
    loading,
    loaderSize,
    loaderText,
    withVirtualScroll,
    scrollbarContainerRef,
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    tableHeadRef,
    tableFootRef,
    noDataProps
}) => {
    const allRows = [...table.getTopRows(), ...table.getCenterRows()];
    const visibleColumnCount = table.getVisibleFlatColumns().length;
    const totalColumnCount = hasRowActions ? visibleColumnCount + 1 : visibleColumnCount;

    const renderTableBody = () => {
        const tableHeadHeight = tableHeadRef?.getBoundingClientRect().height || 0;
        const tableFootHeight = tableFootRef?.getBoundingClientRect().height || 0;
        if (loading) {
            return (
                <tr>
                    <td colSpan={totalColumnCount || 1}>
                        <div
                            className="table__empty"
                            style={{
                                top: tableHeadHeight,
                                bottom: tableFootHeight
                            }}
                        >
                            <Loader size={loaderSize} text={loaderText} />
                        </div>
                    </td>
                </tr>
            );
        }

        if (table.getRowModel().rows.length > 0) {
            return (
                <>
                    {withVirtualScroll && scrollbarContainerRef ? (
                        <>
                            <VirtualScrollTBody
                                topRows={table.getTopRows()}
                                centerRows={table.getCenterRows()}
                                columnCount={totalColumnCount || 1}
                                scrollbarContainerRef={scrollbarContainerRef.scrollbarRef}
                                columnsMap={columnsMap}
                                hasRowActions={hasRowActions}
                                withExpandable={withExpandable}
                                withEditMode={withEditMode}
                                withCheckbox={withCheckbox}
                                withDynamicFetch={withDynamicFetch}
                                hasNextPage={hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                                fetchNextPage={fetchNextPage}
                            />
                        </>
                    ) : (
                        allRows.map((row, rowIndex) => (
                            <TableRow
                                key={row.id}
                                row={row}
                                rowIndex={rowIndex}
                                columnsMap={columnsMap}
                                withExpandable={withExpandable}
                                withCheckbox={withCheckbox}
                                withEditMode={withEditMode}
                                hasRowActions={hasRowActions}
                            />
                        ))
                    )}
                </>
            );
        }

        return (
            <tr>
                <td colSpan={totalColumnCount || 1}>
                    <div
                        className="table__empty"
                        style={{
                            top: tableHeadHeight,
                            bottom: tableFootHeight
                        }}
                    >
                        <Empty {...noDataProps} size="medium" />
                    </div>
                </td>
            </tr>
        );
    };

    return <tbody>{renderTableBody()}</tbody>;
};

export { TBody as default };
