import React, { FC, JSX } from "react";

import { ChevronRight, IconProps } from "@geneui/icons";

import Button from "@components/atoms/Button";
// Components
import Pill from "@components/atoms/Pill";
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import { ITextFieldProps } from "@components/molecules/TextField";
import Tooltip from "@components/molecules/Tooltip";

import { CellType } from "./types";

interface ICellProps {
    type: CellType;
    data?: any;
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
    Graph: ({ data }) => <img src={data} alt="" />,
    Text: ({ data }) => {
        return (
            <Text as="span" className="table__td_text ellipsis-text">
                {data}
            </Text>
        );
    },
    LongText: ({ data }) => (
        <Tooltip text={data}>
            <Text as="span" className="table__td_text">
                {data}
            </Text>
        </Tooltip>
    ),
    Dropdown: ({ data }) => (
        <Text as="span" className="table__td_text ellipsis-text">
            {data}
        </Text>
    ),
    Status: (props) => <Pill {...props} text={props?.data} />,
    Pill: (props) => <Pill {...props} text={props?.data} />,
    Icon: ({ data }) => {
        const Icon = data as FC<IconProps>;
        return <Icon size={24} />;
    },
    Flag: ({ data }) => {
        const Icon = data as FC<IconProps>;
        return <Icon size={24} />;
    },
    Checkbox: ({ data }) => <Checkbox name="item" value={data} readOnly />,
    Switch: ({ data }) => (
        <Text as="span" className="table__td_text">
            {data}
        </Text>
    )
};

const Cell: FC<ICellProps> = ({ type, data }) => {
    const cellTypeWithNumber = type === "Number" ? "Text" : type;

    const CellItem = CellMap[cellTypeWithNumber as CellTypesUnion];

    if (!CellItem) return null;

    return <CellItem data={data} />;
};

export { ICellProps, Cell as default };
