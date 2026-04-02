import React, { ReactElement, useMemo, useRef, useState } from "react";
import {
    CellContext,
    ColumnDef,
    ExpandedState,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import classNames from "classnames";

import { ChevronDown, ChevronRight } from "@geneui/icons";

// Components
import { IButtonProps } from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import Pagination, { IPaginationProps } from "@components/molecules/Pagination";
import Tooltip from "@components/molecules/Tooltip";
import { INITIAL_PAGE_SIZE } from "@components/organisms/DataTable/constants";
// Hooks
import { useTablePagination } from "@components/organisms/DataTable/hooks/useTablePagination";
import TableBody from "@components/organisms/DataTable/TableBody/TableBody";
import TableHeader from "@components/organisms/DataTable/TableHeader/TableHeader";
// Types
import { ITableNoDataTexts } from "@components/organisms/DataTable/types";

import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./DataTable.scss";

/**
 * Props for the {@link DataTable} component.
 * @template TData - The shape of the overall row data object.
 */
interface IDataTableProps<TData> {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Set sticky header.
     */
    sticky?: boolean;
    /**
     * Defines the pagination of the Table component.
     * Whether set `true` will display the raw pagination.
     * Can accept also config object with custom handlers and data.
     *
     * @default true
     */
    pagination?: boolean | IPaginationProps;
    /**
     * Data record array to be displayed in the table.
     * Each object in this array represents a single row, and its shape should match the `TData` generic.
     *
     * @default []
     *
     * @example
     * ```tsx
     * type Person = { id: number; firstName: string; status: string };
     *  const tableData: Person[] = [
     * { id: 1, firstName: "John", status: "Active" },
     * { id: 2, firstName: "Jane", status: "Pending" },
     * { id: 3, firstName: "Alice", status: "Inactive" }
     * ];
     * ```
     */
    data?: TData[] | null;
    /**
     * Configuration array for the table columns.<br/>
     * Uses TanStack Table's `ColumnDef` structure to define headers, data accessors, and custom cell rendering.
     *
     * @default []
     *
     * @example
     * ```tsx
     * [
     * {
     * accessorKey: "id",
     * header: "ID",
     * },
     * {
     * accessorKey: "firstName",
     * header: "First Name",
     * cell: (info) => <span className="custom-name-class">{info.getValue() as string}</span>
     * },
     * {
     * accessorKey: "status",
     * }
     * ];
     * ```
     */
    columns: ColumnDef<TData>[];
    /**
     * Toggles the loading state of the table.
     */
    loading?: boolean;
    /**
     * Info text displayed under loading spinner.
     */
    loadingText?: string;
    /**
     * An object with error texts, used for various cases (no data, no result found).
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
    expandable?: boolean;
}

const DefaultCellComponent = ({ value }: { value: string }) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(textRef);
    return (
        <Tooltip text={value} isVisible={isTruncated}>
            <Text ref={textRef} className="tableBodyCell__text" as="span" variant="labelMediumMedium">
                {value}
            </Text>
        </Tooltip>
    );
};

const defaultColumn = {
    cell: <TData,>({ getValue }: CellContext<TData, string>) => <DefaultCellComponent value={getValue()} />
};

const ExpanderCell = <TData,>({ row }: CellContext<TData, unknown>) => (
    <button type="button" onClick={row.getToggleExpandedHandler()}>
        {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
    </button>
);

/**
 * Data Table used to display structured information in a grid format, making it easy to organize, view, and interact with large datasets.
 * Data tables are essential for presenting information such as reports, inventories, or user data in a clear,
 * sortable, and filterable manner, allowing users to quickly find, analyze, and manipulate data.
 *
 * @template TData - The shape of the overall row data object.
 * @param props - The properties for the component.
 * @returns The fully assembled DataTable component including headers, body, and optional pagination.
 */
const DataTable = <TData,>({
    className,
    data = [],
    columns = [],
    pagination = true,
    loading: externalLoading = false,
    sticky = true,
    loadingText,
    noDataTexts,
    noDataAvailableActions,
    expandable
}: IDataTableProps<TData>): ReactElement => {
    const [internalLoading] = useState(false);
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const tableColumns = useMemo(() => {
        const baseColumns: ColumnDef<TData>[] = [...columns];

        if (!expandable) {
            return baseColumns;
        }

        const expandedCol: ColumnDef<TData> = {
            id: "expander",
            header: "",
            cell: ExpanderCell
        };

        return [expandedCol, ...baseColumns];
    }, [columns, expandable]);

    const initialPageSize =
        typeof pagination === "object" && (pagination.pageSize || pagination.rowsPerPageOptions?.length)
            ? pagination.pageSize || pagination?.rowsPerPageOptions?.[0]
            : INITIAL_PAGE_SIZE;

    const table = useReactTable({
        data: data ?? [],
        columns: tableColumns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        getSubRows: (row) => {
            const subRows = (row as unknown as { SubRows?: unknown }).SubRows;
            return Array.isArray(subRows) ? (subRows as TData[]) : [];
        },
        initialState: {
            pagination: {
                pageSize: initialPageSize
            }
        },
        state: {
            expanded
        }
    });

    const isTableLoading = externalLoading || internalLoading;

    const { paginationProps } = useTablePagination(pagination, table);

    const shouldShowPagination = !isTableLoading && paginationProps && data && paginationProps.totalPages > 0;

    const isTableDataEmpty = isTableLoading || !data?.length;

    return (
        <div className={classNames("dataTable", className)}>
            <Scrollbar>
                <table
                    className={classNames("dataTable__table", {
                        dataTable__noDataToDisplay: isTableDataEmpty
                    })}
                >
                    <TableHeader sticky={sticky} headerGroups={table.getHeaderGroups()} />
                    <TableBody
                        loading={isTableLoading}
                        loadingText={loadingText}
                        rows={table.getRowModel().rows}
                        noDataTexts={noDataTexts}
                        noDataAvailableActions={noDataAvailableActions}
                    />
                </table>
            </Scrollbar>
            {shouldShowPagination && <Pagination className="dataTable__pagination" {...paginationProps} />}
        </div>
    );
};

export { IDataTableProps, DataTable as default };
