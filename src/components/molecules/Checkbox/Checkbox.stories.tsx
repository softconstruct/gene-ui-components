import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Checkbox, { ICheckboxProps } from "./index";

const meta: Meta<typeof Checkbox> = {
    title: "Molecules/Checkbox",
    component: Checkbox,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        infoText: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        checked: args({ control: "boolean", ...propCategory.states }),
        defaultChecked: args({ control: "boolean", ...propCategory.states }),
        indeterminate: args({ control: "boolean", ...propCategory.states }),
        required: args({ control: "boolean", ...propCategory.content }),
        helperText: args({ control: "text", ...propCategory.content }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        type: args({ control: "select", ...propCategory.appearance }),
        vertical: args({ control: "boolean", ...propCategory.appearance }),
        autoFocus: args({ control: "boolean", ...propCategory.functionality }),
        name: args({ control: "text", ...propCategory.others }),
        onChange: args({ control: "false", ...propCategory.action }),
        onBlur: args({ control: "false", ...propCategory.action }),
        onFocus: args({ control: "false", ...propCategory.action }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        label: "Label",
        infoText: "info text",
        helperText: "helper text"
    } as ICheckboxProps
};

export default meta;

const Template: FC<ICheckboxProps> = (props) => <Checkbox {...props} />;

export const Default = Template.bind({});

Default.args = {} as ICheckboxProps;
