import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Layout, { ILayoutProps } from "./index";

const meta: Meta<typeof Layout> = {
    title: "Atoms/Layout",
    component: Layout,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Layout component argTypes
    },
    args: {
        // fill Layout component args
    } as ILayoutProps
};

export default meta;

const Template: FC<ILayoutProps> = (props) => <Layout {...props} />;

export const Default = Template.bind({});

Default.args = {} as ILayoutProps;
