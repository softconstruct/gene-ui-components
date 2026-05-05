import React, { ReactNode } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Section from "../Section";
// Components
import TimePicker, { RangeTimePicker } from "./index";

const meta: Meta<typeof TimePicker> = {
    title: "Molecules/TimePicker",
    component: TimePicker,
    subcomponents: {
        "Time range picker": RangeTimePicker
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.functionality }),
        placeholder: args({ control: "text", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.functionality }),
        key: args({ control: "false", ...propCategory.functionality }),
        ref: args({ control: "false", ...propCategory.functionality }),
        clearable: args({ control: "boolean", ...propCategory.functionality }),
        onClear: args({ control: "false", ...propCategory.action }),
        error: args({ control: "boolean", ...propCategory.states }),
        errorMessage: args({ control: "text", ...propCategory.content }),
        onPopoverToggle: args({ control: "false", ...propCategory.action }),
        onTimeSelect: args({ control: "false", ...propCategory.action }),
        onTimeInputChange: args({ control: "false", ...propCategory.action }),
        is12Hour: args({ control: "boolean", ...propCategory.functionality }),
        texts: args({ control: "object", ...propCategory.content })
    },
    args: {
        label: "Choose time",
        placeholder: "Select time",
        onPopoverToggle: fn()
    }
};

export default meta;

type SingleStory = StoryObj<typeof TimePicker>;
type RangeStory = StoryObj<typeof TimePicker.Range>;

const StoryWrapper = ({ children, title }: { children: ReactNode; title: string }) => (
    <Section title={title}>{children}</Section>
);

type SinglePickerCase = {
    title: string;
} & React.ComponentProps<typeof TimePicker>;

type RangePickerCase = {
    title: string;
} & React.ComponentProps<typeof TimePicker.Range>;

const singlePickerCases: SinglePickerCase[] = [
    { title: "Disabled", disabled: true },
    { title: "Read only", readOnly: true },
    { title: "Required", label: "Choose time", required: true },
    { title: "With placeholder", placeholder: "Select time" },
    { title: "With label", label: "Choose time" },
    { title: "With controlled value", value: "10:24:30" },
    { title: "Clearable", clearable: true },
    { title: "Errored", error: true },
    { title: "Errored with message", error: true, errorMessage: "Error message" }
];

const rangePickerCases: RangePickerCase[] = [
    { title: "Disabled", disabled: true },
    { title: "Read only", readOnly: true },
    { title: "Required", label: "Choose time", required: true },
    { title: "With placeholder", placeholder: { start: "Start time", end: "End time" } },
    { title: "With label", label: "Choose time" },
    { title: "With controlled value", value: { start: "10:24:30", end: "11:30:24" } },
    { title: "Clearable", clearable: true },
    { title: "Errored", error: true },
    { title: "Errored with message", error: true, errorMessage: "Error message" }
];

export const Default: SingleStory = {};

export const RangePicker: RangeStory = {
    render: (props) => <TimePicker.Range {...props} />,
    args: {
        placeholder: {
            start: "Start time",
            end: "End time"
        }
    }
};

export const SinglePickerStates: SingleStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {singlePickerCases.map((item) => (
                <StoryWrapper title={item.title}>
                    <TimePicker {...props} {...item} />
                </StoryWrapper>
            ))}
        </div>
    )
};

export const RangePickerStates: RangeStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {rangePickerCases.map((item) => (
                <StoryWrapper title={item.title}>
                    <TimePicker.Range {...props} {...item} />
                </StoryWrapper>
            ))}
        </div>
    )
};
