import React, { FC } from "react";

import { ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import Tooltip from "@components/molecules/Tooltip";
import CellEdit from "@components/organisms/Table/CellEdit";

import { CellType, ICellProps } from "./types";

type CellTypesUnion = Exclude<CellType, "Group" | "Number">;

const emptyContent = <div className="table__content table__content_empty" />;

const EmptyCell: FC<ICellProps> = () => emptyContent;

const RowCheckboxCell: FC<ICellProps> = () => <Checkbox name="column" value="column" />;

const ExpandCell: FC<ICellProps> = () => (
    <Button appearance="secondary" layout="text" size="small" Icon={ChevronRight} />
);

const RendererOnlyCell: FC<ICellProps> = ({ data, dataKey, renderer, editMode, onChange }) => {
    if (data && dataKey && renderer) return renderer(data, editMode, onChange);
    return emptyContent;
};

const TextCell: FC<ICellProps> = ({ data, renderer, dataKey, value, editMode, inputType, onChange, type }) => {
    if (!data || !dataKey) return emptyContent;
    if (renderer) return renderer(data);
    const displayValue = value !== undefined ? value : data?.original[dataKey];
    if (editMode)
        return (
            <CellEdit
                type={type === "Number" ? "Number" : "Text"}
                dataKey={dataKey}
                value={displayValue}
                rowId={data.original.id}
                inputType={inputType}
                onChange={onChange}
            />
        );

    return (
        <Text as="span" className="table__td_text ellipsis-text">
            {String(displayValue ?? "")}
        </Text>
    );
};

const LongTextCell: FC<ICellProps> = ({ data, renderer, dataKey, editMode, value, onChange }) => {
    if (!data || !dataKey) return emptyContent;
    if (renderer) return renderer(data);
    const displayValue = value !== undefined ? value : data?.original[dataKey];
    if (editMode)
        return (
            <CellEdit
                type="LongText"
                dataKey={dataKey}
                value={displayValue}
                rowId={data.original.id}
                onChange={onChange}
            />
        );

    return (
        <Tooltip text={String(displayValue ?? "")}>
            <Text as="span" className="table__td_text">
                {String(displayValue ?? "")}
            </Text>
        </Tooltip>
    );
};

const DropdownCell: FC<ICellProps> = ({ data, renderer, value, dataKey, editMode, onChange }) => {
    if (!data || !dataKey) return emptyContent;
    if (renderer) return renderer(data);
    const displayValue = value !== undefined ? value : data?.original[dataKey];
    if (editMode)
        return (
            <CellEdit
                type="Dropdown"
                dataKey={dataKey}
                value={displayValue}
                rowId={data.original.id}
                onChange={onChange}
            />
        );

    return (
        <Text as="span" className="table__td_text ellipsis-text">
            {String(displayValue ?? "")}
        </Text>
    );
};

const CheckboxCell: FC<ICellProps> = ({ data, dataKey, renderer, editMode, value, onChange }) => {
    if (!data || !dataKey) return emptyContent;
    if (renderer) return renderer(data);
    const displayValue = value !== undefined ? value : data?.original[dataKey];
    if (editMode)
        return (
            <CellEdit
                type="Checkbox"
                dataKey={dataKey}
                value={displayValue}
                rowId={data.original.id}
                onChange={onChange}
            />
        );

    return (
        <Text as="span" className="table__td_text">
            {String(displayValue ?? "")}
        </Text>
    );
};

const SwitchCell: FC<ICellProps> = ({ data, dataKey, value, renderer, editMode, onChange }) => {
    if (!data || !dataKey) return emptyContent;
    if (renderer) return renderer(data);
    const displayValue = value !== undefined ? value : data?.original[dataKey];
    if (editMode)
        return (
            <CellEdit
                type="Switch"
                dataKey={dataKey}
                value={displayValue}
                rowId={data.original.id}
                onChange={onChange}
            />
        );

    return (
        <Text as="span" className="table__td_text">
            {String(displayValue ?? "")}
        </Text>
    );
};

const CellMap: Record<CellTypesUnion, FC<ICellProps>> = {
    Empty: EmptyCell,
    RowCheckbox: RowCheckboxCell,
    Expand: ExpandCell,
    Graph: RendererOnlyCell,
    Status: RendererOnlyCell,
    Pill: RendererOnlyCell,
    Icon: RendererOnlyCell,
    Flag: RendererOnlyCell,
    Text: TextCell,
    LongText: LongTextCell,
    Dropdown: DropdownCell,
    Checkbox: CheckboxCell,
    Switch: SwitchCell
};

const Cell: FC<ICellProps> = (props) => {
    const { type } = props;
    const cellTypeForMap = type === "Number" ? "Text" : type;
    const CellItem = CellMap[cellTypeForMap as CellTypesUnion];
    if (!CellItem) return null;
    return <CellItem {...props} />;
};

export { Cell as default };
