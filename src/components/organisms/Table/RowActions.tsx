import React, { FC, JSX } from "react";

import Button from "@components/atoms/Button";
import Tooltip from "@components/molecules/Tooltip";

import { RowActionsIcons } from "./constants";
// Components
import { IRowAction } from "./types";

const Action: FC<{ title?: string; children: JSX.Element }> = ({ title, children }) => {
    return title ? <Tooltip text={title}>{children}</Tooltip> : children;
};

const RowActions: FC<IRowAction> = ({ label, ariaLabel, type, id, onClick, disabled }) => {
    return (
        <Action title={label}>
            <Button
                id={id}
                appearance="secondary"
                layout="text"
                size="small"
                Icon={RowActionsIcons[type]}
                aria-label={ariaLabel}
                onClick={onClick}
                disabled={disabled}
            />
        </Action>
    );
};

export { RowActions as default };
