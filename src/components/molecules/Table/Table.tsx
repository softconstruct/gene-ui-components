/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, FC, ReactNode, useState } from "react";
import {
    Column,
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

import Button from "@components/atoms/Button";
import CopyComponent from "@components/atoms/Copy";

import Filter from "./Filter";
import PinnedRow from "./PinnedRow";
import { TableCol } from "./type";

export interface ITableProps {
    columns: TableCol<any>[];
    externalData: Record<string, string | ReactNode | Record<string, string>>[];
    onSortChange?: (sortedData: ColumnSort[]) => void;
    pageSizes?: number[];
}

const TableComponent: FC<ITableProps> = ({ columns, externalData, onSortChange, pageSizes }) => {
    const [rowPinning, setRowPinning] = useState<RowPinningState>({
        top: [],
        bottom: []
    });
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [currentCol, setCurrentCol] = useState<Column<Record<string, ReactNode | Record<string, string>>, unknown>>(
        {}
    );
    const [sorting, setSorting] = useState<ColumnSort[]>([]);
    const [editableMode, setEditableMode] = useState(false);

    const [editedValue, setEditableValue] = useState<Record<string, Record<string, string>>>({});
    const [data, setData] = useState(externalData);

    const [columnPinning, setColumnPinning] = useState({});

    const accessEditableMode: Record<string, boolean> = {};
    const accessCopyable: Record<string, boolean> = {};

    const changeData = (e: ChangeEvent<HTMLInputElement>, index: number, id: string) => {
        e.persist();
        const current = e.currentTarget?.value;
        const createData = { ...editedValue, [id]: { ...editedValue[id], [index]: e.currentTarget?.value } };
        setEditableValue(createData);
        const newData = [...data];
        newData[index][id] = current;
        setData(newData);
    };

    const table = useReactTable({
        data,
        columns,
        initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
        state: {
            expanded,
            rowPinning,
            sorting,
            columnPinning
        },

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowCanExpand: (row) => !!row.original.subRows,

        onSortingChange: (e) => {
            onSortChange?.(sorting);
            setSorting(e);
        },
        onColumnPinningChange: setColumnPinning,
        onExpandedChange: setExpanded,
        onRowPinningChange: setRowPinning
    });
    const tableHeader = table.getHeaderGroups()[0].headers;
    const changeFilterKey = (e: ChangeEvent<HTMLSelectElement>) => {
        const currentFilter = +e.currentTarget.value;
        if (tableHeader[currentFilter].column) {
            setCurrentCol(tableHeader[currentFilter].column);
        }
    };

    const changeFilterData = (e: ChangeEvent<HTMLInputElement>) => {
        currentCol?.setFilterValue(e.currentTarget.value);
    };

    const createEditableCol = () => {
        setEditableMode((prev) => !prev);
    };

    return (
        <>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <input onChange={changeFilterData} />
                        <select onChange={changeFilterKey}>
                            {tableHeader.map(({ id }, i) => {
                                return (
                                    <option key={id} value={i}>
                                        {id}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label>
                                <input
                                    {...{
                                        type: "checkbox",
                                        checked: table.getIsAllColumnsVisible(),
                                        onChange: table.getToggleAllColumnsVisibilityHandler()
                                    }}
                                />{" "}
                                Toggle All
                            </label>
                            {table.getAllLeafColumns().map((column) => {
                                return (
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={column.getIsVisible()}
                                            onChange={(e) => {
                                                column.getToggleVisibilityHandler()(e);
                                            }}
                                        />
                                        {column.id}
                                    </label>
                                );
                            })}{" "}
                        </div>
                    </div>
                </div>

                <Button onClick={createEditableCol}>Edit</Button>
                <table style={{ width: "100%", height: "100%" }}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
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
                                            key={header.id}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            colSpan={header.colSpan}
                                        >
                                            {header.column.getIsPinned() !== "left" ? (
                                                <Button
                                                    className="border rounded px-2"
                                                    onClick={() => {
                                                        header.column.pin("left");
                                                    }}
                                                >
                                                    {"<="}
                                                </Button>
                                            ) : null}
                                            {header.column.getIsPinned() ? (
                                                <Button
                                                    className="border rounded px-2"
                                                    onClick={() => {
                                                        header.column.pin(false);
                                                    }}
                                                >
                                                    X
                                                </Button>
                                            ) : null}
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div
                                                        onClick={(e) =>
                                                            (header.column.columnDef as TableCol<unknown>).sortable &&
                                                            header?.column?.getToggleSortingHandler?.()?.(e)
                                                        }
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter column={header.column} />
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody style={{ textAlign: "center", overflowY: "scroll" }}>
                        {table.getTopRows().map((row) => (
                            <PinnedRow key={row.id} row={row} table={table} />
                        ))}
                        {table.getCenterRows().map((row) => {
                            return (
                                <>
                                    <tr key={row.id} style={{ marginLeft: 200 }}>
                                        {row.getVisibleCells().map((cell) => {
                                            const isEditable = accessEditableMode[cell.column.id];
                                            const isCopyable = accessCopyable[cell.column.id];

                                            return (
                                                <td key={cell.id} style={{ height: "100%" }}>
                                                    {editableMode && isEditable ? (
                                                        <input
                                                            value={editedValue[cell.column.id]?.[row.index]}
                                                            defaultValue={cell.row.original[cell.column.id] as string}
                                                            onChange={(e) => changeData(e, row.index, cell.column.id)}
                                                        />
                                                    ) : (
                                                        <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                                                    )}
                                                    {isCopyable && (
                                                        <CopyComponent
                                                            value={(cell.row.original[cell.column.id] as string) || ""}
                                                        />
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {row.getIsExpanded() && (
                                        <tr>
                                            <td colSpan={row.getVisibleCells().length}>
                                                {row.original.subRows as string}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                        {table.getBottomRows().map((row) => (
                            <PinnedRow key={row.id} row={row} table={table} />
                        ))}
                    </tbody>
                </table>
            </div>

            <div />
            <div>
                <Button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    {"<<"}
                </Button>
                <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {"<"}
                </Button>
                {new Array(table.getPageCount()).fill(undefined).map((_, i) => {
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <Button onClick={() => table.setPageIndex(i)} key={i}>
                            {(i + 1).toString()}
                        </Button>
                    );
                })}
                <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {">"}
                </Button>
                <Button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    {">>"}
                </Button>
                <span>
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <span>
                    | fast page change:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                    />
                </span>
                {pageSizes && (
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {pageSizes.map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}/page
                            </option>
                        ))}
                    </select>
                )}
            </div>
            <div />
        </>
    );
};

export default TableComponent;
