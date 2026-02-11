import { Header } from "@tanstack/table-core";

import { IHeaderActions } from "@components/organisms/Table/HeaderActions";
// Components
import { HeaderActionsType, Row } from "@components/organisms/Table/types";

export const generateDisplayColumnsProps = (
    type: HeaderActionsType,
    header: Header<Row, unknown>,
    onChange?: () => void
): IHeaderActions => {
    const context = header.getContext();
    return {
        type,
        isAllSelected: context.table.getIsAllRowsSelected(),
        isSomeSelected: context.table.getIsSomeRowsSelected(),
        onChange
    };
};
