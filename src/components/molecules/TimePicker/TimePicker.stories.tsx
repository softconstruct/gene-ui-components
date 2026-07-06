import React, { ReactNode, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { TimeParts } from "@components/molecules/TimePicker/types";

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
        timeFormat: args({ control: "select", ...propCategory.functionality }),
        texts: args({ control: "object", ...propCategory.content }),
        shouldDisableTime: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        label: "Choose time",
        placeholder: "Select time"
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
    RenderComponent?: () => React.JSX.Element;
} & React.ComponentProps<typeof TimePicker>;

type RangePickerCase = {
    title: string;
    RenderComponent?: () => React.JSX.Element;
} & React.ComponentProps<typeof TimePicker.Range>;

const ClearableSinglePicker = () => {
    return <TimePicker placeholder="Choose time" clearable />;
};

const ControlledSinglePicker = () => {
    const [value, setValue] = useState<string | null>("10:24:30");
    const handleTimeSelect = (time: string) => {
        setValue(time);
    };
    const handleTimeInputChange = (time: string) => {
        setValue(time);
    };

    return (
        <TimePicker
            value={value}
            onTimeSelect={handleTimeSelect}
            onTimeInputChange={handleTimeInputChange}
            placeholder="Choose time"
        />
    );
};

const singlePickerCases: SinglePickerCase[] = [
    { title: "Disabled", disabled: true },
    { title: "Required", label: "Choose time", required: true },
    { title: "With controlled value", RenderComponent: ControlledSinglePicker },
    { title: "Clearable", RenderComponent: ClearableSinglePicker },
    { title: "Errored with message", error: true, errorMessage: "Error message" },
    { title: "12-Hour Format", timeFormat: "12h", placeholder: "12:00:00 AM" },
    {
        title: "Disabled Specific Times",
        shouldDisableTime: (type, value) => type === "hours" && parseInt(value, 10) < 12
    }
];

const ControlledRangePicker = () => {
    const [value, setValue] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });

    const handleTimeSelect = (time: string, parts: TimeParts, field?: "start" | "end") => {
        if (field) {
            setValue((prev) => ({ ...prev, [field]: time }));
        }
    };

    const handleTimeInputChange = (time: string, parts: TimeParts | null, field?: "start" | "end") => {
        if (field) {
            setValue((prev) => ({ ...prev, [field]: time }));
        }
    };

    return <TimePicker.Range value={value} onTimeSelect={handleTimeSelect} onTimeInputChange={handleTimeInputChange} />;
};

const ClearableRangePicker = () => {
    return <TimePicker.Range placeholder={{ start: "Start time", end: "End time" }} clearable />;
};

const rangePickerCases: RangePickerCase[] = [
    { title: "Disabled", disabled: true },
    { title: "Required", label: "Choose time", required: true },
    { title: "With controlled value", RenderComponent: ControlledRangePicker },
    { title: "Clearable", RenderComponent: ClearableRangePicker },
    { title: "Errored with message", error: true, errorMessage: "Error message" },
    { title: "12-Hour Format", timeFormat: "12h" },
    {
        title: "Disabled Specific Times",
        shouldDisableTime: (type, value) => type === "hours" && parseInt(value, 10) > 18
    }
];

export const Default: SingleStory = {};

export const SinglePickerStates: SingleStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {singlePickerCases.map((item) => (
                <StoryWrapper key={item.title} title={item.title}>
                    {item.RenderComponent ? <item.RenderComponent /> : <TimePicker {...props} {...item} />}
                </StoryWrapper>
            ))}
        </div>
    )
};

export const RangePickerStates: RangeStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {rangePickerCases.map((item) => (
                <StoryWrapper key={item.title} title={item.title}>
                    {item.RenderComponent ? <item.RenderComponent /> : <TimePicker.Range {...props} {...item} />}
                </StoryWrapper>
            ))}
        </div>
    )
};
