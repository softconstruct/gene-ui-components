import React, { FC } from "react";
import { Row as RowData } from "@tanstack/react-table";

// Components
import TRow from "@components/organisms/Table/TRow";

import { Row } from "./types";

interface ITableBody {
    rows: RowData<Row>[];
}

const TBody: FC<ITableBody> = ({ rows }) => {
    const renderTableBody = () => {
        return rows.map((row) => <TRow key={row.id} row={row} />);
    };

    return <tbody>{renderTableBody()}</tbody>;
};

export { TBody as default };
