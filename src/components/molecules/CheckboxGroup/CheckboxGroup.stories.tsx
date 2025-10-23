import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import CheckboxGroup, { ICheckboxGroupProps } from "./index";

const meta: Meta<typeof CheckboxGroup> = {
    title: "Molecules/CheckboxGroup",
    component: CheckboxGroup,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        status: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance })
        // fill CheckboxGroup component argTypes
    },
    args: {
        label: "Group Label",
        helperText: "Helper Text"
        // fill CheckboxGroup component args
    } as ICheckboxGroupProps
};

export default meta;

const Template: FC<ICheckboxGroupProps> = (props) => <CheckboxGroup {...props} />;

export const Default = Template.bind({});

Default.args = {} as ICheckboxGroupProps;
