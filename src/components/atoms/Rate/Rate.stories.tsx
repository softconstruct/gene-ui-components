import React, { FC } from "react";
import { Meta } from "@storybook/react";
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Rating, { IRateProps } from ".";

const meta: Meta<typeof Rating> = {
    title: "Atoms/Rate",
    component: Rating,
    argTypes: {
        defaultValue: args({ control: "number", defaultValue: 0, ...propCategory.content }),
        value: args({ control: "false", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.action }),
        count: args({ control: "number", defaultValue: 5, ...propCategory.appearance }),
        size: args({ control: "select", defaultValue: "small", ...propCategory.appearance }),
        iconType: args({ control: "select", ...propCategory.appearance }),
        readonly: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        halfAllow: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        disable: args({ control: "boolean", defaultValue: false, ...propCategory.states }),
        required: args({ control: "boolean", defaultValue: false, ...propCategory.states })
    },
    args: {
        count: 5,
        defaultValue: 0
    } as IRateProps
};
export default meta;

const Template: FC<IRateProps> = (props) => {
    return <Rating {...props} />;
};

export const Default = Template.bind({});
