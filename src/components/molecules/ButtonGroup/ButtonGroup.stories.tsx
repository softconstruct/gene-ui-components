import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import ButtonGroup, { IButtonGroupProps } from "./index";

const meta: Meta<typeof ButtonGroup> = {
    title: "Molecules/ButtonGroup",
    component: ButtonGroup,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill ButtonGroup component argTypes
    },
    args: {
        // fill ButtonGroup component args
    } as IButtonGroupProps
};

export default meta;

const Template: FC<IButtonGroupProps> = (props) => <ButtonGroup {...props} />;

export const Default = Template.bind({});

Default.args = {} as IButtonGroupProps;
