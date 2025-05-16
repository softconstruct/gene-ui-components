import React, { ReactNode } from "react";
import { Column } from "@tanstack/react-table";

const Filter = ({
    column
    // table
}: {
    column: Column<Record<string, string | ReactNode | Record<string, string>>, unknown>;
    // table: Table<Record<string, string | Record<string, string>>>;
}) => {
    // const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

    // return typeof firstValue === "number" ? (
    //     <div>
    //         <input
    //             type="number"
    //             value={((column.getFilterValue() as unknown[])?.[0] ?? "") as string}
    //             onChange={(e) => column.setFilterValue((old: unknown[]) => [e.target.value, old?.[1]])}
    //             placeholder="Min"
    //         />
    //         <input
    //             type="number"
    //             value={((column.getFilterValue() as unknown[])?.[1] ?? "") as string}
    //             onChange={(e) => column.setFilterValue((old: unknown[]) => [old?.[0], e.target.value])}
    //             placeholder="Max"
    //         />
    //     </div>
    // ) : (
    //     <input
    //         type="text"
    //         value={(column.getFilterValue() ?? "") as string}
    //         onChange={(e) => column.setFilterValue(e.target.value)}
    //         placeholder="Search..."
    //     />
    // );
    return (
        <input
            type="text"
            value={(column.getFilterValue() ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Search..."
        />
    );
};
export default Filter;
