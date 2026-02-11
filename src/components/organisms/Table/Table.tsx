import React, { FC, ReactNode, useMemo } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";

import { createColumns } from "@components/organisms/Table/Columns";
import TBody from "@components/organisms/Table/TBody";
import TFoot from "@components/organisms/Table/TFoot";
import THead from "@components/organisms/Table/THead";
import Toolbar from "@components/organisms/Table/Toolbar";
// Components
import {
    Actions,
    IBulkActions,
    IGlobalFilterInfo,
    IManageColumnsInfo,
    IRowSelectionInfo,
    Row,
    TableColumns
} from "@components/organisms/Table/types";

// Styles
import "./Table.scss";

interface ITableProps {
    data: Row[];
    columns: TableColumns<Row>[];
    rowSelectionInfo?: IRowSelectionInfo;
    globalFilterInfo?: IGlobalFilterInfo;
    bulkActions?: IBulkActions;
    manageColumnsInfo?: IManageColumnsInfo;
    editActions?: Actions;
    headerContent?: ReactNode;
    selectAllText?: string;
    withStickyHeader?: boolean;
    withStickyFooter?: boolean;
    columnResizeDirection?: "ltr" | "rtl";
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using `BEM` conventions.
     */
    className?: string;
}

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets. Data tables are essential for presenting information such as reports, inventories, or user data in a clear, sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 */
const Table: FC<ITableProps> = ({
    data,
    columns,
    rowSelectionInfo,
    manageColumnsInfo,
    bulkActions,
    editActions,
    globalFilterInfo,
    headerContent,
    selectAllText,
    withStickyHeader,
    withStickyFooter,
    columnResizeDirection = "ltr",
    className
}) => {
    const cols = createColumns(columns);

    const table = useReactTable({
        columns: cols,
        data,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        columnResizeDirection
    });

    const rows = useMemo(() => [...table.getTopRows(), ...table.getCenterRows()], []);
    const hasFooters = table
        .getFooterGroups()
        .some((group) => group.headers.some((header) => header.column.columnDef.footer));

    return (
        <div className={classNames("dataTable")}>
            <Toolbar
                globalFilterInfo={globalFilterInfo}
                rowSelectionInfo={rowSelectionInfo}
                manageColumnsInfo={manageColumnsInfo}
                editActions={editActions}
                bulkActions={bulkActions}
                headerContent={headerContent}
            />
            <table className={classNames("table", className)} role="table">
                <THead
                    columns={table.getHeaderGroups()}
                    withStickyHeader={withStickyHeader}
                    selectAllText={selectAllText}
                />
                <TBody rows={rows} />
                {hasFooters && <TFoot footer={table.getFooterGroups()} withStickyFooter={withStickyFooter} />}
            </table>
        </div>
    );
};

export { ITableProps, Table as default };
