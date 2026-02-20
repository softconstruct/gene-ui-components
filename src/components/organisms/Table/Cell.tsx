import React, { ChangeEvent, FC, JSX } from "react";
import { Row as RowData } from "@tanstack/react-table";

import { ChevronRight } from "@geneui/icons";

import Button from "@components/atoms/Button";
// Components
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import TextField, { ITextFieldProps } from "@components/molecules/TextField";
import Tooltip from "@components/molecules/Tooltip";

import { CellType, Row } from "./types";

interface ICellProps {
    dataKey?: string;
    type: CellType;
    data?: RowData<Row>;
    value?: unknown;
    editMode?: boolean;
    onChange?: (value: string | number) => void;
    renderer?: (data?: RowData<Row>, editMode?: boolean, onChange?: (value: string | number) => void) => JSX.Element;
}

type CellTypesUnion = Exclude<CellType, "Group" | "Number">;

type CellMapType = Record<
    Exclude<CellTypesUnion, "Group" | "Number">,
    (
        props: Omit<ICellProps, "type"> & {
            inputType?: ITextFieldProps["type"];
        }
    ) => JSX.Element
>;

const CellMap: CellMapType = {
    Empty: () => <div className="table__content table__content_empty" />,
    RowCheckbox: () => <Checkbox name="column" value="column" />,
    Expand: () => <Button appearance="secondary" layout="text" size="small" Icon={ChevronRight} />,
    Graph: ({ data, renderer, dataKey }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data);

        return <div className="table__content table__content_empty" />;
    },
    Text: ({ data, renderer, dataKey, value, editMode, inputType, onChange }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;
        if (renderer) return renderer(data);
        const displayValue = value !== undefined ? value : data?.original[dataKey];
        if (editMode) {
            return (
                <TextField
                    type={inputType ?? "text"}
                    value={String(displayValue ?? "")}
                    onChange={(e) => onChange?.(e.target.value)}
                />
            );
        }
        return (
            <Text as="span" className="table__td_text ellipsis-text">
                {String(displayValue ?? "")}
            </Text>
        );
    },
    LongText: ({ data, renderer, dataKey, editMode, value, inputType, onChange }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data);
        const displayValue = value !== undefined ? value : data?.original[dataKey];
        if (editMode) {
            const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
                onChange?.(e.target.value);
            };

            return (
                <TextField
                    type={inputType}
                    placeholder="Row Text"
                    value={String(displayValue ?? "")}
                    {...(onChange && {
                        onChange: handleInputChange
                    })}
                />
            );
        }

        return (
            <Tooltip text={String(displayValue ?? "")}>
                <Text as="span" className="table__td_text">
                    {String(displayValue ?? "")}
                </Text>
            </Tooltip>
        );
    },
    Dropdown: ({ data, renderer, value, dataKey }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;
        if (renderer) return renderer(data);
        const displayValue = value !== undefined ? value : data?.original[dataKey];
        return (
            <Text as="span" className="table__td_text ellipsis-text">
                {String(displayValue ?? "")}
            </Text>
        );
    },
    Status: (props) => {
        const { data, dataKey, renderer, editMode, onChange } = props;
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data, editMode, onChange);

        return <div className="table__content table__content_empty" />;
    },
    Pill: (props) => {
        const { data, dataKey, renderer, editMode, onChange } = props;
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data, editMode, onChange);

        return <div className="table__content table__content_empty" />;
    },
    Icon: ({ data, dataKey, renderer, editMode, onChange }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data, editMode, onChange);
        return <div className="table__content table__content_empty" />;
    },
    Flag: ({ data, dataKey, renderer, editMode, onChange }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data, editMode, onChange);
        return <div className="table__content table__content_empty" />;
    },
    Checkbox: (props) => {
        const { data, dataKey, renderer } = props;
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data);
        return <div className="table__content table__content_empty" />;
        // const value = data.original[dataKey] as string;

        // const handleChange = () => {
        //     onChange?.(value);
        // };
        //
        // if (editMode)
        //     return (
        //         <Checkbox
        //             {...props}
        //             value={value}
        //             checked={Boolean(value)}
        //             {...(onChange && {
        //                 onChange: handleChange
        //             })}
        //         />
        //     );
        //
        // return <Checkbox name="item" value={value} readOnly />;
    },
    Switch: ({ data, dataKey, value, renderer }) => {
        if (!data || !dataKey) return <div className="table__content table__content_empty" />;

        if (renderer) return renderer(data);
        const displayValue = value !== undefined ? value : data?.original[dataKey];
        return (
            <Text as="span" className="table__td_text">
                {String(displayValue ?? "")}
            </Text>
        );
    }
};

const Cell: FC<ICellProps> = ({ type, renderer, data, dataKey, value, onChange, editMode }) => {
    const cellTypeWithNumber = type === "Number" ? "Text" : type;

    const CellItem = CellMap[cellTypeWithNumber as CellTypesUnion];

    if (!CellItem) return null;

    return (
        <CellItem
            data={data}
            renderer={renderer}
            dataKey={dataKey}
            value={value}
            editMode={editMode}
            onChange={onChange}
        />
    );
};

export { ICellProps, Cell as default };
