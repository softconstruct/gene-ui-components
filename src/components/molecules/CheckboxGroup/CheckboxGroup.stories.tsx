import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import CheckboxGroup, { ICheckboxGroupProps } from "./index";

const meta: Meta<typeof CheckboxGroup> = {
    title: "Molecules/CheckboxGroup",
    component: CheckboxGroup,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.appearance }),
        options: args({ control: "object", ...propCategory.content }),
        name: args({ control: "text", ...propCategory.others }),
        value: args({ control: "array", ...propCategory.states }),
        defaultValue: args({ control: "array", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance }),
        infoText: args({ control: "text", ...propCategory.content })
    },
    args: {
        label: "Group Label",
        helperText: "Helper Text",
        name: "checkboxGroup",
        options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
            { value: "option4", label: "Option 4" }
        ]
    }
};

export default meta;

type Story = StoryObj<ICheckboxGroupProps>;

const Template: FC<ICheckboxGroupProps> = (props) => {
    return <CheckboxGroup {...props} />;
};

export const Default: Story = {
    render: (props) => <Template {...props} />
};

export const WithDefaultValue: Story = {
    render: (props) => <Template {...props} />,
    args: {
        defaultValue: ["option2", "option4"],
        helperText: "Options 2 and 4 are pre-selected"
    }
};

export const ErrorState: Story = {
    render: (props) => <Template {...props} />,
    args: {
        status: "error",
        defaultValue: ["option3"],
        helperText: "Error message",
        required: true
    }
};

export const WarningState: Story = {
    render: (props) => <Template {...props} />,
    args: {
        status: "warning",
        defaultValue: ["option1", "option2"],
        helperText: "Warning message"
    }
};

export const DisabledState: Story = {
    render: (props) => <Template {...props} />,
    args: {
        disabled: true
    }
};

export const ReadOnlyState: Story = {
    render: (props) => <Template {...props} />,
    args: {
        readOnly: true,
        defaultValue: ["option2", "option4"],
        infoText: "This is a read-only checkbox group"
    }
};

export const WithIndividualDisabledOptions: Story = {
    render: (props) => <Template {...props} />,
    args: {
        options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2", disabled: true },
            { value: "option3", label: "Option 3" },
            { value: "option4", label: "Option 4", disabled: true }
        ],
        status: "warning",
        defaultValue: ["option1"]
    }
};

export const MultipleSelected: Story = {
    render: (props) => <Template {...props} />,
    args: {
        defaultValue: ["option1", "option3", "option4"],
        helperText: "Multiple options can be selected"
    }
};

export const WithoutLabel: Story = {
    render: (props) => <Template {...props} />,
    args: {
        label: undefined,
        helperText: "Checkbox group without a label"
    }
};

export const DefaultValueTest: Story = {
    render: (props) => <Template {...props} />,
    args: {
        defaultValue: ["option2", "option4"],
        helperText: "This demonstrates defaultValue - options 2 and 4 are pre-selected (uncontrolled)"
    }
};
