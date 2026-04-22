import React, { FC, ReactNode } from "react";
import { Row } from "@tanstack/table-core";

// Components
import { IButtonProps } from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import Empty from "@components/molecules/Empty";
import TableRow from "@components/organisms/DataTable/TableBody/Row/TableRow";
import { IDataTableRowAction, ITableData, ITableNoDataTexts } from "@components/organisms/DataTable/types";

// Styles
import "./TableBody.scss";

/**
 * Props for the {@link TableBody} component.
 * @template TData - The shape of the overall row data object.
 */
interface ITableBody<TData extends ITableData> {
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
    loadingText?: string;
    /**
     * A collection of text strings used for fallback UIs
     * (e.g., when no data exists or no search results are found).
     */
    noDataTexts?: ITableNoDataTexts;
    /**
     * An array of action button objects to display in the `empty` component's footer.
     * The rendered buttons are automatically wrapped in a `ButtonGroup` component to ensure proper spacing and alignment.
     * Each object conforms to the `IButtonProps` interface, allowing full customization of each button.
     * @example
     * actions={[
     * { children: 'Cancel', appearance: 'secondary', onClick: handleCancel },
     * { children: 'Reload', appearance: 'primary', onClick: handleReload }
     * ]}
     */
    noDataAvailableActions?: IButtonProps[];
    /**
     * An array of action button objects to display in the row's action menu.
     */
    rowActions?: IDataTableRowAction<TData>[];
}

interface ITableEmptyDataWrapperProps {
    children: ReactNode;
}

/**
 * Renders empty data component with following the rules of data displaying at table.
 */
const TableEmptyDataWrapper: FC<ITableEmptyDataWrapperProps> = ({ children }) => (
    <tbody className="tableBody__emptyBody">
        <tr>
            <td>{children}</td>
        </tr>
    </tbody>
);

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
const TableBody = <TData extends ITableData>({
    rows,
    loading,
    loadingText,
    noDataTexts,
    noDataAvailableActions,
    rowActions
}: ITableBody<TData>) => {
    if (loading) {
        return (
            <TableEmptyDataWrapper>
                <Loader size="large" text={loadingText} textPosition="below" />
            </TableEmptyDataWrapper>
        );
    }

    if (!rows || rows.length === 0) {
        return (
            <TableEmptyDataWrapper>
                <Empty
                    appearance="noData"
                    title={noDataTexts?.noDataAvailableTitle}
                    description={noDataTexts?.noDataAvailableText}
                    actions={noDataAvailableActions}
                />
            </TableEmptyDataWrapper>
        );
    }

    return (
        <tbody className="tableBody">
            {rows.map((row) => (
                <TableRow key={row.id} row={row} rowActions={rowActions} />
            ))}
        </tbody>
    );
};

export default TableBody;
