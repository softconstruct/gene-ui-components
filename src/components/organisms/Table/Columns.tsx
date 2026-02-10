import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { generateDisplayColumnsProps } from "@components/organisms/Table/helpers";
// Components
import { ExpandAndCheckboxTypes, Row, TableColumns } from "@components/organisms/Table/types";

import { DISPLAY_COLUMN_MAP, DISPLAY_COLUMN_TYPES } from "./constants";

const columnHelper = createColumnHelper<Row>();

export const createColumns = (columns?: TableColumns<Row>[]): ColumnDef<Row>[] => {
    if (!columns?.length) return [];

    return columns.map((item) => {
        if (DISPLAY_COLUMN_TYPES.includes(item.type)) {
            const Component = DISPLAY_COLUMN_MAP[item.type as ExpandAndCheckboxTypes];

            return columnHelper.display({
                ...item,
                id: item?.id || item.dataKey,
                header: ({ header }) => {
                    const componentProps = generateDisplayColumnsProps(item.type, header);
                    return <Component {...componentProps} />;
                },
                type: item.type,
                dataKey: item.dataKey
            });
        }

        if (item.type === "Group") {
            return columnHelper.group({
                id: item?.id || item.dataKey,
                header: item.header,
                type: "Group",
                dataKey: item.dataKey,
                columns: createColumns(item.columns)
            });
        }

        return columnHelper.accessor((row) => row.dataKey, {
            ...item,
            id: item?.id || item.dataKey,
            header: () => item?.header || null,
            type: item.type,
            dataKey: item.dataKey
        });
    });
};
