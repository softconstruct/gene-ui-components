import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import RadioGroup, { IRadioGroupProps } from "./index";

const meta: Meta<typeof RadioGroup> = {
    title: "Molecules/RadioGroup",
    component: RadioGroup,
    parameters: {
        docs: {
            description: {
                component:
                    "RadioGroup lets users pick exactly one option. Provide it an array of options with `{ value, label }`. Example:\n\n```tsx\n<RadioGroup\n  label=\"Payment Method\"\n  name=\"payment\"\n  options={[\n    { value: 'card', label: 'Card' },\n    { value: 'cash', label: 'Cash' },\n    { value: 'bank', label: 'Bank Transfer', disabled: true },\n  ]}\n  value={value}\n  onChange={(v) => setValue(v)}\n/>\n```"
            }
        }
    },
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        errorMessage: args({ control: "text", ...propCategory.content }),
        type: args({ control: "select", ...propCategory.appearance }),
        alignment: args({ control: "select", ...propCategory.appearance }),
        options: {
            ...args({ control: "object", ...propCategory.content }),
            description:
                "Array of radio options to display. Each item: `{ value: string; label: string; disabled?: boolean }`.\nExample: `[ { value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2', disabled: true } ]`"
        },
        name: args({ control: "text", ...propCategory.others }),
        value: args({ control: "text", ...propCategory.states }),
        defaultValue: args({ control: "text", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance })
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
    const [value, setValue] = useState<string>("");

    return <RadioGroup {...props} value={value} onChange={(newValue: string) => setValue(newValue)} />;
};

export const Default: Story = {
    render: (props) => <Template {...props} />
};

export const WithTwoOptions: Story = {
    render: (props) => <Template {...props} />,
    args: {
        options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" }
        ]
    }
};

export const WithThreeOptions: Story = {
    render: (props) => <Template {...props} />,
    args: {
        options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" }
        ]
    }
};

export const WithFiveOptions: Story = {
    render: (props) => <Template {...props} />,
    args: {
        options: [
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
            { value: "option4", label: "Option 4" },
            { value: "option5", label: "Option 5" }
        ]
    }
};

export const ErrorState: Story = {
    render: (props) => <Template {...props} />,
    args: {
        type: "error",
        errorMessage: "Error message",
        helperText: undefined
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
        defaultValue: "option2"
    }
};

export const RightAlignment: Story = {
    render: (props) => <Template {...props} />,
    args: {
        alignment: "right"
    }
};

export const Required: Story = {
    render: (props) => <Template {...props} />,
    args: {
        required: true
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
        ]
    }
};

// Comprehensive showcase matching the design specification
export const DesignShowcase: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {/* Left Align - Rest State */}
            <div style={{ minWidth: "200px" }}>
                <h3>Left Align - Rest State</h3>
                <Template
                    label="Group Label"
                    helperText="Helper Text"
                    name="left-rest"
                    options={[
                        { value: "opt1", label: "Label" },
                        { value: "opt2", label: "Label" },
                        { value: "opt3", label: "Label" },
                        { value: "opt4", label: "Label" }
                    ]}
                />
            </div>

            {/* Left Align - Error State */}
            <div style={{ minWidth: "200px" }}>
                <h3>Left Align - Error State</h3>
                <Template
                    label="Group Label"
                    type="error"
                    errorMessage="Error message"
                    name="left-error"
                    options={[
                        { value: "opt1", label: "Label" },
                        { value: "opt2", label: "Label" },
                        { value: "opt3", label: "Label" },
                        { value: "opt4", label: "Label" }
                    ]}
                />
            </div>

            {/* Left Align - Disabled State */}
            <div style={{ minWidth: "200px" }}>
                <h3>Left Align - Disabled State</h3>
                <Template
                    label="Group Label"
                    helperText="Helper Text"
                    disabled
                    name="left-disabled"
                    options={[
                        { value: "opt1", label: "Label" },
                        { value: "opt2", label: "Label" },
                        { value: "opt3", label: "Label" },
                        { value: "opt4", label: "Label" }
                    ]}
                />
            </div>

            {/* Left Align - Read Only State */}
            <div style={{ minWidth: "200px" }}>
                <h3>Left Align - Read Only State</h3>
                <Template
                    label="Group Label"
                    helperText="Helper Text"
                    readOnly
                    defaultValue="opt1"
                    name="left-readonly"
                    options={[
                        { value: "opt1", label: "Label" },
                        { value: "opt2", label: "Label" },
                        { value: "opt3", label: "Label" },
                        { value: "opt4", label: "Label" }
                    ]}
                />
            </div>

            {/* Right Align - Rest State */}
            <div style={{ minWidth: "200px" }}>
                <h3>Right Align - Rest State</h3>
                <Template
                    label="ملصق"
                    helperText="النص المساعد"
                    alignment="right"
                    name="right-rest"
                    options={[
                        { value: "opt1", label: "ملصق" },
                        { value: "opt2", label: "ملصق" },
                        { value: "opt3", label: "ملصق" },
                        { value: "opt4", label: "ملصق" }
                    ]}
                />
            </div>

            {/* Right Align - Error State */}
            <div style={{ minWidth: "200px" }}>
                <h3>Right Align - Error State</h3>
                <Template
                    label="ملصق"
                    type="error"
                    errorMessage="رسالة خطأ"
                    alignment="right"
                    name="right-error"
                    options={[
                        { value: "opt1", label: "ملصق" },
                        { value: "opt2", label: "ملصق" },
                        { value: "opt3", label: "ملصق" },
                        { value: "opt4", label: "ملصق" }
                    ]}
                />
            </div>
        </div>
    )
};
