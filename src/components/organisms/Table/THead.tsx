import React, {
    DetailedHTMLProps,
    FC,
    forwardRef,
    HTMLAttributes,
    MouseEvent as ReactMouseEvent,
    TouchEvent as ReactTouchEvent
} from "react";
import { ColumnSizingState, flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import classNames from "classnames";

// Components
import { ColActions } from "@components/organisms/Table/ColActions";

import { Row } from "./types";

interface ITableHeadProps {
    columns: HeaderGroup<Row>[];
    resizable?: boolean;
    selectAllText?: string;
    withStickyHeader?: boolean;
    onColumnSizingChange?: (columnData: ColumnSizingState) => void;
    onColumnSizingRestore?: (columnData: ColumnSizingState) => void;
}

interface IHeaderCellProps {
    header: Header<Row, unknown>;
    resizable?: boolean;
    selectAllText?: string;
    onColumnSizingChange?: (columnData: ColumnSizingState) => void;
    onColumnSizingRestore?: (columnData: ColumnSizingState) => void;
}

const HeaderCell: FC<IHeaderCellProps> = ({
    header,
    selectAllText,
    resizable,
    onColumnSizingRestore,
    onColumnSizingChange
}) => {
    if (header.isPlaceholder) return null;

    const colDef = header.column.columnDef;
    if (!colDef) return null;

    const canResize = header.column.getCanResize();

    if (colDef.type === "RowCheckbox" || colDef.type === "Expand") {
        return flexRender(header.column.columnDef.header, header.getContext());
    }

    const resizeHandler = header.getResizeHandler();

    const handleColumnSizeRestore = () => {
        header.column.resetSize();
        const restoredColumn: ColumnSizingState = {
            [header.column.id]: header.column.getSize()
        };
        onColumnSizingRestore?.(restoredColumn);
    };

    const handleColumnSizeChange = (
        event: ReactMouseEvent<HTMLDivElement, MouseEvent> | ReactTouchEvent<HTMLDivElement>
    ) => {
        resizeHandler(event);
        const resizedColumn: ColumnSizingState = {
            [header.column.id]: header.column.getSize()
        };

        onColumnSizingChange?.(resizedColumn);
    };

    const resizeEvents: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> = canResize && resizable
        ? {
              onDoubleClick: handleColumnSizeRestore,
              onMouseDown: handleColumnSizeChange,
              onTouchStart: handleColumnSizeChange
          }
        : {};

    return (
        <th
            key={`${header.id}_header`}
            colSpan={header.colSpan}
            scope={header.subHeaders.length ? "colgroup" : "col"}
            className={classNames("table__th", {
                table__th_group: header.subHeaders.length,
                table__td_pinned: header.column.getIsPinned()
                // table__th_active: !!activeHeaders?.[header.id]
            })}
            style={{
                width: header.getSize(),
                minWidth: header.getSize()
            }}
        >
            <div className="table__content table__content_empty" {...resizeEvents}>
                <div className="table__content table__content_header">
                    <span className="table__th_text ellipsis-text">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <ColActions
                        header={header}
                        // onColAction={onColAction}
                        selectAllText={selectAllText}
                    />
                </div>
            </div>
        </th>
    );
};

const THead = forwardRef<HTMLTableSectionElement, ITableHeadProps>(
    ({ columns, selectAllText, withStickyHeader, resizable, onColumnSizingRestore, onColumnSizingChange }, ref) => {
        return (
            <thead
                ref={ref}
                className={classNames({
                    table__thead_sticky: withStickyHeader
                })}
            >
                {columns.map((headerGroup) => (
                    <tr key={headerGroup.id} className="table__row table__row_thead">
                        {headerGroup.headers.map((header) => (
                            <HeaderCell
                                key={header.id}
                                header={header}
                                resizable={resizable}
                                selectAllText={selectAllText}
                                onColumnSizingChange={onColumnSizingChange}
                                onColumnSizingRestore={onColumnSizingRestore}
                            />
                        ))}
                    </tr>
                ))}
            </thead>
        );
    }
);

export { ITableHeadProps, THead as default };
