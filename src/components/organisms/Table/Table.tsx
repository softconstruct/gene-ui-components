import React, { FC } from "react";
import classNames from "classnames";

// Components
import Toolbar from "@components/organisms/Table/Toolbar";
import {
    Actions,
    IBulkActions,
    IGlobalFilterInfo,
    IManageColumnsInfo,
    IRowSelectionInfo
} from "@components/organisms/Table/types";

// Styles
import "./Table.scss";

interface ITableProps {
    rowSelectionInfo?: IRowSelectionInfo;
    globalFilterInfo?: IGlobalFilterInfo;
    bulkActions?: IBulkActions;
    manageColumnsInfo?: IManageColumnsInfo;
    editActions: Actions;
}

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets. Data tables are essential for presenting information such as reports, inventories, or user data in a clear, sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 */
const Table: FC<ITableProps> = ({
    rowSelectionInfo,
    manageColumnsInfo,
    bulkActions,
    editActions,
    globalFilterInfo
}) => {
    return (
        <div className={classNames("dataTable")}>
            <Toolbar
                globalFilterInfo={globalFilterInfo}
                rowSelectionInfo={rowSelectionInfo}
                manageColumnsInfo={manageColumnsInfo}
                editActions={editActions}
                bulkActions={bulkActions}
            />
        </div>
    );
};

export { ITableProps, Table as default };
