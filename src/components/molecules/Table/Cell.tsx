import React, { ChangeEvent, FC, ReactNode } from "react";

import { Copy } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Pill from "@components/atoms/Pill";
import Checkbox from "@components/molecules/Checkbox";

interface ICellProps {
    type:
        | "empty"
        | "expand"
        | "rowCheckbox"
        | "graph"
        | "text"
        | "number"
        | "longText"
        | "dropdown"
        | "status"
        | "pill"
        | "icon"
        | "flag"
        | "checkbox"
        | "switch";
    withEditMode: boolean;
    data: any;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    rowCellRenderer: (rowCellRenderer: ReactNode) => Element;
}

type CellRenderer = {
    [key: string]: (
        props: Omit<ICellProps, "type"> & {
            inputType?: "text" | "number";
        }
    ) => Element;
};

export const cellRenderer: CellRenderer = {
    empty: ({ rowCellRenderer }) => rowCellRenderer(<div className="table__content table__content_empty" />),
    graph: ({ rowCellRenderer, data }) => {
        return rowCellRenderer(<img src={data} alt="" />);
    },
    text: ({ rowCellRenderer, data, withEditMode, inputType = "text", onChange }) =>
        rowCellRenderer(
            !withEditMode ? (
                <>
                    <span className="table__td_text ellipsis-text">{data}</span>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        Icon={Copy}
                        onClick={() => {}}
                        className="table__content_copy"
                    />
                </>
            ) : (
                <input
                    type={inputType}
                    placeholder="Row Text"
                    value={data}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                    style={{ width: "160px" }}
                />
            )
        ),
    longText: ({ rowCellRenderer, data, withEditMode, onChange }) => {
        return rowCellRenderer(
            !withEditMode ? (
                <>
                    <span className="table__td_text">{data}</span>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        Icon={Copy}
                        onClick={() => {}}
                        className="table__content_copy"
                    />
                </>
            ) : (
                <textarea
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate felis eget nulla consequat, non fermentum velit gravida. Nulla facilisi. Aenean ac "
                    value={data}
                    style={{ width: "280px" }}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                />
            )
        );
    },
    dropdown: ({ rowCellRenderer, data, withEditMode, onChange }) => {
        return rowCellRenderer(
            !withEditMode ? (
                <>
                    <span className="table__td_text ellipsis-text">{data}</span>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        Icon={Copy}
                        onClick={() => {}}
                        className="table__content_copy"
                    />
                </>
            ) : (
                <select
                    name="dropdown"
                    id="dropdown"
                    style={{ width: "160px" }}
                    value={data}
                    {...(onChange && { onChange: (e) => onChange(e) })}
                >
                    <option value="Value">Value</option>
                    <option value="Value">Value</option>
                    <option value="Value">Value</option>
                    <option value="Value">Value</option>
                    <option value="Value">Value</option>
                </select>
            )
        );
    },
    status: ({ rowCellRenderer, data }) => {
        /* todo: change "Pill" components "color" as a status to next values: "informative", "neutral", "error", "success", "warning" */

        return rowCellRenderer(<Pill text={data.text} appearance={data.color} />);
    },
    pill: ({ rowCellRenderer, data }) => {
        return rowCellRenderer(
            <Pill
                text={data.text}
                filled={data.isFill}
                appearance={data.color}
                size={data.size}
                withDot={data.withDot}
            />
        );
    },
    icon: ({ rowCellRenderer, data: icon }) => {
        /* todo: import icon as a component for "Icon" and "Flag" case */
        const Icon = icon;
        return rowCellRenderer(<Icon size={24} />);
    },
    flag: ({ rowCellRenderer, data: icon }) => {
        /* todo: import icon as a component for "Icon" and "Flag" case */
        const Icon = icon;
        return rowCellRenderer(<Icon size={24} />);
    },
    checkbox: ({ rowCellRenderer, data, withEditMode, onChange }) =>
        rowCellRenderer(
            !withEditMode ? (
                <Checkbox name="item" value={data} checked readOnly />
            ) : (
                <Checkbox name="item" value={data} {...(onChange && { onChange: (e) => onChange(e) })} />
            )
        ),
    switch: ({ rowCellRenderer, data, withEditMode, onChange }) =>
        rowCellRenderer(
            !withEditMode ? (
                <span className="table__td_text">{data ? "on" : "off"}</span>
            ) : (
                <Checkbox name="item" value={data} {...(onChange && { onChange: (e) => onChange(e) })} />
            )
        )
};

const Cell: FC<ICellProps> = ({ type, rowCellRenderer, data, withEditMode, onChange }) => {
    const cellTypeWithNumber = type === "number" ? "text" : type;
    const CellItem = cellRenderer[cellTypeWithNumber];
    return (
        <>{CellItem({ rowCellRenderer, withEditMode, data, inputType: type === "number" ? type : "text", onChange })}</>
    );
};

export { ICellProps, Cell as default };
