import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { fn } from "@storybook/test";

// Components
import Button from "@components/atoms/Button";
import Dropdown from "@components/molecules/Dropdown";
import TextField from "@components/molecules/TextField";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Filter, { IFilterProps } from "./index";

const meta: Meta<IFilterProps> = {
    title: "Organisms/Filter",
    component: Filter,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        open: args({ control: "false", ...propCategory.states }),
        title: args({ control: "text", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content }),
        applyText: args({ control: "text", ...propCategory.content }),
        resetText: args({ control: "text", ...propCategory.content }),
        applyDisabled: args({ control: "boolean", ...propCategory.states }),
        resetDisabled: args({ control: "boolean", ...propCategory.states }),
        saveConfig: args({ control: "object", ...propCategory.functionality }),
        onApply: args({ control: "false", ...propCategory.action }),
        onReset: args({ control: "false", ...propCategory.action }),
        onClose: args({ control: "false", ...propCategory.action })
    },
    args: {
        title: "Filters",
        applyText: "Apply",
        resetText: "Reset",
        saveConfig: {
            buttonText: "Save",
            popoverSaveText: "Save",
            popoverCancelText: "Cancel",
            popoverLabelText: "Filter Name",
            enabled: true,
            buttonDisabled: false,
            buttonLoading: false,
            onSave: fn()
        },
        onApply: fn(),
        onReset: fn(),
        onClose: fn()
    }
};

export default meta;

type Story = StoryObj<IFilterProps>;

const emptyValues: { name: string; email: string; status: string | null } = { name: "", email: "", status: null };

const statusOptions = [
    { id: 1, label: "Active", value: "active" },
    { id: 2, label: "Pending", value: "pending" },
    { id: 3, label: "Blocked", value: "blocked" }
];

const FilterTemplate: FC<IFilterProps> = ({ onApply, onReset, onClose, ...props }) => {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState(emptyValues);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open Filter</Button>
            <Filter
                {...props}
                open={open}
                onApply={() => {
                    onApply?.();
                    setOpen(false);
                }}
                onReset={() => {
                    onReset?.();
                    setValues(emptyValues);
                }}
                onClose={() => {
                    onClose?.();
                    setOpen(false);
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <TextField
                        label="Name"
                        placeholder="Search by name"
                        value={values.name}
                        onChange={(event) => setValues({ ...values, name: event.target.value })}
                    />
                    <TextField
                        label="Email"
                        placeholder="Search by email"
                        value={values.email}
                        onChange={(event) => setValues({ ...values, email: event.target.value })}
                    />
                    <Dropdown
                        label="Status"
                        placeholder="Select status"
                        options={statusOptions}
                        value={values.status}
                        onChange={(option) =>
                            setValues({ ...values, status: option && !Array.isArray(option) ? option.value : null })
                        }
                    />
                </div>
            </Filter>
        </>
    );
};

export const Default: Story = {
    render: (props) => <FilterTemplate {...props} />
};
