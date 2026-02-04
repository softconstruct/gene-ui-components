import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import DatePicker, { IDatePickerProps } from "./index";
import Label from "@components/atoms/Label";

const meta: Meta<IDatePickerProps> = {
    title: "Molecules/DatePicker",
    component: DatePicker,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        withRange: args({ control: "boolean", ...propCategory.functionality }),
        clearable: args({ control: "boolean", ...propCategory.functionality }),
        format: args({ control: "text", ...propCategory.appearance }),
        withPreset: args({ control: "boolean", ...propCategory.functionality }),
        withApplyButton: args({ control: "boolean", ...propCategory.action }),
        applyButtonLabel: args({ control: "text", ...propCategory.content }),
        presetClassName: args({ control: "false", ...propCategory.appearance }),
        required: args({ control: "boolean", ...propCategory.validation }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        error: args({ control: "boolean", ...propCategory.states }),
        errorMessage: args({ control: "text", ...propCategory.content }),
        open: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        shouldDisableDate: args({ control: "false", ...propCategory.functionality }),
        onNextMonthClick: args({ control: "false", ...propCategory.functionality }),
        onPrevMonthClick: args({ control: "false", ...propCategory.functionality }),
        onYearChange: args({ control: "false", ...propCategory.functionality }),
        onClean: args({ control: "false", ...propCategory.functionality }),
        disabledPresets: args({ control: "false", ...propCategory.appearance }),
        presetSize: args({ control: "select", ...propCategory.appearance }),
        exludedDates: args({ control: "false", ...propCategory.functionality }),
    },
    args: {
        // fill DatePicker component args
    }
};

export default meta;

// Constants - cases
const nonInteractiveStates: Case[] = [
    { id: 1, key: "loading", loading: true, description: "Loading" },
    { id: 2, key: "disabled", disabled: true, description: "Disabled" },
    { id: 3, key: "readOnly", readOnly: true, description: "Read-only mode" },
    { id: 4, key: "errored", error: true, description: "Errored state" },
    {
        id: 5,
        key: "erroredWithMsg",
        error: true,
        errorMessage: "Date is not correct",
        description: "Errored state with error message"
    }
];

const minorCases: Case[] = [
    { id: 1, key: "clearable", clearable: true, description: "Picker with clearable ability" },
    { id: 2, key: "withPreset", withPreset: true, description: "Presets enabled" },
    {
        id: 3,
        key: "withApplyButton",
        withApplyButton: true,
        applyButtonLabel: "Confirm",
        description: "Changes applied after confirmation, with custom button label"
    }
];

type Story = StoryObj<IDatePickerProps>;

type Case = IDatePickerProps & {
    id: number;
    key: string;
    description: string;
};

const GrouppedStoriesWrapper = ({ cases }: { cases: Case[] }) => {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {cases.map((props) => (
                <div style={{ padding: 10, border: "1px solid black" }} key={props.key}>
                    <Label text={props.description} />
                    <br />
                    <hr />
                    <DatePicker {...props} />
                </div>
            ))}
        </div>
    );
};

export const Default: Story = {};

export const WithExcludedDates: Story = {
    render: (props) => <DatePicker {...props} />,
    args: {
        exludedDates: [{ date: new Date(), message: "Today's date is not selectable" }]
    }
};

export const RangePicker: Story = {
    render: (props) => <DatePicker {...props} />,
    args: {
        withRange: true
    }
};

export const NonInteractiveStates: Story = {
    render: () => <GrouppedStoriesWrapper cases={nonInteractiveStates} />
};

export const MinorCases: Story = {
    render: () => <GrouppedStoriesWrapper cases={minorCases} />
};
