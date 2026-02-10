import React, { FC } from "react";
import classNames from "classnames";

interface IHeaderExpandCellProps {
    colspan: number;
    isGroup?: boolean;
}

const HeaderExpandCell: FC<IHeaderExpandCellProps> = ({ colspan, isGroup }) => {
    return (
        <th
            colSpan={colspan}
            className={classNames("table__th", {
                table__th_group: isGroup
            })}
            scope="col"
            aria-label="Expand row"
        >
            <div className="table__content table__content_empty" />
        </th>
    );
};

export { IHeaderExpandCellProps, HeaderExpandCell as default };
