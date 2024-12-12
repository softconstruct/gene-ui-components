import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Menu, { IMenuProps } from "./index";

const meta: Meta<typeof Menu> = {
    title: "Molecules/Menu",
    component: Menu,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Menu component argTypes
    },
    args: {
        // fill Menu component args
    } as IMenuProps
};

export default meta;

const Template: FC<IMenuProps> = (props) => <Menu {...props} />;

export const Default = Template.bind({});

Default.args = {} as IMenuProps;
