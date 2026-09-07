import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Constants
import { DEFAULT_LOCALIZATION } from "./constants";
// Components
import TimePicker, { IRangeTimePickerProps, ISingleTimePickerProps, RangeTimePicker } from "./index";
// Types
import { TimePickerRangeChangeContext } from "./types";

const meta: Meta<typeof TimePicker> = {
    title: "Molecules/TimePicker",
    component: TimePicker,
    subcomponents: {
        RangeTimePicker
    },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", options: ["small", "medium", "large"], ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.functionality }),
        placeholder: args({ control: "text", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.functionality }),
        defaultValue: args({ control: "text", ...propCategory.functionality }),
        id: args({ control: "false", ...propCategory.others }),
        name: args({ control: "text", ...propCategory.others }),
        key: args({ control: "false", ...propCategory.functionality }),
        ref: args({ control: "false", ...propCategory.functionality }),
        clearable: args({ control: "boolean", ...propCategory.functionality }),
        onClear: args({ control: "false", ...propCategory.action }),
        status: args({ control: "select", options: ["rest", "warning", "error"], ...propCategory.validation }),
        helperText: args({ control: "text", ...propCategory.validation }),
        onOpenChange: args({ control: "false", ...propCategory.action }),
        onChange: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onKeyDown: args({ control: "false", ...propCategory.action }),
        format: args({ control: "select", options: ["24h", "12h"], ...propCategory.functionality }),
        localization: args({ control: "object", ...propCategory.content })
    },
    args: {
        label: "Choose time",
        placeholder: "Select time",
        defaultValue: "",
        size: "medium",
        format: "24h",
        status: "rest",
        clearable: false,
        disabled: false,
        readOnly: false,
        required: false,
        localization: DEFAULT_LOCALIZATION
    }
};

export default meta;

type SingleStory = StoryObj<typeof TimePicker>;
type RangeStory = StoryObj<typeof TimePicker.Range>;

type SinglePickerCase = {
    key: string;
    RenderComponent?: (props: ISingleTimePickerProps) => React.JSX.Element;
} & ISingleTimePickerProps;

type RangePickerCase = {
    key: string;
    RenderComponent?: (props: IRangeTimePickerProps) => React.JSX.Element;
} & IRangeTimePickerProps;

const rangePlaceholder = { start: "Start time", end: "End time" };

const ClearableSinglePicker = (props: ISingleTimePickerProps) => (
    <TimePicker {...props} placeholder="Choose time" clearable />
);

const ControlledSinglePicker = (props: ISingleTimePickerProps) => {
    const [value, setValue] = useState<string | null>("10:24:30");

    return <TimePicker {...props} value={value} onChange={setValue} placeholder="Choose time" />;
};

const UncontrolledSinglePicker = (props: ISingleTimePickerProps) => (
    <TimePicker {...props} defaultValue="08:15:00" placeholder="Choose time" />
);

const singlePickerCases: SinglePickerCase[] = [
    { key: "disabled", label: "Disabled", disabled: true },
    { key: "readOnly", label: "Read only", readOnly: true, defaultValue: "12:30:00" },
    { key: "required", label: "Required", required: true },
    { key: "controlled", label: "With controlled value", RenderComponent: ControlledSinglePicker },
    { key: "uncontrolled", label: "With default value", RenderComponent: UncontrolledSinglePicker },
    { key: "clearable", label: "Clearable", RenderComponent: ClearableSinglePicker },
    { key: "error", label: "Errored with message", status: "error", helperText: "Error message" },
    { key: "warning", label: "Warning with message", status: "warning", helperText: "Double check the time" },
    { key: "helperText", label: "With helper text", helperText: "Business hours only", infoText: "Local time" },
    { key: "12h", label: "12-Hour Format", format: "12h", placeholder: "12:00:00 AM" }
];

const ControlledRangePicker = (props: IRangeTimePickerProps) => {
    const [value, setValue] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });

    const handleChange = (time: string, { field }: TimePickerRangeChangeContext) => {
        setValue((prev) => ({ ...prev, [field]: time }));
    };

    return <TimePicker.Range {...props} value={value} onChange={handleChange} />;
};

const ClearableRangePicker = (props: IRangeTimePickerProps) => (
    <TimePicker.Range {...props} placeholder={rangePlaceholder} clearable />
);

const rangePickerCases: RangePickerCase[] = [
    { key: "disabled", label: "Disabled", disabled: true, placeholder: rangePlaceholder },
    { key: "readOnly", label: "Read only", readOnly: true, placeholder: rangePlaceholder },
    { key: "required", label: "Required", required: true, placeholder: rangePlaceholder },
    {
        key: "controlled",
        label: "With controlled value",
        placeholder: rangePlaceholder,
        RenderComponent: ControlledRangePicker
    },
    {
        key: "clearable",
        label: "Clearable",
        placeholder: rangePlaceholder,
        RenderComponent: ClearableRangePicker
    },
    {
        key: "error",
        label: "Errored with message",
        status: "error",
        helperText: "Error message",
        placeholder: rangePlaceholder
    },
    { key: "12h", label: "12-Hour Format", format: "12h", placeholder: rangePlaceholder },
    {
        key: "bounds",
        label: "Start and end kept in order",
        placeholder: rangePlaceholder,
        defaultValue: { start: "09:00:00", end: "17:00:00" }
    }
];

/**
 * The range picker takes `{ start, end }` objects where the single picker takes strings, so its
 * stories override those controls.
 */
const rangeArgTypes = {
    placeholder: args({ control: "object", ...propCategory.appearance }),
    value: args({ control: "object", ...propCategory.functionality }),
    defaultValue: args({ control: "object", ...propCategory.functionality })
};

/**
 * `defaultValue` is only read when the component mounts, so the interactive stories remount it
 * when that control changes.
 */
export const Default: SingleStory = {
    render: ({ defaultValue, ...props }) => (
        <TimePicker key={String(defaultValue)} defaultValue={defaultValue} {...props} />
    )
};

export const Range: RangeStory = {
    render: ({ defaultValue, ...props }) => (
        <TimePicker.Range key={JSON.stringify(defaultValue)} defaultValue={defaultValue} {...props} />
    ),
    args: {
        label: "Choose time range",
        placeholder: rangePlaceholder,
        defaultValue: { start: "09:00:00", end: "17:00:00" }
    },
    argTypes: rangeArgTypes
};

export const SinglePickerStates: SingleStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {singlePickerCases.map(({ key, RenderComponent, ...item }) =>
                RenderComponent ? (
                    <RenderComponent {...props} {...item} key={key} />
                ) : (
                    <TimePicker {...props} {...item} key={key} />
                )
            )}
        </div>
    )
};

export const RangePickerStates: RangeStory = {
    render: (props) => (
        <div style={{ display: "flex", flex: 1, flexWrap: "wrap", gap: "2rem" }}>
            {rangePickerCases.map(({ key, RenderComponent, ...item }) => (
                <div key={key}>
                    {RenderComponent ? (
                        <RenderComponent {...props} {...item} />
                    ) : (
                        <TimePicker.Range {...props} {...item} />
                    )}
                </div>
            ))}
        </div>
    ),
    args: {
        placeholder: rangePlaceholder,
        defaultValue: { start: "09:00:00", end: "17:00:00" }
    },
    argTypes: rangeArgTypes
};
