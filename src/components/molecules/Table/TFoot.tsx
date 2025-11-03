import React, { forwardRef } from "react";
import { flexRender, Header, Table } from "@tanstack/react-table";

import { Row } from ".";

interface ITableFoot {
    table: Table<Row>;
    withCheckbox?: boolean;
    expandable?: boolean;
}

const TFoot = forwardRef<HTMLTableSectionElement, ITableFoot>(({ table, withCheckbox, expandable }, ref) => {
    const renderTableFooterCell = (footer: Header<Row, unknown>) => {
        if (footer.id === "rowCheckbox" && !withCheckbox) return null;
        if (footer.id === "expand" && !expandable) return null;

        return (
            <td key={`${footer.id}_footer`} className="table__td" colSpan={footer.colSpan}>
                <div className="table__content table__content_empty table__content_text_numeric">
                    <span className="ellipsis-text table__td_text">
                        {footer?.column?.columnDef?.footer
                            ? flexRender(footer.column.columnDef.footer, footer.getContext())
                            : null}
                    </span>
                </div>
            </td>
        );
    };

    return (
        <tfoot ref={ref}>
            {table.getFooterGroups().map((footerGroups) => {
                return (
                    <tr key={`${footerGroups.id}_footer`} className="table__row table__row_tfoot">
                        {footerGroups.headers.map((footer) => {
                            return renderTableFooterCell(footer);
                        })}
                    </tr>
                );
            })}
        </tfoot>
    );
});

export { TFoot as default };
