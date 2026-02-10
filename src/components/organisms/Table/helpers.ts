import { Header } from "@tanstack/table-core";

import { IHeaderCheckboxCellProps } from "@components/organisms/Table/HeaderCheckboxCell";
import { IHeaderExpandCellProps } from "@components/organisms/Table/HeaderExpandCell";
import { CellType, Row } from "@components/organisms/Table/types";

export const generateDisplayColumnsProps = (
    type: CellType,
    header: Header<Row, unknown>,
    onChange?: () => void
): IHeaderExpandCellProps | IHeaderCheckboxCellProps => {
    if (type === "Expand") {
        return {
            colspan: header.colSpan,
            isGroup: Boolean(header.subHeaders.length)
        };
    }
    const context = header.getContext();
    return {
        colspan: header.colSpan,
        isGroup: Boolean(header.subHeaders.length),
        isAllSelected: context.table.getIsAllRowsSelected(),
        isSomeSelected: context.table.getIsSomeRowsSelected(),
        onChange
    };
};
