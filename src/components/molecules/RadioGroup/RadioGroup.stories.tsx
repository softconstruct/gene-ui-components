import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import RadioGroup, { IRadioGroupProps } from "./index";

const meta: Meta<typeof RadioGroup> = {
    title: "Molecules/RadioGroup",
    component: RadioGroup,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        status: args({ control: "select", ...propCategory.appearance }),
        options: args({ control: "object", ...propCategory.content }),
        name: args({ control: "text", ...propCategory.others }),
        value: args({ control: "text", ...propCategory.states }),
        defaultValue: args({ control: "text", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance }),
        infoText: args({ control: "text", ...propCategory.content })
    },
    args: {
        label: "Group Label",
        helperText: "Helper Text",
        name: "radioGroup",
        options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
            { value: "option4", label: "Option 4" }
        ]
    }
};

export default meta;

type Story = StoryObj<IRadioGroupProps>;

const Template: FC<IRadioGroupProps> = (props) => {
    return <RadioGroup {...props} />;
};

export const Default: Story = {
    render: (props) => <Template {...props} />
};

export const ErrorState: Story = {
    render: (props) => <Template {...props} />,
    args: {
        status: "error",
        defaultValue: "option3",
        helperText: "Error message",
        required: true
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
        defaultValue: "option2",
        infoText: "This is a read-only radio group"
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
        status: "warning"
    }
};
