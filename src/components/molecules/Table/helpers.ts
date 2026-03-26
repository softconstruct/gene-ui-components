import { ArrowDown, ArrowUp, ArrowUpDown } from "@geneui/icons";

import { Row, TableCol } from "@components/molecules/Table/type";

export const CellClassNames: { [key: string]: string } = {
    Empty: "table__content_empty",
    Graph: "table__content_graph",
    Text: "table__content_text table__content_text_string",
    Number: "table__content_text table__content_text_numeric",
    LongText: "table__content_text table__content_text_string table__content_textArea",
    Dropdown: "table__content_text table__content_text_string table__content_dropdown",
    Status: "table__content_status",
    Pill: "table__content_pill",
    Icon: "table__content_icon",
    Flag: "table__content_icon",
    Checkbox: "table__content_check table__content_check_checkbox",
    Switch: "table__content_switch"
};

export const SortingIcons = {
    asc: ArrowUp,
    desc: ArrowDown,
    false: ArrowUpDown
};

type Cloneable = Row | Row[] | TableCol<Row>[] | { [key: string]: Cloneable } | Cloneable[] | null;

export function deepCloneWithFunctions<T extends Cloneable>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => deepCloneWithFunctions(item as Cloneable)) as T;
    }

    if (typeof obj === "function") {
        return obj;
    }

    const clonedObj: { [key: string]: Cloneable } = {};
    Object.keys(obj).forEach((key) => {
        clonedObj[key] = deepCloneWithFunctions((obj as any)[key]);
    });

    return clonedObj as T;
}
