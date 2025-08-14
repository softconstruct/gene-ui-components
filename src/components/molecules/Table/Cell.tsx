import React, { ChangeEvent, FC, JSX } from "react";

import { IconProps } from "@geneui/icons";

import Copy from "@components/atoms/Copy";
import Pill, { IPillProps } from "@components/atoms/Pill";
import Checkbox, { ICheckboxProps } from "@components/molecules/Checkbox";
import Switch, { ISwitchProps } from "@components/molecules/Switch";
import TextField from "@components/molecules/TextField";

import { CellType } from "./type";

interface ICellProps {
    type: CellType;
    withEditMode: boolean;
    data?: string | number | boolean | IPillProps | ICheckboxProps | ISwitchProps | FC<IconProps>;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    rowCellRenderer?: (data?: any) => JSX.Element;
    withCopy?: boolean;
}

type CellRenderer = {
    [key: string]: (
        props: Omit<ICellProps, "type"> & {
            inputType?: "text" | "number";
        }
    ) => JSX.Element;
};

export const cellRenderer: CellRenderer = {
    empty: ({ rowCellRenderer }) =>
        rowCellRenderer ? rowCellRenderer() : <div className="table__content table__content_empty" />,
    graph: ({ rowCellRenderer, data }) => {
        return rowCellRenderer ? rowCellRenderer(data) : <img src={data as string} alt="" />;
    },
    text: ({ rowCellRenderer, data, withEditMode, inputType = "text", withCopy, onChange }) => {
        const value = data as string;
        if (withEditMode) {
            return (
                <TextField
                    numericOnly={inputType === "number"}
                    placeholder="Row Text"
                    value={value}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                />
            );
        }

        if (rowCellRenderer) return rowCellRenderer(data);

        return (
            <>
                <span className="table__td_text ellipsis-text">{value}</span>
                {withCopy && <Copy value={value} size="small" appearance="secondary" className="table__content_copy" />}
            </>
        );
    },
    longText: ({ rowCellRenderer, data, withEditMode, withCopy, onChange }) => {
        const value = data as string;
        if (withEditMode) {
            return (
                <textarea
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate felis eget nulla consequat, non fermentum velit gravida. Nulla facilisi. Aenean ac "
                    value={value}
                    style={{ width: "280px" }}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                />
            );
        }

        if (rowCellRenderer) return rowCellRenderer(data);

        return (
            <>
                <span className="table__td_text">{value}</span>
                {withCopy && <Copy value={value} size="small" appearance="secondary" className="table__content_copy" />}
            </>
        );
    },
    dropdown: ({ rowCellRenderer, data, withEditMode, withCopy, onChange }) => {
        const value = data as string;
        if (withEditMode) {
            return (
                <select
                    name="dropdown"
                    id="dropdown"
                    style={{ width: "160px" }}
                    value={value}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                >
                    <option value="Value">Value</option>
                </select>
            );
        }

        if (rowCellRenderer) return rowCellRenderer(data);

        return (
            <>
                <span className="table__td_text ellipsis-text">{value}</span>
                {withCopy && <Copy value={value} size="small" appearance="secondary" className="table__content_copy" />}
            </>
        );
    },
    status: ({ rowCellRenderer, data }) => {
        /* todo: change "Pill" components "color" as a status to next values: "informative", "neutral", "error", "success", "warning" */
        const props = data as IPillProps;

        return rowCellRenderer ? (
            rowCellRenderer(data)
        ) : (
            <Pill {...props} text={props.text} appearance={props.appearance} />
        );
    },
    pill: ({ rowCellRenderer, data }) => {
        const props = data as IPillProps;

        return rowCellRenderer ? (
            rowCellRenderer(data)
        ) : (
            <Pill
                text={props.text}
                filled={props.filled}
                appearance={props.appearance}
                size={props.size}
                withDot={props.withDot}
            />
        );
    },
    icon: ({ rowCellRenderer, data: icon }) => {
        /* todo: import icon as a component for "Icon" and "Flag" case */
        const Icon = icon as FC<IconProps>;
        return rowCellRenderer ? rowCellRenderer(icon) : <Icon size={24} />;
    },
    flag: ({ rowCellRenderer, data: icon }) => {
        /* todo: import icon as a component for "Icon" and "Flag" case */
        const Icon = icon as FC<IconProps>;
        return rowCellRenderer ? rowCellRenderer(icon) : <Icon size={24} />;
    },
    checkbox: ({ rowCellRenderer, data, withEditMode, onChange }) => {
        const props = data as ICheckboxProps;
        if (withEditMode)
            return (
                <Checkbox
                    {...props}
                    value={props.value}
                    checked={props.checked}
                    {...(onChange && {
                        onChange: (e) => {
                            onChange(e);
                        }
                    })}
                />
            );

        if (rowCellRenderer) return rowCellRenderer(data);

        return <Checkbox name="item" value={props.value} checked={props.checked} readOnly />;
    },
    switch: ({ rowCellRenderer, data, withEditMode, onChange }) => {
        const props = data as ISwitchProps;
        if (withEditMode)
            return (
                <Switch
                    {...props}
                    value={props.value}
                    checked={props.checked}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                />
            );

        if (rowCellRenderer) return rowCellRenderer();

        return <span className="table__td_text">{props.checked ? "on" : "off"}</span>;
    }
};

const Cell: FC<ICellProps> = ({ type, rowCellRenderer, data, withEditMode, withCopy, onChange }) => {
    if (!data) return null;

    const cellTypeWithNumber = type === "number" ? "text" : type;
    const CellItem = cellRenderer[cellTypeWithNumber];
    return (
        <>
            {CellItem({
                rowCellRenderer,
                withEditMode,
                data,
                inputType: type === "number" ? type : "text",
                withCopy,
                onChange
            })}
        </>
    );
};

export { ICellProps, Cell as default };
