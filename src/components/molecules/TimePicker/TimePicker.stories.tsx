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
        size: args({
            control: "select",
            options: ["small", "medium", "large"],
            defaultValue: "medium",
            ...propCategory.appearance
        }),
        disabled: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        readOnly: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        required: args({ control: "boolean", defaultValue: false, ...propCategory.functionality }),
        placeholder: args({ control: "text", ...propCategory.appearance }),
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.functionality }),
        defaultValue: args({ control: "text", ...propCategory.functionality }),
        id: args({ control: "false", ...propCategory.others }),
        name: args({ control: "text", ...propCategory.others }),
        key: args({ control: "false", ...propCategory.functionality }),
        ref: args({ control: "false", ...propCategory.functionality }),
        clearable: args({ control: "boolean", defaultValue: false, ...propCategory.functionality }),
        onClear: args({ control: "false", ...propCategory.action }),
        status: args({
            control: "select",
            options: ["rest", "warning", "error"],
            defaultValue: "rest",
            ...propCategory.validation
        }),
        helperText: args({ control: "text", ...propCategory.validation }),
        onOpenChange: args({ control: "false", ...propCategory.action }),
        onChange: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onKeyDown: args({ control: "false", ...propCategory.action }),
        format: args({
            control: "select",
            options: ["24h", "12h"],
            defaultValue: "24h",
            ...propCategory.functionality
        }),
        localization: args({ control: "object", ...propCategory.content })
    },
    args: {
        label: "Choose time",
        placeholder: "Select time",
        localization: DEFAULT_LOCALIZATION
    }
};

const interactiveArgs = {
    size: "medium",
    format: "24h",
    status: "rest",
    clearable: false,
    disabled: false,
    readOnly: false,
    required: false
} as const;

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

const definedProps = <T extends object>(props: T): Partial<T> =>
    Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as Partial<T>;

const singleStoryStyle = { width: 300 } as const;
const rangeStoryStyle = { width: 460 } as const;
const casesStyle = { display: "flex", flexWrap: "wrap", gap: "2rem" } as const;

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
    { key: "12h", label: "12-Hour Format", format: "12h" }
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
    { key: "disabled", label: "Disabled", disabled: true },
    { key: "readOnly", label: "Read only", readOnly: true },
    { key: "required", label: "Required", required: true },
    { key: "controlled", label: "With controlled value", RenderComponent: ControlledRangePicker },
    { key: "clearable", label: "Clearable", RenderComponent: ClearableRangePicker },
    { key: "error", label: "Errored with message", status: "error", helperText: "Error message" },
    { key: "12h", label: "12-Hour Format", format: "12h" },
    { key: "bounds", label: "Start and end kept in order", defaultValue: { start: "09:00:00", end: "17:00:00" } }
];

const rangeArgTypes = {
    placeholder: args({
        control: "object",
        description: "Placeholder texts of the two inputs, as `{ start, end }`.",
        ...propCategory.appearance
    }),
    value: args({
        control: "object",
        description:
            "Values of the two inputs, as `{ start, end }` time strings. Providing it makes the component controlled, so it has to be updated from `onChange`.",
        ...propCategory.functionality
    }),
    defaultValue: args({
        control: "object",
        description: "Initial values of an uncontrolled component, as `{ start, end }` time strings.",
        ...propCategory.functionality
    })
};

/**
 * `defaultValue` is only read on mount, so the interactive stories remount when it changes.
 */
export const Default: SingleStory = {
    render: ({ defaultValue, ...props }) => (
        <div style={singleStoryStyle}>
            <TimePicker key={String(defaultValue)} defaultValue={defaultValue} {...props} />
        </div>
    ),
    args: { ...interactiveArgs, defaultValue: "" }
};

export const Range: RangeStory = {
    render: ({ defaultValue, ...props }) => (
        <div style={rangeStoryStyle}>
            <TimePicker.Range key={JSON.stringify(defaultValue)} defaultValue={defaultValue} {...props} />
        </div>
    ),
    args: {
        ...interactiveArgs,
        label: "Choose time range",
        placeholder: rangePlaceholder,
        defaultValue: { start: "09:00:00", end: "17:00:00" }
    },
    argTypes: rangeArgTypes
};

export const SinglePickerStates: SingleStory = {
    render: ({ label, ...props }) => {
        const controls = definedProps(props);

        return (
            <div style={casesStyle}>
                {singlePickerCases.map(({ key, RenderComponent, ...item }) => (
                    <div key={`${key}-${String(controls.defaultValue)}`} style={singleStoryStyle}>
                        {RenderComponent ? (
                            <RenderComponent {...item} {...controls} label={label || item.label} />
                        ) : (
                            <TimePicker {...item} {...controls} label={label || item.label} />
                        )}
                    </div>
                ))}
            </div>
        );
    },
    args: { label: "" }
};

export const RangePickerStates: RangeStory = {
    render: ({ label, ...props }) => {
        const controls = definedProps(props);

        return (
            <div style={casesStyle}>
                {rangePickerCases.map(({ key, RenderComponent, ...item }) => (
                    <div key={`${key}-${JSON.stringify(controls.defaultValue)}`} style={rangeStoryStyle}>
                        {RenderComponent ? (
                            <RenderComponent {...item} {...controls} label={label || item.label} />
                        ) : (
                            <TimePicker.Range {...item} {...controls} label={label || item.label} />
                        )}
                    </div>
                ))}
            </div>
        );
    },
    args: {
        label: "",
        placeholder: rangePlaceholder
    },
    argTypes: rangeArgTypes
};
