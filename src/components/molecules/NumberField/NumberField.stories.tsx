import React, { ChangeEvent, FC, MouseEvent, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import NumberField, { INumberFieldProps } from "./index";

const meta: Meta<INumberFieldProps> = {
    title: "Molecules/NumberField",
    component: NumberField,
    argTypes: {
        value: args({ control: "text", ...propCategory.content }),
        defaultValue: args({ control: "number", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        step: args({ control: "number", ...propCategory.states }),
        min: args({ control: "number", ...propCategory.states }),
        max: args({ control: "number", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        status: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        onInputBlur: args({ control: "false", ...propCategory.action }),
        onInputFocus: args({ control: "false", ...propCategory.action }),
        autoFocus: args({ control: "boolean", ...propCategory.functionality }),
        id: args({ control: "text", ...propCategory.others })
    },
    args: {
        defaultValue: 0,
        step: 1,
        size: "medium",
        status: "rest",
        label: "Label",
        helperText: "Helper text",
        required: true
    }
};

export default meta;

type Story = StoryObj<INumberFieldProps>;

const Template: FC<INumberFieldProps> = ({ ...props }) => <NumberField {...props} />;

export const Default: Story = {
    render: ({ ...props }) => <Template {...props} />,
    argTypes: { value: args({ control: "false", ...propCategory.content }) }
};

const ControlledTemplate: FC<INumberFieldProps> = ({ value, onChange, ...props }) => {
    const isControlled = value !== undefined;
    const displayValue = isControlled ? value : "0";
    const [internalStringValue, setInternalStringValue] = useState(displayValue);

    const handleChange = (
        newValueString: string,
        event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>
    ) => {
        setInternalStringValue(newValueString);
        onChange?.(newValueString, event);
    };

    return <NumberField {...props} value={internalStringValue} onChange={handleChange} />;
};

export const Controlled: Story = {
    render: (props) => <ControlledTemplate {...props} />,
    args: {
        helperText: "Controlled Number Field"
    },
    argTypes: { defaultValue: args({ control: "false", ...propCategory.content }) }
};
