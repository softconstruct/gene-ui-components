import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import Label from "@components/atoms/Label";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import TimePicker, { ITimePickerProps } from "./index";

const meta: Meta<ITimePickerProps> = {
    title: "Molecules/TimePicker",
    component: TimePicker,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states }),
        pickerFieldClassName: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        error: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.states }),
        errorMessage: args({ control: "text", ...propCategory.content }),
        format: args({ control: "text", ...propCategory.validation }),
        label: args({ control: "text", ...propCategory.content }),
        showMeridiem: args({ control: "boolean", ...propCategory.functionality }),
        mode: args({ control: "select", ...propCategory.functionality }),
        size: args({ control: "select", ...propCategory.appearance }),
        value: args({ control: "text", ...propCategory.functionality }),
        defaultValue: args({ control: "text", ...propCategory.functionality }),
        placeholder: args({ control: "text", ...propCategory.appearance }),
        hourHeaderText: args({ control: "text", ...propCategory.content }),
        minuteHeaderText: args({ control: "text", ...propCategory.content }),
        secondHeaderText: args({ control: "text", ...propCategory.content }),
        onClean: args({ control: "false", ...propCategory.functionality }),
        // onSelect: args({ control: "false", ...propCategory.functionality }),
        onOpen: args({ control: "false", ...propCategory.functionality }),
        onClose: args({ control: "false", ...propCategory.functionality }),
        onFocus: args({ control: "false", ...propCategory.functionality })
    },
    args: {
        format: "HH:mm:ss",
        onClose: () => {}
        // fill TimePicker component args
    }
};

export default meta;

type Case = ITimePickerProps & {
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
                    <TimePicker {...props} />
                </div>
            ))}
        </div>
    );
};

type Story = StoryObj<ITimePickerProps>;

export const Default: Story = {};

const states = [
    { id: 1, key: "Loading", description: "Loading", loading: true },
    { id: 2, key: "Read-only", description: "Read-only", value: "00:30:24", readOnly: true },
    { id: 3, key: "Disabled", description: "Disabled", disabled: true },
    { id: 4, key: "Errored", description: "Errored", error: true },
    {
        id: 5,
        key: "Errored with message",
        description: "Errored with message",
        error: true,
        errorMessage: "Error description"
    },
    { id: 6, key: "Required", description: "Required", required: true }
];

const singlePickerStates = [
    { id: 1, key: "Small size", description: "Small size", size: "small" },
    { id: 2, key: "Default value", description: "With default value", value: "00:30:24" },
    { id: 3, key: "With meridiem", description: "With meridiem", showMeridiem: true }
];

const rangePickerStates = [
    { id: 1, key: "Small size", description: "Small size", mode: "range", size: "small" },
    { id: 3, key: "With meridiem", description: "With meridiem", mode: "range", showMeridiem: true }
];

export const States: Story = {
    render: () => <GrouppedStoriesWrapper cases={states} />
};

export const SinglePicker: Story = {
    // @ts-expect-error remove this
    render: () => <GrouppedStoriesWrapper cases={singlePickerStates} />
};

export const RangePicker: Story = {
    // @ts-expect-error remove this
    render: () => <GrouppedStoriesWrapper cases={rangePickerStates} />
};
