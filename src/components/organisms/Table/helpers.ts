import { Header } from "@tanstack/table-core";

import { IHeaderActions } from "@components/organisms/Table/HeaderActions";
// Components
import { EditBuffer, HeaderActionsType, Row, RowId } from "@components/organisms/Table/types";

const BUFFER_KEY_SEP = "::";

export function getBufferKey(rowId: RowId, columnId: string): string {
    return `${rowId}${BUFFER_KEY_SEP}${columnId}`;
}

export function getCellValue(row: Row, columnId: string, buffer: EditBuffer): unknown {
    const key = getBufferKey(row.id, columnId);
    return buffer.has(key) ? buffer.get(key) : row[columnId];
}

export function mergeBufferIntoData(data: Row[], buffer: EditBuffer): Row[] {
    return data.map((row) => {
        const prefix = `${row.id}${BUFFER_KEY_SEP}`;
        const keys = Array.from(buffer.keys()).filter((k) => k.startsWith(prefix));
        if (keys.length === 0) return row;
        const next = { ...row } as Row;
        keys.forEach((k) => {
            const colId = k.slice(prefix.length);
            (next as Record<string, unknown>)[colId] = buffer.get(k);
        });
        return next;
    });
}

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
