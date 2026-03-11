import React, { FC, JSX } from "react";
import { Row as RowData } from "@tanstack/react-table";

import Button from "@components/atoms/Button";
import Tooltip from "@components/molecules/Tooltip";

import { RowActionsIcons } from "./constants";
// Components
import { IRowAction, Row } from "./types";

const Action: FC<{ title?: string; children: JSX.Element }> = ({ title, children }) => {
    return title ? <Tooltip text={title}>{children}</Tooltip> : children;
};

const RowActions: FC<
    IRowAction & {
        row: RowData<Row>;
    }
> = ({ label, ariaLabel, type, id, onClick, disabled, row }) => {
    const handleRowPin = () => {
        const isPined = row.getIsPinned();
        row.pin(isPined ? false : "top");
        onClick(row);
    };

    const handleClick = () => {
        onClick(row);
    };

    const onClickProp = type === "pin" || type === "pinFilled" ? () => handleRowPin() : () => handleClick();

    return (
        <Action title={label}>
            <Button
                id={id}
                appearance="secondary"
                layout="text"
                size="small"
                Icon={RowActionsIcons[type]}
                aria-label={ariaLabel}
                onClick={onClickProp}
                disabled={disabled}
            />
        </Action>
    );
};

export { RowActions as default };
