import { Row } from "@components/molecules/Table/makeData";

export const CellClassNames: { [key: string]: string } = {
    empty: "table__content_empty",
    graph: "table__content_graph",
    text: "table__content_text table__content_text_string",
    number: "table__content_text table__content_text_numeric",
    longText: "table__content_text table__content_text_string table__content_textArea",
    dropdown: "table__content_text table__content_text_string table__content_dropdown",
    status: "table__content_status",
    pill: "table__content_pill",
    icon: "table__content_icon",
    flag: "table__content_icon",
    checkbox: "table__content_check table__content_check_checkbox",
    switch: "table__content_switch"
};

type Cloneable = Row | Row[] | { [key: string]: Cloneable } | Cloneable[] | null;

export function deepCloneWithFunctions<T extends Cloneable>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => deepCloneWithFunctions(item)) as T;
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
