import React, { ChangeEvent, FC, JSX, useState } from "react";

import { IconProps } from "@geneui/icons";

import Copy from "@components/atoms/Copy";
import Pill, { IPillProps } from "@components/atoms/Pill";
import Text from "@components/atoms/Text";
import Checkbox, { ICheckboxProps } from "@components/molecules/Checkbox";
import TextField, { ITextFieldProps } from "@components/molecules/TextField";
import Tooltip from "@components/molecules/Tooltip";

import { Cell as CellTypes, CellType } from "./type";

interface ICellProps {
    type: CellType;
    withEditMode: boolean;
    data?: CellTypes;
    onChange?: (data: unknown) => void;
    rowCellRenderer?: (
        data?: CellTypes,
        editMode?: boolean,
        onChange?: (value: string | number) => void
    ) => JSX.Element;
    withCopy?: boolean;
    ariaLabel?: string;
}

type CellRenderer = {
    [key: string]: (
        props: Omit<ICellProps, "type"> & {
            inputType?: ITextFieldProps["type"];
        }
    ) => JSX.Element;
};

export const cellRenderer: () => CellRenderer = () => {
    return {
        Empty: ({ rowCellRenderer }) =>
            rowCellRenderer ? rowCellRenderer() : <div className="table__content table__content_empty" />,
        Graph: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            return rowCellRenderer ? (
                rowCellRenderer(data, withEditMode, onChange)
            ) : (
                <img src={data as string} alt="" />
            );
        },
        Text: ({ rowCellRenderer, data, withEditMode, inputType = "text", withCopy, onChange, ariaLabel }) => {
            const value = data as string;
            if (rowCellRenderer) return rowCellRenderer(data, withEditMode, onChange);

            if (withEditMode) {
                return (
                    <TextField
                        type={inputType}
                        placeholder="Row Text"
                        value={value}
                        aria-label={ariaLabel || inputType}
                        {...(onChange && {
                            onChange: (e) => {
                                onChange(e.target.value);
                            }
                        })}
                    />
                );
            }

            return (
                <>
                    <Text as="span" className="table__td_text ellipsis-text" aria-label={ariaLabel}>
                        {value}
                    </Text>
                    {withCopy && (
                        <Copy
                            value={value}
                            size="small"
                            appearance="secondary"
                            className="table__content_copy"
                            aria-label={`Copy ${ariaLabel || "cell value"}`}
                        />
                    )}
                </>
            );
        },
        LongText: ({ rowCellRenderer, data, withEditMode, withCopy, onChange }) => {
            const [value, setValue] = useState<string>(data as string);

            if (rowCellRenderer) return rowCellRenderer(data, withEditMode, onChange);

            const handleChange = (e: ChangeEvent<HTMLTextAreaElement> | undefined) => {
                if (!e) return;
                setValue(e.target.value);
                onChange?.(e);
            };

            if (withEditMode) {
                return (
                    <textarea
                        placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate felis eget nulla consequat, non fermentum velit gravida. Nulla facilisi. Aenean ac "
                        value={value}
                        style={{ width: "280px" }}
                        {...(onChange && { onChange: handleChange })}
                    />
                );
            }

            return (
                <>
                    <Tooltip text={value}>
                        <Text as="span" className="table__td_text">
                            {value}
                        </Text>
                    </Tooltip>
                    {withCopy && (
                        <Copy value={value} size="small" appearance="secondary" className="table__content_copy" />
                    )}
                </>
            );
        },
        Dropdown: ({ rowCellRenderer, data, withEditMode, withCopy, onChange }) => {
            if (rowCellRenderer) return rowCellRenderer(data, withEditMode, onChange);

            const value = data as string;
            return (
                <>
                    <Text as="span" className="table__td_text ellipsis-text">
                        {value}
                    </Text>
                    {withCopy && (
                        <Copy value={value} size="small" appearance="secondary" className="table__content_copy" />
                    )}
                </>
            );
        },
        Status: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            /* todo: change "Pill" components "color" as a status to next values: "informative", "neutral", "error", "success", "warning" */
            const props = data as IPillProps;

            return rowCellRenderer ? (
                rowCellRenderer(data, withEditMode, onChange)
            ) : (
                <Pill {...props} text={props.text} appearance={props.appearance} />
            );
        },
        Pill: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            const props = data as IPillProps;

            return rowCellRenderer ? (
                rowCellRenderer(data, withEditMode, onChange)
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
        Icon: ({ rowCellRenderer, data: icon, withEditMode, onChange }) => {
            /* todo: import icon as a component for "Icon" and "Flag" case */
            const Icon = icon as FC<IconProps>;
            return rowCellRenderer ? rowCellRenderer(icon, withEditMode, onChange) : <Icon size={24} />;
        },
        Flag: ({ rowCellRenderer, data: icon, withEditMode, onChange }) => {
            /* todo: import icon as a component for "Icon" and "Flag" case */
            const Icon = icon as FC<IconProps>;
            return rowCellRenderer ? rowCellRenderer(icon, withEditMode, onChange) : <Icon size={24} />;
        },
        Checkbox: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            if (rowCellRenderer) return rowCellRenderer(data, withEditMode, onChange);

            const props = data as ICheckboxProps;
            let checked = !!props.value;
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                checked = !checked;
                onChange?.({
                    value: props.value,
                    checked: e.target.checked
                });
            };

            if (withEditMode)
                return (
                    <Checkbox
                        {...props}
                        value={props.value}
                        checked={checked}
                        {...(onChange && {
                            onChange: handleChange
                        })}
                    />
                );

            return <Checkbox name="item" value={props.value} checked={checked} readOnly />;
        },
        Switch: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            if (rowCellRenderer) return rowCellRenderer(data, withEditMode, onChange);
            const value = data ? "On" : "Off";
            return (
                <Text as="span" className="table__td_text">
                    {value}
                </Text>
            );
        }
    };
};

const Cell: FC<ICellProps> = ({ type, rowCellRenderer, data, withEditMode, withCopy, onChange, ariaLabel }) => {
    const cellTypeWithNumber = type === "Number" ? "Text" : type;
    const CellItem = cellRenderer()[cellTypeWithNumber];
    return (
        <>
            {CellItem({
                rowCellRenderer,
                withEditMode,
                data,
                inputType: type === "Number" ? "number" : "text",
                withCopy,
                onChange,
                ariaLabel
            })}
        </>
    );
};

export { ICellProps, Cell as default };
