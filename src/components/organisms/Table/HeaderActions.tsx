import React, { FC } from "react";

import Checkbox from "@components/molecules/Checkbox";
import { HeaderActionsType } from "@components/organisms/Table/types";

interface IHeaderActions {
    type: HeaderActionsType;
    isAllSelected?: boolean;
    isSomeSelected?: boolean;
    onChange?: () => void;
}

const HeaderActions: FC<IHeaderActions> = ({ type, isSomeSelected, isAllSelected, onChange }) => {
    return type !== "RowCheckbox" ? (
        <div className="table__content table__content_empty" />
    ) : (
        <div className="table__content table__content_empty">
            <Checkbox
                name="column"
                value="column"
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                {...(onChange && { onChange })}
            />
        </div>
    );
};

export { IHeaderActions, HeaderActions as default };
