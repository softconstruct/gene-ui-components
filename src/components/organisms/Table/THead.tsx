import React, { FC, forwardRef } from "react";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import classNames from "classnames";

import Checkbox from "@components/molecules/Checkbox";

import { Row as RowData } from "./types";

interface ITableHead {
    columns: HeaderGroup<RowData>[];
    withStickyHeader?: boolean;
}

const HeaderCell: FC<any> = ({ header }: { header: Header<RowData, unknown> }) => {
    if (header.isPlaceholder) return null;

    const colDef = header.column.columnDef;
    if (!colDef) return null;

    if (colDef.type === "RowCheckbox") {
        // const isAllSelected = table.getIsAllPageRowsSelected();
        // const isSomeSelected = table.getIsSomePageRowsSelected();
        return (
            <th
                key={`${header.id}_header`}
                colSpan={header.colSpan}
                className={classNames("table__th", {
                    table__th_group: header.subHeaders.length
                })}
                scope="col"
            >
                <div className="table__content table__content_empty">
                    <Checkbox
                        name="column"
                        value="column"
                        // checked={isAllSelected}
                        // indeterminate={isSomeSelected}
                        // aria-label={
                        //     isAllSelected ? `Deselect all ${rowCount || 0} rows` : `Select all ${rowCount || 0} rows`
                        // }
                        // aria-checked={isAllSelected}
                        // onChange={() => {
                        //     table.toggleAllPageRowsSelected();
                        // }}
                    />
                </div>
            </th>
        );
    }
    if (colDef.type === "Expand") {
        return (
            <th
                key={`${header.id}_header`}
                colSpan={header.colSpan}
                className={classNames("table__th", {
                    table__th_group: header.subHeaders.length
                })}
                scope="col"
                aria-label="Expand row"
            >
                <div className="table__content table__content_empty" />
            </th>
        );
    }

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
        >
            <div className="table__content table__content_empty">
                <div className="table__content table__content_header">
                    <span className="table__th_text ellipsis-text">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {/* {header.id !== "expand" && ( */}
                    {/*    <ColActions */}
                    {/*        header={header} */}
                    {/*        columnsMap={columnsMap} */}
                    {/*        onColAction={onColAction} */}
                    {/*        selectAllText={selectAllText} */}
                    {/*    /> */}
                    {/* )} */}
                </div>
            </div>
        </th>
    );
};

const THead = forwardRef<HTMLTableSectionElement, ITableHead>(({ columns, withStickyHeader }, ref) => {
    // const [activeHeaders, setActiveHeaders] = useState<Record<string, boolean> | null>(null);
    //
    // const onColAction = (colId: string, value: boolean) => {
    //     setActiveHeaders({ ...activeHeaders, [colId]: value });
    // };
    //
    // const getAriaSortValue = (
    //     sortDirection: false | "asc" | "desc"
    // ): "ascending" | "descending" | "none" | undefined => {
    //     if (sortDirection === "asc") {
    //         return "ascending";
    //     }
    //     if (sortDirection === "desc") {
    //         return "descending";
    //     }
    //     return undefined;
    // };
    //
    // const renderTableHeaderCell = (header: Header<Row, unknown>) => {
    //     if (header.isPlaceholder) return null;
    //
    //     const columnId = header.column.id;
    //     const colDef = columnsMap.get(columnId);
    //     if (!colDef) return null;
    //
    //     if (colDef.type === "RowCheckbox" && withCheckbox) {
    //         const isAllSelected = table.getIsAllPageRowsSelected();
    //         const isSomeSelected = table.getIsSomePageRowsSelected();
    //         return (
    //             <th
    //                 key={`${header.id}_header`}
    //                 colSpan={header.colSpan}
    //                 className={classNames("table__th", {
    //                     table__th_group: header.subHeaders.length
    //                 })}
    //                 scope="col"
    //             >
    //                 <div className="table__content table__content_empty">
    //                     <Checkbox
    //                         name="column"
    //                         value="column"
    //                         checked={isAllSelected}
    //                         indeterminate={isSomeSelected}
    //                         aria-label={
    //                             isAllSelected
    //                                 ? `Deselect all ${rowCount || 0} rows`
    //                                 : `Select all ${rowCount || 0} rows`
    //                         }
    //                         aria-checked={isAllSelected}
    //                         onChange={() => {
    //                             table.toggleAllPageRowsSelected();
    //                         }}
    //                     />
    //                 </div>
    //             </th>
    //         );
    //     }
    //     if (colDef.type === "Expand" && withExpandable) {
    //         return (
    //             <th
    //                 key={`${header.id}_header`}
    //                 colSpan={header.colSpan}
    //                 className={classNames("table__th", {
    //                     table__th_group: header.subHeaders.length
    //                 })}
    //                 scope="col"
    //                 aria-label="Expand row"
    //             >
    //                 <div className="table__content table__content_empty" />
    //             </th>
    //         );
    //     }
    //
    //     if (header.id === "rowCheckbox") return null;
    //     if (header.id === "expand") return null;
    //
    //     const headerText = flexRender(header.column.columnDef.header, header.getContext());
    //     const sortDirection = header.column.getIsSorted();
    //
    //     return (
    //         <th
    //             key={`${header.id}_header`}
    //             colSpan={header.colSpan}
    //             scope={header.subHeaders.length ? "colgroup" : "col"}
    //             className={classNames("table__th", {
    //                 table__th_group: header.subHeaders.length,
    //                 table__td_pinned: header.column.getIsPinned(),
    //                 table__th_active: !!activeHeaders?.[header.id]
    //             })}
    //             aria-sort={getAriaSortValue(sortDirection)}
    //             aria-label={sortDirection || undefined}
    //         >
    //             <div className="table__content table__content_empty">
    //                 <div className="table__content table__content_header">
    //                     <span className="table__th_text ellipsis-text">{headerText}</span>
    //                     {/*{header.id !== "expand" && (*/}
    //                     {/*    <ColActions*/}
    //                     {/*        header={header}*/}
    //                     {/*        columnsMap={columnsMap}*/}
    //                     {/*        onColAction={onColAction}*/}
    //                     {/*        selectAllText={selectAllText}*/}
    //                     {/*    />*/}
    //                     {/*)}*/}
    //                 </div>
    //             </div>
    //         </th>
    //     );
    // };
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
                        <HeaderCell key={header.id} header={header} />
                    ))}
                </tr>
            ))}
            {/* {table.getHeaderGroups().map((headerGroup) => ( */}
            {/*    <tr key={`${headerGroup.id}_header`} className="table__row table__row_thead"> */}
            {/*        {headerGroup.headers.map((header) => renderTableHeaderCell(header))} */}
            {/*    </tr> */}
            {/* ))} */}
        </thead>
    );
});

export { THead as default };
