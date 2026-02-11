import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import classNames from "classnames";

import Cell from "@components/organisms/Table/Cell";
import HeaderActions from "@components/organisms/Table/HeaderActions";
// Helpers
import { generateDisplayColumnsProps } from "@components/organisms/Table/helpers";
// Components
import { HeaderActionsType, Row, TableColumns } from "@components/organisms/Table/types";

// Constants
import { DISPLAY_COLUMN_TYPES } from "./constants";

const columnHelper = createColumnHelper<Row>();

export const createColumns = (columns?: TableColumns<Row>[]): ColumnDef<Row>[] => {
    if (!columns?.length) return [];

    return columns.map((item) => {
        if (DISPLAY_COLUMN_TYPES.includes(item.type)) {
            const type = item.type as HeaderActionsType;

            return columnHelper.display({
                ...item,
                id: item?.id || item.dataKey,
                header: ({ header }) => {
                    const componentProps = generateDisplayColumnsProps(type, header);
                    return (
                        <th
                            colSpan={header.colSpan}
                            className={classNames("table__th", {
                                table__th_group: Boolean(header.subHeaders.length)
                            })}
                            scope="col"
                        >
                            <HeaderActions {...componentProps} />
                        </th>
                    );
                },
                cell: () => <Cell type={item.type} />,
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

        return columnHelper.accessor((row) => row[item.dataKey], {
            ...item,
            id: item?.id || item.dataKey,
            header: () => item?.header || null,
            cell: ({ row }) => {
                return <Cell type={item.type} data={row.original[item.dataKey]} />;
            },
            type: item.type,
            dataKey: item.dataKey
        });
    });
};
