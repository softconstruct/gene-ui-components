import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TimePicker, { ITimePickerProps } from "./index";

const meta: Meta<ITimePickerProps> = {
    title: "Molecules/TimePicker",
    component: TimePicker,
    subcomponents: {
        "Time range picker": TimePicker.Range
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.functionality }),
        placeholder: args({ control: "text", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.functionality }),
        key: args({ control: "false", ...propCategory.functionality }),
        ref: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        label: "Choose time",
        placeholder: "Select time"
    }
};

export default meta;

type Story = StoryObj<ITimePickerProps>;

export const Default: Story = {};

export const RangePicker: Story = {
    render: (props) => <TimePicker.Range {...props} />,
    args: {
        placeholder: {
            start: "Start time",
            end: "End time"
        }
    }
};
