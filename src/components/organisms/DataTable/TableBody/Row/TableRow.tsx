import React, { FC, JSX } from "react";
import { Row } from "@tanstack/table-core";

// Components
import Button from "@components/atoms/Button";
import Tooltip from "@components/molecules/Tooltip";
import TableBodyCell from "@components/organisms/DataTable/TableBody/Cell/TableBodyCell";
import TableExpandedRow from "@components/organisms/DataTable/TableBody/Row/TableExpandedRow";
import { DataTableRowAction, ITableData } from "@components/organisms/DataTable/types";

// Styles
import "./TableRow.scss";

/**
 * Props for the {@link TableRow} component.
 * @template TData - The shape of the overall row data object.
 */
interface ITableRowProps<TData extends ITableData> {
    /**
     * The TanStack Table row instance.
     * Provides access to row-level data and internal methods, such as retrieving
     * the visible cells to be rendered within this specific row.
     */
    row: Row<TData>;
    /**
     * An array of action button objects to display in the row's actions section.
     */
    rowActions?: DataTableRowAction[];
}

interface IRowActionsWrapperProps {
    title?: string;
    children: JSX.Element;
}

const RowActionsWrapper: FC<IRowActionsWrapperProps> = ({ title, children }) => {
    return title ? <Tooltip text={title}>{children}</Tooltip> : children;
};

/**
 * Renders an individual table row (`<tr>`).
 * * This component iterates through all visible cells for the provided row instance
 * and delegates the rendering of each specific cell to the {@link TableBodyCell} component.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns A table row element containing its respective rendered cells.
 */
const TableRow = <TData extends ITableData>({ row, rowActions }: ITableRowProps<TData>) => {
    const { expandedRow } = row.original;
    const isRowExpanded = row.getIsExpanded() && expandedRow;

    return (
        <>
            <tr className="tableRow">
                {row.getVisibleCells().map((cell) => (
                    <TableBodyCell key={cell.id} cell={cell} />
                ))}

                {rowActions?.length ? (
                    <td className="tableRow__actionsWrapper">
                        <div className="tableRow__actions">
                            {rowActions.map(({ Icon, title, onClick, disabled }, index) => (
                                <RowActionsWrapper key={`action-${title ?? index}`} title={title}>
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        Icon={Icon}
                                        disabled={disabled}
                                        onClick={onClick}
                                    />
                                </RowActionsWrapper>
                            ))}
                        </div>
                    </td>
                ) : null}
            </tr>
            {isRowExpanded && <TableExpandedRow colspan={row.getVisibleCells().length}>{expandedRow}</TableExpandedRow>}
        </>
    );
};

export default TableRow;
