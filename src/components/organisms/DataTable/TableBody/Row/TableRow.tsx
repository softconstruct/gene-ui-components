import React, { FC, JSX, MouseEvent } from "react";
import { Row } from "@tanstack/table-core";
import classNames from "classnames";

// Components
import Button from "@components/atoms/Button";
import Tooltip from "@components/molecules/Tooltip";
import TableBodyCell from "@components/organisms/DataTable/TableBody/Cell/TableBodyCell";
import TableExpandedRow from "@components/organisms/DataTable/TableBody/Row/TableExpandedRow";
import {
    DataTableGetRowStatus,
    DataTableRenderExpandedRow,
    IDataTableRowAction
} from "@components/organisms/DataTable/types";

// Styles
import "./TableRow.scss";

/**
 * Props for the {@link TableRow} component.
 * @template TData - The shape of the overall row data object.
 */
interface ITableRowProps<TData> {
    /**
     * The TanStack Table row instance.
     * Provides access to row-level data and internal methods, such as retrieving
     * the visible cells to be rendered within this specific row.
     */
    row: Row<TData>;
    /**
     * An array of action button objects to display in the row's actions section.
     */
    rowActions?: IDataTableRowAction<TData>[];
    /**
     * Resolves the visual status variant for the current row.
     */
    getRowStatus?: DataTableGetRowStatus<TData>;
    /**
     * Returns expanded row content for the current row.
     */
    renderExpandedRow?: DataTableRenderExpandedRow<TData>;
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
const TableRow = <TData,>({ row, rowActions, getRowStatus, renderExpandedRow }: ITableRowProps<TData>) => {
    const rowStatus = getRowStatus?.(row.original);
    const isRowExpanded = row.getIsExpanded();
    const expandedRow = isRowExpanded ? renderExpandedRow?.(row.original) : null;
    const hasExpandedRow = expandedRow != null;

    return (
        <>
            <tr
                className={classNames(`tableRow`, {
                    [`tableRow_status_${rowStatus}`]: rowStatus
                })}
            >
                {row.getVisibleCells().map((cell) => {
                    const isPinned = !!cell.column.getIsPinned();
                    return (
                        <TableBodyCell
                            key={cell.id}
                            cell={cell}
                            isExpanded={isRowExpanded}
                            renderer={cell.column.columnDef.cell}
                            isPinned={isPinned}
                        />
                    );
                })}

                {rowActions?.length ? (
                    <td className="tableRow__actionsWrapper">
                        <div className="tableRow__actions">
                            {rowActions.map(({ Icon, title, onClick, disabled }, index) => {
                                const resolvedDisabled =
                                    typeof disabled === "function" ? disabled(row.original) : disabled;

                                const handleActionClick = (e: MouseEvent) => {
                                    onClick(row.original, e);
                                };

                                return (
                                    <RowActionsWrapper key={`action-${title ?? index}`} title={title}>
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            Icon={Icon}
                                            disabled={resolvedDisabled}
                                            onClick={handleActionClick}
                                        />
                                    </RowActionsWrapper>
                                );
                            })}
                        </div>
                    </td>
                ) : null}
            </tr>
            {isRowExpanded && hasExpandedRow && (
                <TableExpandedRow colspan={row.getVisibleCells().length}>{expandedRow}</TableExpandedRow>
            )}
        </>
    );
};

export default TableRow;
