import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { fn } from "@storybook/test";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import OTPField, { IOTPFieldProps } from "./index";

const meta: Meta<IOTPFieldProps> = {
    title: "Molecules/OTPField",
    component: OTPField,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", options: ["large", "medium"], ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        status: args({ control: "select", options: ["rest", "error"], ...propCategory.states }),
        value: args({ control: "text", ...propCategory.content }),
        defaultValue: args({ control: "text", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        timerDuration: args({ control: "number", ...propCategory.functionality }),
        notification: args({ control: "text", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.action }),
        onComplete: args({ control: "false", ...propCategory.action }),
        onTimerExpire: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action })
    },
    args: {
        size: "large",
        helperText: "Code is valid for",
        timerDuration: 152,
        onChange: fn(),
        onComplete: fn(),
        onTimerExpire: fn(),
        onFocus: fn(),
        onBlur: fn()
    }
};

export default meta;

type Story = StoryObj<IOTPFieldProps>;

export const Default: Story = {};

export const ErrorWithNotification: Story = {
    args: {
        status: "error",
        notification: "The entered code is invalid."
    }
};

export const Activated: Story = {
    args: {
        value: "111111"
    }
};

export const Disabled: Story = {
    args: {
        disabled: true
    }
};

export const MediumSize: Story = {
    args: {
        size: "medium"
    }
};

const InteractiveStory: FC = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | undefined>();

    const handleComplete = (code: string) => {
        if (code === "123456") {
            setError(undefined);
        } else {
            setError("The entered code is invalid.");
        }
    };

    const handleTimerExpire = () => {
        setError("Code expired. Please resend.");
    };

    return (
        <OTPField
            value={value}
            onChange={setValue}
            onComplete={handleComplete}
            helperText="Code is valid for"
            timerDuration={30}
            onTimerExpire={handleTimerExpire}
            status={error ? "error" : "rest"}
            notification={error}
        />
    );
};

export const Interactive: Story = {
    render: () => <InteractiveStory />
};
