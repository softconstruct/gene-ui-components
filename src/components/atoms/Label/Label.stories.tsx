import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Label, { ILabelProps } from "./index";

const meta: Meta<typeof Label> = {
    title: "Atoms/Label",
    component: Label,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        labelText: args({ control: "text", ...propCategory.content }),
        required: args({ control: "boolean", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        className: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        readOnly: args({ control: "false", ...propCategory.state })
    },
    args: {
        size: "medium",
        labelText: "label",
        required: false
    }
};

export default meta;

const Template: FC<ILabelProps> = (props) => <Label {...props} />;

export const Default = Template.bind({});

export const Required = Template.bind({});
Required.args = {
    required: true
} as ILabelProps;

export const WithInfo = Template.bind({});
WithInfo.args = {
    infoText: "Additional info for label"
} as ILabelProps;
