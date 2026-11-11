import React, { ComponentType, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Constants
import { DEFAULT_LOCALIZATION } from "./constants";
// Components
import DatePicker, {
    DatePickerPreset,
    DatePickerRangePreset,
    IRangeDatePickerProps,
    ISingleDatePickerProps,
    RangeDatePicker
} from "./index";

const meta: Meta<typeof DatePicker> = {
    title: "Molecules/DatePicker",
    component: DatePicker,
    subcomponents: {
        RangeDatePicker: RangeDatePicker as unknown as ComponentType<unknown>
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
        loading: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
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
        format: args({ control: "text", defaultValue: "DD/MM/YYYY", ...propCategory.functionality }),
        locale: args({ control: "text", defaultValue: "en-US", ...propCategory.content }),
        min: args({ control: "text", ...propCategory.functionality }),
        max: args({ control: "text", ...propCategory.functionality }),
        presets: args({ control: "object", ...propCategory.functionality }),
        localization: args({ control: "object", ...propCategory.content })
    },
    args: {
        label: "Choose date",
        placeholder: "Select date",
        localization: DEFAULT_LOCALIZATION
    }
};

const interactiveArgs = {
    size: "medium",
    format: "DD/MM/YYYY",
    status: "rest",
    clearable: false,
    disabled: false,
    readOnly: false,
    loading: false,
    required: false
} as const;

export default meta;

type SingleStory = StoryObj<typeof DatePicker>;
type RangeStory = StoryObj<typeof DatePicker.Range>;

type SinglePickerCase = {
    key: string;
    RenderComponent?: (props: ISingleDatePickerProps) => React.JSX.Element;
} & ISingleDatePickerProps;

type RangePickerCase = {
    key: string;
    RenderComponent?: (props: IRangeDatePickerProps) => React.JSX.Element;
} & IRangeDatePickerProps;

const definedProps = <T extends object>(props: T): Partial<T> =>
    Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as Partial<T>;

const singleStoryStyle = { width: 300 } as const;
const rangeStoryStyle = { width: 460 } as const;
const casesStyle = { display: "flex", flexWrap: "wrap", gap: "2rem" } as const;

const rangePlaceholder = { start: "Start date", end: "End date" };

/**
 * The same day `months` months before an ISO date, or the last day of that month when it is shorter.
 */
const monthsBefore = (date: string, months: number): string => {
    const [year, month, day] = date.split("-").map(Number);
    const target = new Date(Date.UTC(year, month - 1 - months, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();

    target.setUTCDate(Math.min(day, lastDay));

    return target.toISOString().slice(0, 10);
};

// The presets of the design, counted from today: numbers are days from today.
const singlePresets: DatePickerPreset[] = [
    { label: "Today", value: 0 },
    { label: "Yesterday", value: -1 },
    { label: "7 days ago", value: -7 },
    { label: "14 days ago", value: -14 },
    { label: "1 month ago", value: (today) => monthsBefore(today, 1) }
];

const rangePresets: DatePickerRangePreset[] = [
    { label: "Today", value: { start: 0, end: 0 } },
    { label: "Yesterday", value: { start: -1, end: -1 } },
    { label: "Last 7 days", value: { start: -6, end: 0 } },
    { label: "Last 14 days", value: { start: -13, end: 0 } },
    { label: "Last 30 days", value: { start: -29, end: 0 } },
    { label: "1 month ago", value: (today) => ({ start: monthsBefore(today, 1), end: today }) }
];

// Each kind of value: days from today, a function of today and fixed ISO dates.
const customRangePresets: DatePickerRangePreset[] = [
    { label: "Last 11 days", value: { start: -10, end: 0 } },
    { label: "This month", value: (today) => ({ start: `${today.slice(0, 8)}01`, end: today }) },
    { label: "Q1 2026", value: { start: "2026-01-01", end: "2026-03-31" } }
];

const ClearableSinglePicker = (props: ISingleDatePickerProps) => (
    <DatePicker {...props} defaultValue="2026-03-09" clearable />
);

const ControlledSinglePicker = (props: ISingleDatePickerProps) => {
    const [value, setValue] = useState<string | null>("2026-03-09");

    return <DatePicker {...props} value={value} onChange={(event) => setValue(event.target.value)} />;
};

const UncontrolledSinglePicker = (props: ISingleDatePickerProps) => <DatePicker {...props} defaultValue="2026-03-09" />;

const singlePickerCases: SinglePickerCase[] = [
    { key: "disabled", label: "Disabled", disabled: true },
    { key: "readOnly", label: "Read only", readOnly: true, defaultValue: "2026-03-09" },
    { key: "required", label: "Required", required: true },
    { key: "controlled", label: "With controlled value", RenderComponent: ControlledSinglePicker },
    { key: "uncontrolled", label: "With default value", RenderComponent: UncontrolledSinglePicker },
    { key: "clearable", label: "Clearable", RenderComponent: ClearableSinglePicker },
    { key: "error", label: "Errored with message", status: "error", helperText: "Error message" },
    { key: "warning", label: "Warning with message", status: "warning", helperText: "Double check the date" },
    { key: "helperText", label: "With helper text", helperText: "Working days only", infoText: "Local date" },
    { key: "format", label: "MM/DD/YYYY format", format: "MM/DD/YYYY", defaultValue: "2026-03-09" },
    { key: "customFormat", label: "YYYY年MM月DD日 format", format: "YYYY年MM月DD日", defaultValue: "2026-03-09" },
    {
        key: "bounds",
        label: "Only March 2026",
        min: "2026-03-01",
        max: "2026-03-31",
        defaultValue: "2026-03-09"
    },
    { key: "locale", label: "German names", locale: "de-DE", defaultValue: "2026-03-09" },
    { key: "presets", label: "With presets", presets: singlePresets },
    { key: "loading", label: "Loading", loading: true, helperText: "Working days only" }
];

const ControlledRangePicker = (props: IRangeDatePickerProps) => {
    const [value, setValue] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });

    return <DatePicker.Range {...props} value={value} onChange={(_event, nextValue) => setValue(nextValue)} />;
};

const ClearableRangePicker = (props: IRangeDatePickerProps) => (
    <DatePicker.Range
        {...props}
        placeholder={rangePlaceholder}
        defaultValue={{ start: "2026-03-09", end: "2026-03-13" }}
        clearable
    />
);

const rangePickerCases: RangePickerCase[] = [
    { key: "disabled", label: "Disabled", disabled: true },
    { key: "readOnly", label: "Read only", readOnly: true, defaultValue: { start: "2026-03-09", end: "2026-03-13" } },
    { key: "required", label: "Required", required: true },
    { key: "controlled", label: "With controlled value", RenderComponent: ControlledRangePicker },
    { key: "clearable", label: "Clearable", RenderComponent: ClearableRangePicker },
    { key: "error", label: "Errored with message", status: "error", helperText: "Error message" },
    {
        key: "bounds",
        label: "Within the first quarter of 2026",
        min: "2026-01-01",
        max: "2026-03-31",
        defaultValue: { start: "2026-02-02", end: "2026-02-27" }
    },
    {
        key: "acrossMonths",
        label: "Across two months",
        defaultValue: { start: "2026-03-23", end: "2026-04-06" }
    },
    {
        key: "format",
        label: "YYYY.MM.DD format",
        format: "YYYY.MM.DD",
        defaultValue: { start: "2026-03-09", end: "2026-03-13" }
    },
    { key: "presets", label: "With presets", presets: rangePresets },
    { key: "customPresets", label: "With custom presets", presets: customRangePresets },
    { key: "loading", label: "Loading", loading: true, helperText: "Up to 30 days" }
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
            "Values of the two inputs, as `{ start, end }` ISO dates. Providing it makes the component controlled, so it has to be updated from `onChange`.",
        ...propCategory.functionality
    }),
    defaultValue: args({
        control: "object",
        description: "Initial values of an uncontrolled component, as `{ start, end }` ISO dates.",
        ...propCategory.functionality
    })
};

