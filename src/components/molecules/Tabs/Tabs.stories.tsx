import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Tabs, { ITabsProps } from "./index";

const meta: Meta<typeof Tabs> = {
    title: "Molecules/Tabs",
    component: Tabs,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Tabs component argTypes
    },
    args: {
        // fill Tabs component args
    } as ITabsProps
};

export default meta;

const Template: FC<ITabsProps> = (props) => <Tabs {...props} />;

export const Default = Template.bind({});

Default.args = {} as ITabsProps;
