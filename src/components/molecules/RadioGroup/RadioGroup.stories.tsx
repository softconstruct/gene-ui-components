import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import RadioGroup, { IRadioGroupProps } from "./index";

const meta: Meta<typeof RadioGroup> = {
    title: "Molecules/RadioGroup",
    component: RadioGroup,
    argTypes: {
        label: args({ control: "text", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        helperText: args({ control: "text", ...propCategory.content }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        type: args({ control: "select", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance })
        // fill RadioGroup component argTypes
    },
    args: {
        label: "Group Label",
        helperText: "Helper Text"
        // fill RadioGroup component args
    }
};

export default meta;

const Template: FC<IRadioGroupProps> = (props) => <RadioGroup {...props} />;

export const Default = Template.bind({});

Default.args = {} as IRadioGroupProps;
