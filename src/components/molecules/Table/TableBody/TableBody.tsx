import React, { FC } from "react";
import { Row } from "@tanstack/table-core";

// Components
import Loader from "@components/atoms/Loader";
import TableRow from "@components/molecules/Table/TableBody/Row/TableRow";

// Styles
import "./TableBody.scss";
import Empty from "@components/molecules/Empty";

interface ITableBody {
    /**
     * Data of rows to be displayed.
     */
    rows: Row<any>[];
    /**
     * Whether the table should display loader.
     */
    loading: boolean;
    /**
     * Label of loader spinner.
     */
    loadingText: string;
    /**
     *
     */
    errorTexts?: any;
}

/**
 * TableBody defines the <tbody> section of component.
 * @param rows
 * @param loading
 * @param loadingText
 * @constructor
 */
const TableBody: FC<ITableBody> = ({ rows, loading, loadingText, errorTexts }) => {
    if (loading) {
        return <Loader size="small" text={loadingText} />;
    }

    if (!rows) {
        return (
            <Empty
                appearance="noData"
                title={errorTexts.noDataAvailableTitle}
                description={errorTexts.noDataAvailableText}
                className="table__content_empty"
            />
        );
    }

    // TODO: for this case we should check also the existence of search query (table should have searchData)
    if (rows?.length === 0) {
        return (
            <Empty
                appearance="noResult"
                title={errorTexts.noResultFoundTitle}
                description={errorTexts.noResultFoundText}
            />
        );
    }

    return (
        <tbody>
            {rows.map((row) => (
                <TableRow key={row.id} row={row} />
            ))}
        </tbody>
    );
};

export default TableBody;
