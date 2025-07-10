import React, { FC, useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Info } from "@geneui/icons";

import { ITextFieldRef } from "@components/molecules/TextField/TextField";

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
        characterLimit: args({ control: "object", ...propCategory.content }),
        placeholder: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.content }),
        inputId: args({ control: "text", ...propCategory.others }),
        name: args({ control: "text", ...propCategory.others })
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

const StoryComponentWithRef: FC<ITextFieldProps> = (props) => {
    const inputRef = useRef<ITextFieldRef | null>(null);
    const { value: defaultValue } = props;
    const [value, setValue] = useState(defaultValue || "");

    return (
        <div style={{ width: 300 }}>
            <TextField {...props} value={value} onChange={(e) => setValue(e.target.value)} ref={inputRef} />
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponentWithRef {...props} />
};

export const Warning: Story = {
    args: {
        validationStatus: {
            type: "warning",
            text: "Some warning text"
        }
    },
    render: (props) => <StoryComponentWithRef {...props} />
};

export const Error: Story = {
    args: {
        validationStatus: {
            type: "error",
            text: "Some error text"
        }
    },
    render: (props) => <StoryComponentWithRef {...props} />
};

export const WithIcon: Story = {
    args: {
        IconBefore: Info
    },
    render: (props) => <StoryComponentWithRef {...props} />
};

export const WithPassword: Story = {
    args: {
        type: "password"
    },
    render: (props) => <StoryComponentWithRef {...props} />
};

export const WithCharacterLimit: Story = {
    args: {
        characterLimit: {
            length: 100,
            text: "Some validation text"
        }
    },
    render: (props) => <StoryComponentWithRef {...props} />
};

export const WithoutLabel: Story = {
    args: {
        label: ""
    },
    render: (props) => <StoryComponentWithRef {...props} />
};