/**
 * `defaultValue` is only read on mount, so the interactive stories remount when it changes; the
 * two dates of a range value make up its key.
 */
const rangeValueKey = (value?: IRangeDatePickerProps["defaultValue"]): string =>
    `${value?.start ?? ""}-${value?.end ?? ""}`;

export const Default: SingleStory = {
    render: ({ defaultValue, ...props }) => (
        <DatePicker key={String(defaultValue)} defaultValue={defaultValue} {...props} />
    ),
    args: { ...interactiveArgs, defaultValue: "" }
};

export const Range: RangeStory = {
    render: ({ defaultValue, ...props }) => (
        <DatePicker.Range key={rangeValueKey(defaultValue)} defaultValue={defaultValue} {...props} />
    ),
    args: {
        ...interactiveArgs,
        label: "Choose dates",
        placeholder: rangePlaceholder,
        defaultValue: { start: "2026-03-09", end: "2026-03-13" }
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
                            <DatePicker {...item} {...controls} label={label || item.label} />
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
                    <div key={`${key}-${rangeValueKey(controls.defaultValue)}`} style={rangeStoryStyle}>
                        {RenderComponent ? (
                            <RenderComponent {...item} {...controls} label={label || item.label} />
                        ) : (
                            <DatePicker.Range {...item} {...controls} label={label || item.label} />
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
