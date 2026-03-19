import React from "react";
import { Row } from "@tanstack/table-core";

// Components
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import TableRow from "@components/molecules/Table/TableBody/Row/TableRow";
// Types
import { ITableErrorTexts } from "@components/molecules/Table/types";

// Styles
import "./TableBody.scss";

/**
 * Props for the {@link TableBody} component.
 * @template TData - The shape of the overall row data object.
 */
interface ITableBody<TData> {
    /**
     * An array of TanStack Table row instances to be rendered.
     */
    rows: Row<TData>[];
    /**
     * Determines if the table is currently in a loading state.
     */
    loading: boolean;
    /**
     * The text label displayed alongside the loading spinner.
     */
    loadingText: string;
    /**
     * A collection of text strings used for fallback UIs
     * (e.g., when no data exists or no search results are found).
     */
    errorTexts: ITableErrorTexts;
}

/**
 * Renders the `<tbody>` section of the table, including empty and loading states.
 * * Handles conditional rendering based on the data's status:
 * - Displays a {@link Loader} if the data is currently fetching.
 * - Displays an {@link Empty} "No Data" state if the `rows` array is falsy.
 * - Displays an {@link Empty} "No Results" state if the `rows` array is empty.
 * - Otherwise, maps through the provided rows to render {@link TableRow} components.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns The table body element, or a fallback UI (loader/empty state) depending on the data.
 */
const TableBody = <TData,>({ rows, loading, loadingText, errorTexts }: ITableBody<TData>) => {
    if (loading) {
        return <Loader size="large" text={loadingText} textPosition="below" />;
    }

    if (!rows) {
        return (
            <Empty
                appearance="noData"
                title={errorTexts.noDataAvailableTitle}
                description={errorTexts.noDataAvailableText}
                className="table__content_empty"
                actions={[{ children: "Retry", onClick: () => null }]}
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
