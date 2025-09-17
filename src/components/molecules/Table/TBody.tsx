import React, { FC } from "react";
import { Table } from "@tanstack/react-table";

import Loader, { ILoaderProps } from "@components/atoms/Loader";
import { ScrollbarRefType } from "@components/atoms/Scrollbar";
import Empty, { IEmptyProps } from "@components/molecules/Empty";
import TableRow from "@components/molecules/Table/TableRow";
import VirtualScrollTBody from "@components/molecules/Table/VirtualScrollTBody";

import { Row } from ".";

interface ITableBody {
    table: Table<Row>;
    expandable?: boolean;
    withCheckbox?: boolean;
    editableMode?: boolean;
    loading?: boolean;
    loaderSize?: ILoaderProps["size"];
    loaderText?: string;
    withVirtualScroll?: boolean;
    scrollbarContainerRef: ScrollbarRefType | null;
    withDynamicFetch?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActions?: IEmptyProps["actions"];
    emptyAppearance?: IEmptyProps["appearance"];
    tableHeadRef?: HTMLTableSectionElement | null;
    tableFootRef?: HTMLTableSectionElement | null;
}

const TBody: FC<ITableBody> = ({
    table,
    expandable,
    withCheckbox,
    editableMode = false,
    loading,
    loaderSize,
    loaderText,
    withVirtualScroll,
    scrollbarContainerRef,
    withDynamicFetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    emptyTitle,
    emptyDescription,
    emptyActions,
    emptyAppearance,
    tableHeadRef,
    tableFootRef
}) => {
    const allRows = [...table.getTopRows(), ...table.getCenterRows()];

    const renderTableBody = () => {
        const tableHeadHeight = tableHeadRef?.getBoundingClientRect().height || 0;
        const tableFootHeight = tableFootRef?.getBoundingClientRect().height || 0;
        if (loading) {
            return (
                <tr>
                    <td colSpan={table.getVisibleFlatColumns().length}>
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
                                columnCount={table.getHeaderGroups().length || 1}
                                scrollbarContainerRef={scrollbarContainerRef.scrollbarRef}
                                expandable={expandable}
                                editableMode={editableMode}
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
                                expandable={expandable}
                                withCheckbox={withCheckbox}
                                editableMode={editableMode}
                            />
                        ))
                    )}
                </>
            );
        }

        return (
            <tr>
                <td colSpan={table.getVisibleFlatColumns().length}>
                    <div
                        className="table__empty"
                        style={{
                            top: tableHeadHeight,
                            bottom: tableFootHeight
                        }}
                    >
                        <Empty
                            title={emptyTitle}
                            description={emptyDescription}
                            actions={emptyActions}
                            appearance={emptyAppearance}
                            size="medium"
                        />
                    </div>
                </td>
            </tr>
        );
    };

    return <tbody>{renderTableBody()}</tbody>;
};

export { TBody as default };
