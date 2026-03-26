import React, { ChangeEvent, FC, useState } from "react";

// Components
import Checkbox from "@components/molecules/Checkbox";
import Switch from "@components/molecules/Switch";
import TextField, { ITextFieldProps } from "@components/molecules/TextField";
import { EditableCellType, ICellProps } from "@components/organisms/Table/types";

const emptyContent = <div className="table__content table__content_empty" />;

const TextEdit: FC<ICellProps & { inputType?: ITextFieldProps["type"] }> = ({ value, inputType, onChange }) => {
    const [initialValue, setInitialValue] = useState(() => String(value ?? ""));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setInitialValue(next);
        onChange?.(inputType === "number" ? Number(next) : next);
    };

    return <TextField type={inputType ?? "text"} value={initialValue} onChange={handleChange} />;
};

const LongTextEdit: FC<ICellProps> = ({ value, onChange }) => {
    const [initialValue, setInitialValue] = useState(() => String(value ?? ""));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setInitialValue(next);
        onChange?.(next);
    };

    return <TextField placeholder="Row Text" value={initialValue} onChange={handleChange} />;
};

const CheckboxEdit: FC<ICellProps> = ({ value, onChange }) => {
    const [checked, setChecked] = useState(() => Boolean(value));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        setChecked(next);
        onChange?.(next);
    };

    return <Checkbox checked={checked} onChange={handleChange} />;
};

const SwitchEdit: FC<ICellProps> = ({ value, onChange }) => {
    const [checked, setChecked] = useState(() => Boolean(value));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        setChecked(next);
        onChange?.(next);
    };

    return <Switch checked={checked} onChange={handleChange} />;
};

const DropdownEdit: FC<ICellProps> = ({ value, onChange, options = [] }) => {
    const [initialValue, setInitialValue] = useState(() => String(value ?? ""));

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value;
        setInitialValue(next);
        onChange?.(next);
    };

    if (options.length === 0) {
        return (
            <TextField
                value={initialValue}
                onChange={(e) => {
                    const next = e.target.value;
                    setInitialValue(next);
                    onChange?.(next);
                }}
            />
        );
    }

    return (
        <select
            className="table__content table__content_dropdown"
            value={initialValue}
            onChange={handleChange}
            aria-label="Select option"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
};

const EditCellMap: Record<EditableCellType, FC<ICellProps>> = {
    Text: ({ inputType, ...props }) => <TextEdit {...props} inputType={inputType} />,
    Number: (props) => <TextEdit {...props} inputType="number" />,
    LongText: LongTextEdit,
    Checkbox: CheckboxEdit,
    Switch: SwitchEdit,
    Dropdown: ({ options, ...props }) => <DropdownEdit {...props} options={options} />
};

const CellEdit: FC<ICellProps> = (props) => {
    const { type } = props;
    const EditComponent = EditCellMap[type as EditableCellType];
    if (!EditComponent) return emptyContent;
    return <EditComponent {...props} />;
};

export { CellEdit as default };
