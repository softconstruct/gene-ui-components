import React, { ChangeEvent, FC, JSX, useState } from "react";

import { IconProps } from "@geneui/icons";

import Copy from "@components/atoms/Copy";
import Pill, { IPillProps } from "@components/atoms/Pill";
import Text from "@components/atoms/Text";
import Checkbox, { ICheckboxProps } from "@components/molecules/Checkbox";
import Switch, { ISwitchProps } from "@components/molecules/Switch";
import TextField from "@components/molecules/TextField";
import Tooltip from "@components/molecules/Tooltip";

import { Cell as CellTypes, CellType } from "./type";

interface ICellProps {
    type: CellType;
    withEditMode: boolean;
    data?: string | number | boolean | IPillProps | ICheckboxProps | ISwitchProps | FC<IconProps>;
    onChange?: (data: unknown) => void;
    rowCellRenderer?: (data?: CellTypes) => JSX.Element;
    withCopy?: boolean;
    ariaLabel?: string;
}

type CellRenderer = {
    [key: string]: (
        props: Omit<ICellProps, "type"> & {
            inputType?: "Text" | "Number";
        }
    ) => JSX.Element;
};

export const cellRenderer: () => CellRenderer = () => {
    return {
        Empty: ({ rowCellRenderer }) =>
            rowCellRenderer ? rowCellRenderer() : <div className="table__content table__content_empty" />,
        Graph: ({ rowCellRenderer, data }) => {
            return rowCellRenderer ? rowCellRenderer(data) : <img src={data as string} alt="" />;
        },
        Text: ({ rowCellRenderer, data, withEditMode, inputType = "text", withCopy, onChange, ariaLabel }) => {
            const value = data as string;
            if (withEditMode) {
                return (
                    <TextField
                        numericOnly={inputType === "Number"}
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

            if (rowCellRenderer) return rowCellRenderer(data);

            return (
                <>
                    <span className="table__td_text ellipsis-text" aria-label={ariaLabel}>
                        {value}
                    </span>
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

            if (rowCellRenderer) return rowCellRenderer(data);

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
            const { value, options } = data as any;
            const [dropDownValue, setDropDownValue] = useState<string>(value);

            const onDropDownChange = (e: ChangeEvent<HTMLSelectElement>) => {
                setDropDownValue(e.target.value);
                onChange?.({
                    value: e.target.value,
                    options
                });
            };

            if (withEditMode) {
                return (
                    <select
                        name="dropdown"
                        id="dropdown"
                        style={{ width: "160px" }}
                        value={dropDownValue}
                        {...(onChange && { onChange: onDropDownChange })}
                    >
                        {options.map((option: string) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            }

            if (rowCellRenderer) return rowCellRenderer(data);

            return (
                <>
                    <span className="table__td_text ellipsis-text">{dropDownValue}</span>
                    {withCopy && (
                        <Copy
                            value={dropDownValue}
                            size="small"
                            appearance="secondary"
                            className="table__content_copy"
                        />
                    )}
                </>
            );
        },
        Status: ({ rowCellRenderer, data }) => {
            /* todo: change "Pill" components "color" as a status to next values: "informative", "neutral", "error", "success", "warning" */
            const props = data as IPillProps;

            return rowCellRenderer ? (
                rowCellRenderer(data)
            ) : (
                <Pill {...props} text={props.text} appearance={props.appearance} />
            );
        },
        Pill: ({ rowCellRenderer, data }) => {
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
        Icon: ({ rowCellRenderer, data: icon }) => {
            /* todo: import icon as a component for "Icon" and "Flag" case */
            const Icon = icon as FC<IconProps>;
            return rowCellRenderer ? rowCellRenderer(icon) : <Icon size={24} />;
        },
        Flag: ({ rowCellRenderer, data: icon }) => {
            /* todo: import icon as a component for "Icon" and "Flag" case */
            const Icon = icon as FC<IconProps>;
            return rowCellRenderer ? rowCellRenderer(icon) : <Icon size={24} />;
        },
        Checkbox: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            const props = data as ICheckboxProps;
            const [checked, setChecked] = useState<boolean>(!!props.checked);
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                setChecked((prev) => !prev);
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

            if (rowCellRenderer) return rowCellRenderer(data);

            return <Checkbox name="item" value={props.value} checked={checked} readOnly />;
        },
        Switch: ({ rowCellRenderer, data, withEditMode, onChange }) => {
            const props = data as ISwitchProps;
            const [checked, setChecked] = useState<boolean>(!!props.checked);

            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                setChecked((prev) => !prev);
                onChange?.({
                    value: props.value,
                    checked: e.target.checked
                });
            };

            if (withEditMode)
                return (
                    <Switch
                        {...props}
                        value={props.value}
                        checked={checked}
                        {...(onChange && { onChange: handleChange })}
                    />
                );

            if (rowCellRenderer) return rowCellRenderer();

            return <span className="table__td_text">{checked ? "on" : "off"}</span>;
        }
    };
};

const Cell: FC<ICellProps> = ({ type, rowCellRenderer, data, withEditMode, withCopy, onChange, ariaLabel }) => {
    if (!data && !withEditMode) return null;

    const cellTypeWithNumber = type === "Number" ? "Text" : type;
    const CellItem = cellRenderer()[cellTypeWithNumber];
    return (
        <>
            {CellItem({
                rowCellRenderer,
                withEditMode,
                data,
                inputType: type === "Number" ? type : "Text",
                withCopy,
                onChange,
                ariaLabel
            })}
        </>
    );
};

export { ICellProps, Cell as default };
