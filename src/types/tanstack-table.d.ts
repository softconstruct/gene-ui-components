import type { FilterFn, Row, RowData } from "@tanstack/table-core";

/**
 * Cell type union for table column definitions.
 * Mirrors CellType from @components/organisms/Table/types for declaration merging.
 */
type TableCellType =
    | "Group"
    | "Empty"
    | "Expand"
    | "RowCheckbox"
    | "Graph"
    | "Text"
    | "Number"
    | "LongText"
    | "Dropdown"
    | "Status"
    | "Pill"
    | "Icon"
    | "Flag"
    | "Checkbox"
    | "Switch";

/**
 * Augment ColumnDefBase (not ColumnDef - that's a type alias).
 * All column def types extend ColumnDefBase, so this adds our props to column.columnDef.
 */
declare module "@tanstack/table-core" {
    interface ColumnDefBase<TData extends RowData, TValue = unknown> {
        type: TableCellType;
        dataKey: string;
        order?: number;
        disabled?: boolean;
        isPinned?: boolean;
        isVisible?: boolean;
        isCheckboxDisabled?: boolean;
        enableSorting?: boolean;
        enableColumnFilters?: boolean;
        isSortingDisabled?: boolean;
        editable?: boolean;
        isEditDisabled?: boolean;
        copyable?: boolean;
        isCopyDisabled?: boolean;
        enableColumnFilter?: boolean;
        isColumnFilterDisabled?: boolean;
        enableSelectFilter?: boolean;
        isSelectFilter?: boolean;
        filterOptions?: string[];
        resizable?: boolean;
        width?: number | string;
        minWidth?: number;
        maxWidth?: number;
        renderer?: (
            data?: Row<RowData>,
            editMode?: boolean,
            onChange?: (value: string | number) => void
        ) => import("react").ReactNode;
    }
    interface TableMeta<TData extends RowData> {
        editMode?: boolean;
        updateData?: (rowIndex: number, columnId: string, value: string | number | boolean) => void;
        getCellValue?: (row: Row, columnId: string) => unknown;
    }
}

declare module "@tanstack/react-table" {
    interface FilterFns {
        multiSelect: FilterFn<unknown>;
    }
}
