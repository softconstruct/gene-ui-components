import React, { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import CounterField, { ICounterFieldProps } from "@components/molecules/CounterField/CounterField";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<ICounterFieldProps> = {
    title: "Molecules/CounterField",
    component: CounterField,
    argTypes: {
        value: args({ control: "number", ...propCategory.states }),
        defaultValue: args({ control: "number", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        ariaLabelIncrement: args({ control: "text", ...propCategory.others }),
        ariaLabelDecrement: args({ control: "text", ...propCategory.others }),
        step: args({ control: "number", defaultValue: 1, ...propCategory.validation }),
        size: args({ control: "select", ...propCategory.appearance }),
        status: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        onInputBlur: args({ control: "false", ...propCategory.action }),
        onInputFocus: args({ control: "false", ...propCategory.action })
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

type Story = StoryObj<ICounterFieldProps>;

const Template: FC<ICounterFieldProps> = ({ ...props }) => <CounterField {...props} />;

export const Default: Story = {
    render: ({ ...props }) => <Template {...props} />,
    argTypes: { value: args({ control: "false", ...propCategory.states }) }
};

const ControlledTemplate: FC<ICounterFieldProps> = ({ value, onChange, ...props }) => {
    const [internalValue, setInternalValue] = useState(value ?? 0);

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const handleChange = (newValue: number, event: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => {
        setInternalValue(newValue);
        onChange?.(newValue, event);
    };

    return <CounterField {...props} value={internalValue} onChange={handleChange} />;
};

export const Controlled: Story = {
    render: (props) => <ControlledTemplate {...props} />,
    args: {
        helperText: "Controlled Counter"
    },
    argTypes: { defaultValue: args({ control: "false", ...propCategory.states }) }
};
