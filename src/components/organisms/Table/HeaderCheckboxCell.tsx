import React, { FC } from "react";
import classNames from "classnames";

// Components
import Checkbox from "@components/molecules/Checkbox";

interface IHeaderCheckboxCellProps {
    colspan: number;
    isGroup?: boolean;
    isAllSelected?: boolean;
    isSomeSelected?: boolean;
    onChange?: () => void;
}

const HeaderCheckboxCell: FC<IHeaderCheckboxCellProps> = ({
    colspan,
    isGroup,
    isSomeSelected,
    isAllSelected,
    onChange
}) => {
    return (
        <th
            colSpan={colspan}
            className={classNames("table__th", {
                table__th_group: isGroup
            })}
            scope="col"
        >
            <div className="table__content table__content_empty">
                <Checkbox
                    name="column"
                    value="column"
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    {...(onChange && { onChange })}
                />
            </div>
        </th>
    );
};

export { IHeaderCheckboxCellProps, HeaderCheckboxCell as default };
