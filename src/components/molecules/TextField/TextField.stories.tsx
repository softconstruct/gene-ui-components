import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Info } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TextField, { ITextFieldProps } from "./index";

const meta: Meta<ITextFieldProps> = {
    title: "Molecules/TextField",
    component: TextField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.states }),
        clearable: args({ control: "boolean", ...propCategory.states }),
        type: args({ control: "select", ...propCategory.appearance }),
        validationStatus: args({ control: "object", ...propCategory.appearance }),
        IconBefore: args({ control: "false", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        characterLimit: args({ control: "object", ...propCategory.content }),
        placeholder: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.content }),
        id: args({ control: "text", ...propCategory.others }),
        name: args({ control: "text", ...propCategory.others }),
        autoComplete: args({ control: "text", ...propCategory.functionality }),
        autoFocus: args({ control: "boolean", ...propCategory.functionality })
    },
    args: {
        size: "large",
        type: "text",
        placeholder: "placeholder",
        label: "Label"
    }
};

export default meta;

type Story = StoryObj<ITextFieldProps>;

const StoryTemplate: FC<ITextFieldProps> = (props) => {
    return (
        <div style={{ width: 300 }}>
            <TextField {...props} />
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryTemplate {...props} />
};

export const Warning: Story = {
    args: {
        validationStatus: {
            type: "warning",
            text: "Some warning text"
        }
    },
    render: (props) => <StoryTemplate {...props} />
};

export const Error: Story = {
    args: {
        validationStatus: {
            type: "error",
            text: "Some error text"
        }
    },
    render: (props) => <StoryTemplate {...props} />
};

export const WithIcon: Story = {
    args: {
        IconBefore: Info
    },
    render: (props) => <StoryTemplate {...props} />
};

export const WithPassword: Story = {
    args: {
        type: "password"
    },
    render: (props) => <StoryTemplate {...props} />
};

export const WithCharacterLimit: Story = {
    args: {
        characterLimit: {
            length: 100,
            text: "Some validation text"
        }
    },
    render: (props) => <StoryTemplate {...props} />
};

export const WithoutLabel: Story = {
    args: {
        label: ""
    },
    render: (props) => <StoryTemplate {...props} />
};
