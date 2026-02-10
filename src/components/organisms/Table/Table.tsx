import React, { FC, ReactNode } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import classNames from "classnames";

import { createColumns } from "@components/organisms/Table/Columns";
// Components
import THead from "@components/organisms/Table/THead";
import Toolbar from "@components/organisms/Table/Toolbar";
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
    columns: TableColumns<Row>[];
    rowSelectionInfo?: IRowSelectionInfo;
    globalFilterInfo?: IGlobalFilterInfo;
    bulkActions?: IBulkActions;
    manageColumnsInfo?: IManageColumnsInfo;
    editActions?: Actions;
    headerContent?: ReactNode;
    selectAllText?: string;
    withStickyHeader?: boolean;
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
    columns,
    rowSelectionInfo,
    manageColumnsInfo,
    bulkActions,
    editActions,
    globalFilterInfo,
    headerContent,
    selectAllText,
    withStickyHeader,
    className
}) => {
    const cols = createColumns(columns);

    const table = useReactTable({
        columns: cols,
        data: [],
        getCoreRowModel: getCoreRowModel()
    });

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
            </table>
        </div>
    );
};

export { ITableProps, Table as default };
