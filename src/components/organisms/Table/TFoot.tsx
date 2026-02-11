import React, { FC, forwardRef } from "react";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import classNames from "classnames";

import { Row } from "@components/organisms/Table/types";

interface ITFoot {
    footer: HeaderGroup<Row>[];
    withStickyFooter?: boolean;
}

const TFoot: FC<ITFoot> = forwardRef<HTMLTableSectionElement, ITFoot>(({ footer, withStickyFooter }, ref) => {
    const renderTableFooterCell = (cell: Header<Row, unknown>) => {
        return (
            <td key={`${cell.id}_footer`} className="table__td" colSpan={cell.colSpan}>
                <div className="table__content table__content_empty table__content_text_numeric">
                    <span className="ellipsis-text table__td_text">
                        {cell?.column?.columnDef?.footer
                            ? flexRender(cell.column.columnDef.footer, cell.getContext())
                            : null}
                    </span>
                </div>
            </td>
        );
    };

    return (
        <tfoot
            ref={ref}
            className={classNames({
                table__tfoot_sticky: withStickyFooter
            })}
        >
            {footer.map((footerGroups) => {
                return (
                    <tr key={`${footerGroups.id}_footer`} className="table__row table__row_tfoot">
                        {footerGroups.headers.map((cell) => {
                            return renderTableFooterCell(cell);
                        })}
                    </tr>
                );
            })}
        </tfoot>
    );
});

export { TFoot as default };
