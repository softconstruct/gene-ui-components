import React, { ChangeEvent, FC, useState } from "react";
import {
    ColumnSort,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowPinningState,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";

import {
    CaretDownFilled,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    Download,
    Globe,
    Pin,
    RecycleBin,
    TagOutline,
    ThreeDotsVertical
} from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import Scrollbar from "@components/atoms/Scrollbar";
import Checkbox from "@components/molecules/Checkbox";
import Cell from "@components/molecules/Table/Cell";
import { CellClassNames, deepCloneWithFunctions } from "@components/molecules/Table/helpers";
import { Row } from "@components/molecules/Table/makeData";
import PinnedRow from "@components/molecules/Table/PinnedRow";
import { RowActions, TableCol } from "@components/molecules/Table/type";

// Styles
import "./Table.scss";

interface ITableProps {
    columns: TableCol<any>[];
    externalData: Row[];
    expandable?: boolean;
    withCheckbox?: boolean;
    onSortChange?: (sortedData: ColumnSort[]) => void;
    // pageSizes?: number[];
    onSave: (data: Row[]) => void;
    rowActions: Partial<RowActions>;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Table component props interface
}

const TableLayoutTmp: FC<ITableProps> = ({
    columns,
    externalData,
    onSortChange,
    withCheckbox,
    expandable,
    onSave,
    rowActions,
    className
}) => {
    const [rowPinning, setRowPinning] = useState<RowPinningState>({
        top: [],
        bottom: []
    });
    const [expanded, setExpanded] = useState<ExpandedState>({});
    // const [currentCol, setCurrentCol] = useState<Column<Record<string, ReactNode | Record<string, string>>, unknown>>(
    //     {}
    // );
    const [sorting, setSorting] = useState<ColumnSort[]>([]);
    const [editableMode, setEditableMode] = useState(false);

    const [editedValue, setEditableValue] = useState<Record<string, Record<string, string>>>({});
    const [data, setData] = useState(deepCloneWithFunctions(externalData));

    const [columnPinning, setColumnPinning] = useState({
        left: ["expand", "rowCheckbox"],
        right: []
    });
    const [columnVisibility, setColumnVisibility] = useState({});

    const accessEditableMode: Record<string, boolean> = {};
    const accessCopyable: Record<string, boolean> = {};

    const [menuOpened, setMenuOpened] = useState(false);

    const onCellEdit = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        index: number,
        type: string
    ) => {
        e.persist();
        const current = e.currentTarget?.value;
        const createData = { ...editedValue, [type]: { ...editedValue[type], [index]: e.currentTarget?.value } };
        setEditableValue(createData);
        const newData = [...data];
        newData[index][type].data = current;
        setData(newData);
    };

    const table = useReactTable({
        data,
        columns,
        initialState: {
            pagination: { pageSize: 20, pageIndex: 0 },
            columnPinning: {
                left: ["expand", "rowCheckbox"]
            }
        },
        state: {
            expanded,
            rowPinning,
            sorting,
            columnPinning,
            columnVisibility
        },

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowCanExpand: (row) => !!row.original.expandedData,

        onSortingChange: (e) => {
            onSortChange?.(sorting);
            setSorting(e);
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        onExpandedChange: setExpanded,
        onRowPinningChange: setRowPinning
    });
    // const tableHeader = table.getHeaderGroups()[0].headers;
    // const changeFilterKey = (e: ChangeEvent<HTMLSelectElement>) => {
    //     const currentFilter = +e.currentTarget.value;
    //     if (tableHeader[currentFilter].column) {
    //         setCurrentCol(tableHeader[currentFilter].column);
    //     }
    // };
    // const changeFilterData = (e: ChangeEvent<HTMLInputElement>) => {
    //     currentCol?.setFilterValue(e.currentTarget.value);
    // };

    const tableEditAction = (type: "cancel" | "edit" | "save") => {
        if (type === "save") onSave(data);
        if (type === "cancel") setData(deepCloneWithFunctions(externalData));
        setEditableMode(!editableMode);
    };

    return (
        <div className={classNames("dataTable", className)}>
            <div className={classNames("dataTable__toolbar toolbar", className)}>
                <div className="dataTable__toolbar_search">
                    <input type="text" placeholder="Search" style={{ width: "100%" }} />
                    <div className="dataTable__bulkActions">
                        <div className="dataTable__bulkActions_selected">2 selected</div>
                        <Divider vertical />
                        <Button appearance="primary" displayType="text" size="medium" onClick={() => {}}>
                            Deselect
                        </Button>
                        <Button
                            appearance="primary"
                            displayType="text"
                            size="medium"
                            Icon={CaretDownFilled}
                            iconAfter
                            onClick={() => {}}
                        >
                            Bulk Actions
                        </Button>
                    </div>
                </div>
                <div className="dataTable__toolbar_actions">
                    {editableMode ? (
                        <>
                            <div className="dropdownMenu__footer_buutonGroup">
                                <Button
                                    appearance="secondary"
                                    displayType="fill"
                                    size="medium"
                                    onClick={() => tableEditAction("cancel")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    appearance="primary"
                                    displayType="fill"
                                    size="medium"
                                    onClick={() => tableEditAction("save")}
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button
                                appearance="secondary"
                                displayType="outline"
                                size="medium"
                                Icon={Globe}
                                onClick={() => tableEditAction("edit")}
                            >
                                Edit
                            </Button>
                            <div className="dataTable__toolbar_dropdownMenu">
                                <Button
                                    appearance="secondary"
                                    displayType="outline"
                                    size="medium"
                                    Icon={Globe}
                                    onClick={() => setMenuOpened(!menuOpened)}
                                >
                                    Manage Columns
                                </Button>

                                {menuOpened && (
                                    <div className="dropdownMenu">
                                        <div className="dropdownMenu__header">
                                            <input type="text" placeholder="Search" style={{ width: "100%" }} />
                                        </div>

                                        <Scrollbar>
                                            <div className="dropdownMenu__main">
                                                <div className="dropdownMenu__columns">
                                                    <div className="dropdownMenu__columns_header">
                                                        <p className="dropdownMenu__columns_title ellipsis-text">
                                                            Active Columns
                                                        </p>
                                                    </div>
                                                    {table.getAllColumns().map((headerGroup) => {
                                                        return headerGroup.columns.map((column) => {
                                                            if (
                                                                column.columnDef.type === "expand" ||
                                                                column.columnDef.type === "rowCheckbox"
                                                            ) {
                                                                return null;
                                                            }
                                                            return (
                                                                <div
                                                                    className="dropdownMenu__columns_item dropdownMenu__columns_item_drag"
                                                                    role="tab"
                                                                    tabIndex={0}
                                                                >
                                                                    <div className="dropdownMenu__columns_placeholder">
                                                                        <Checkbox
                                                                            name="item"
                                                                            value="item"
                                                                            checked={column.getIsVisible()}
                                                                            onChange={() => column.toggleVisibility()}
                                                                        />
                                                                        <p className="dropdownMenu__columns_text ellipsis-text">
                                                                            {column.columnDef.header()}
                                                                        </p>
                                                                    </div>

                                                                    <div className="dropdownMenu__columns_actions">
                                                                        <Button
                                                                            appearance="secondary"
                                                                            displayType="text"
                                                                            size="small"
                                                                            Icon={Pin}
                                                                            onClick={() =>
                                                                                !column.getIsPinned()
                                                                                    ? column.pin("left")
                                                                                    : column.pin(false)
                                                                            }
                                                                            className="dropdownMenu__columns_icon"
                                                                        />
                                                                        <Button
                                                                            appearance="secondary"
                                                                            displayType="text"
                                                                            size="small"
                                                                            Icon={ThreeDotsVertical}
                                                                            onClick={() => column.pin("left")}
                                                                            className="dropdownMenu__columns_icon"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })}
                                                </div>
                                                <Divider />
                                            </div>
                                        </Scrollbar>

                                        <div className="dropdownMenu__footer">
                                            <Button
                                                appearance="secondary"
                                                displayType="text"
                                                size="medium"
                                                onClick={() => {}}
                                            >
                                                Restore Defaults
                                            </Button>
                                            <div className="dropdownMenu__footer_buutonGroup">
                                                <Button
                                                    appearance="secondary"
                                                    displayType="fill"
                                                    size="medium"
                                                    onClick={() => {}}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    appearance="primary"
                                                    displayType="fill"
                                                    size="medium"
                                                    onClick={() => {}}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Scrollbar>
                <table className={classNames("table", className)}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={`${headerGroup.id}_header`} className="table__row table__row_thead">
                                {headerGroup.headers.map((header) => {
                                    const col = header.column.columnDef as TableCol<unknown>;

                                    if (col.editable) {
                                        accessEditableMode[header.id] = true;
                                    }

                                    if (col.copyable) {
                                        accessCopyable[header.id] = true;
                                    }
                                    return (
                                        <th
                                            key={`${header.id}_header`}
                                            colSpan={header.colSpan}
                                            className={classNames("table__th", {
                                                table__th_group: header.subHeaders.length
                                            })}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={(e) =>
                                                            (header.column.columnDef as TableCol<unknown>).sortable &&
                                                            header?.column?.getToggleSortingHandler?.()?.(e)
                                                        }
                                                        tabIndex={0}
                                                        className="table__content"
                                                    >
                                                        <span className="table__th_text ellipsis-text">
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getTopRows().map((row, index) => (
                            <PinnedRow
                                key={row.id}
                                rowIndex={index}
                                row={row}
                                table={table}
                                rowActions={rowActions}
                                expandable={expandable}
                                editableMode={editableMode}
                                onCellEdit={onCellEdit}
                            />
                        ))}

                        {table.getCenterRows().map((row, rowIndex) => {
                            return (
                                <>
                                    <tr
                                        key={row.id}
                                        className={classNames(
                                            `table__row table__row_tbody table__row_${row.original.rowStatus}`
                                        )}
                                    >
                                        {!!expandable && (
                                            <td key={`${row.id}-0`} className="table__td">
                                                <div className="table__content table__content_expand">
                                                    {!!row.original.expandedData && (
                                                        <Button
                                                            appearance="secondary"
                                                            displayType="text"
                                                            size="small"
                                                            Icon={!row.getIsExpanded() ? ChevronRight : ChevronDown}
                                                            onClick={() => row.toggleExpanded()}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}

                                        {withCheckbox && (
                                            <td key={`${row.id}-1`} className="table__td">
                                                <div className="table__content table__content_checkbox">
                                                    <Checkbox name="item" value="item" />
                                                </div>
                                            </td>
                                        )}
                                        {row.getVisibleCells().map((cell) => {
                                            const { type } = cell.column.columnDef as TableCol<unknown>;
                                            if (type === "expand" || type === "rowCheckbox") {
                                                return null;
                                            }
                                            return (
                                                <td key={cell.id} className="table__td">
                                                    <>
                                                        <div
                                                            className={classNames(
                                                                `table__content ${CellClassNames[type]}`
                                                            )}
                                                        >
                                                            <Cell
                                                                type={type}
                                                                data={row.original[cell.column.columnDef.type]?.data}
                                                                // colData={cell.column.columnDef as TableCol<any>}
                                                                withEditMode={editableMode}
                                                                rowCellRenderer={
                                                                    row.original[cell.column.columnDef.type]
                                                                        ?.rowCellRenderer
                                                                }
                                                                onChange={(e) => onCellEdit(e, rowIndex, type)}
                                                            />
                                                        </div>
                                                    </>
                                                </td>
                                            );
                                        })}
                                        {!editableMode &&
                                            rowActions &&
                                            Object.values(rowActions).every((action) => !!action) && (
                                                <td className="table__td table__actionsWrapper">
                                                    <div className="table__actions">
                                                        {rowActions && rowActions.pin && (
                                                            <Button
                                                                appearance="secondary"
                                                                displayType="text"
                                                                size="small"
                                                                Icon={Pin}
                                                                onClick={() => {
                                                                    row.pin("top");
                                                                    rowActions.pin?.(row.id);
                                                                }}
                                                                className=""
                                                            />
                                                        )}
                                                        {rowActions?.tag && (
                                                            <Button
                                                                appearance="secondary"
                                                                displayType="text"
                                                                size="small"
                                                                Icon={TagOutline}
                                                                onClick={() => rowActions.tag?.(row.id)}
                                                                className=""
                                                            />
                                                        )}
                                                        {rowActions?.clock && (
                                                            <Button
                                                                appearance="secondary"
                                                                displayType="text"
                                                                size="small"
                                                                Icon={Clock}
                                                                onClick={() => rowActions.clock?.(row.id)}
                                                                className=""
                                                            />
                                                        )}
                                                        {rowActions?.copy && (
                                                            <Button
                                                                appearance="secondary"
                                                                displayType="text"
                                                                size="small"
                                                                Icon={Copy}
                                                                onClick={() => rowActions.copy?.(row.id)}
                                                                className=""
                                                            />
                                                        )}
                                                        {rowActions?.download && (
                                                            <Button
                                                                appearance="secondary"
                                                                displayType="text"
                                                                size="small"
                                                                Icon={Download}
                                                                onClick={() => rowActions.download?.(row.id)}
                                                                className=""
                                                            />
                                                        )}
                                                        {rowActions?.delete && (
                                                            <Button
                                                                appearance="secondary"
                                                                displayType="text"
                                                                size="small"
                                                                Icon={RecycleBin}
                                                                onClick={() => rowActions.delete?.(row.id)}
                                                                className=""
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                    </tr>
                                    {row.getIsExpanded() && (
                                        <tr key={`${row.id}_expanded`} className="table__row table__row_tbody">
                                            <td
                                                className="table__td table__td_expanded"
                                                colSpan={row.getVisibleCells().length}
                                            >
                                                <div
                                                    className="swapComponent"
                                                    style={{
                                                        height: "20rem",
                                                        backgroundColor: "#F4E1EC",
                                                        padding: "1.6rem",
                                                        color: "#A60063"
                                                    }}
                                                >
                                                    {row.original.expandedData()}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>

                    <tfoot>
                        {table.getFooterGroups().map((footerGroups) => {
                            return (
                                <tr key={`${footerGroups.id}_footer`} className="table__row table__row_tfoot">
                                    {footerGroups.headers.map((footer) => {
                                        return (
                                            <td
                                                key={`${footer.id}_footer`}
                                                className="table__td"
                                                colSpan={footer.colSpan}
                                            >
                                                <div className="table__content table__content_empty table__content_text_numeric">
                                                    <span className="ellipsis-text table__td_text">
                                                        {footer?.column?.columnDef?.footer
                                                            ? flexRender(
                                                                  footer.column.columnDef.footer,
                                                                  footer.getContext()
                                                              )
                                                            : null}
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tfoot>
                </table>
            </Scrollbar>
            <Divider />
        </div>
    );
};

export { ITableProps, TableLayoutTmp as default };
