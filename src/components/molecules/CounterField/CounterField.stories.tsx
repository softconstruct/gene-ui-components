import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import CounterField, { ICounterFieldProps } from "./index";

const meta: Meta<ICounterFieldProps> = {
    title: "Molecules/CounterField",
    component: CounterField,
    argTypes: {
        value: args({ control: "number", ...propCategory.states }),
        defaultValue: args({ control: "number", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        ariaLabelIncrement: args({ control: "text", ...propCategory.others }),
        ariaLabelDecrement: args({ control: "text", ...propCategory.others }),
        max: args({ control: "number", ...propCategory.validation }),
        min: args({ control: "number", ...propCategory.validation }),
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
        min: 0,
        step: 1,
        size: "medium",
        status: "rest",
        label: "Quantity",
        helperText: "Helper text",
        required: false
    }
};

export default meta;

type Story = StoryObj<ICounterFieldProps>;

const Template: FC<ICounterFieldProps> = ({ ...props }) => (
    <div style={{ maxWidth: 400 }}>
        <CounterField {...props} />
    </div>
);

export const Default: Story = {
    render: ({ ...props }) => <Template {...props} />,
    argTypes: { value: args({ control: "false", ...propCategory.states }) }
};

const ControlledTemplate: FC<ICounterFieldProps> = ({ value, onChange, ...props }) => {
    const [internalValue, setInternalValue] = React.useState<number>(value ?? 0);

    React.useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const handleChange = (
        newValue: number,
        event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
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
