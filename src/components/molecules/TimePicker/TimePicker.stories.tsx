import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { TimeParts } from "@components/molecules/TimePicker/types";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TimePicker, { IRangeTimePickerProps, ISingleTimePickerProps, RangeTimePicker } from "./index";

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
        shouldDisableTime: args({ control: "false", ...propCategory.functionality }),
        ariaControls: args({ control: "false", ...propCategory.others }),
        ariaLabel: args({ control: "false", ...propCategory.others })
    },
    args: {
        label: "Choose time",
        placeholder: "Select time"
    }
};

export default meta;

type SingleStory = StoryObj<typeof TimePicker>;
type RangeStory = StoryObj<typeof TimePicker.Range>;

type SinglePickerCase = {
    RenderComponent?: (props: ISingleTimePickerProps) => React.JSX.Element;
} & React.ComponentProps<typeof TimePicker>;

type RangePickerCase = {
    RenderComponent?: (props: IRangeTimePickerProps) => React.JSX.Element;
} & React.ComponentProps<typeof TimePicker.Range>;

const ClearableSinglePicker = (props: ISingleTimePickerProps) => {
    return <TimePicker {...props} placeholder="Choose time" clearable />;
};

const ControlledSinglePicker = (props: ISingleTimePickerProps) => {
    const [value, setValue] = useState<string | null>("10:24:30");
    const handleTimeSelect = (time: string) => {
        setValue(time);
    };
    const handleTimeInputChange = (time: string) => {
        setValue(time);
    };

    return (
        <TimePicker
            {...props}
            value={value}
            onTimeSelect={handleTimeSelect}
            onTimeInputChange={handleTimeInputChange}
            placeholder="Choose time"
        />
    );
};

const singlePickerCases: SinglePickerCase[] = [
    { label: "Disabled", disabled: true },
    { label: "Required", required: true },
    { label: "With controlled value", RenderComponent: ControlledSinglePicker },
    { label: "Clearable", RenderComponent: ClearableSinglePicker },
    { label: "Errored with message", error: true, errorMessage: "Error message" },
    { label: "12-Hour Format", timeFormat: "12h", placeholder: "12:00:00 AM" },
    {
        label: "Disabled Specific Times",
        shouldDisableTime: (type, value) => type === "hours" && parseInt(value, 10) < 12
    }
];

const ControlledRangePicker = (props: IRangeTimePickerProps) => {
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

    return (
        <TimePicker.Range
            {...props}
            value={value}
            onTimeSelect={handleTimeSelect}
            onTimeInputChange={handleTimeInputChange}
        />
    );
};

const ClearableRangePicker = (props: IRangeTimePickerProps) => {
    return <TimePicker.Range {...props} placeholder={{ start: "Start time", end: "End time" }} clearable />;
};

const rangePickerCases: RangePickerCase[] = [
    { label: "Disabled", disabled: true, placeholder: { start: "Start time", end: "End time" } },
    { label: "Required", required: true, placeholder: { start: "Start time", end: "End time" } },
    {
        label: "With controlled value",
        placeholder: { start: "Start time", end: "End time" },
        RenderComponent: ControlledRangePicker
    },
    {
        label: "Clearable",
        placeholder: { start: "Start time", end: "End time" },
        RenderComponent: ClearableRangePicker
    },
    {
        label: "Errored with message",
        error: true,
        errorMessage: "Error message",
        placeholder: { start: "Start time", end: "End time" }
    },
    { label: "12-Hour Format", timeFormat: "12h", placeholder: { start: "Start time", end: "End time" } },
    {
        label: "Disabled Specific Times",
        placeholder: { start: "Start time", end: "End time" },
        shouldDisableTime: (type, value) => type === "hours" && parseInt(value, 10) > 18
    }
];

export const Default: SingleStory = {};

export const SinglePickerStates: SingleStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {singlePickerCases.map((item) =>
                item.RenderComponent ? (
                    <item.RenderComponent {...props} {...item} />
                ) : (
                    <TimePicker {...props} {...item} />
                )
            )}
        </div>
    )
};

export const RangePickerStates: RangeStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {rangePickerCases.map((item) => (
                <div>
                    {item.RenderComponent ? (
                        <item.RenderComponent {...props} {...item} />
                    ) : (
                        <TimePicker.Range {...props} {...item} />
                    )}
                </div>
            ))}
        </div>
    )
};
