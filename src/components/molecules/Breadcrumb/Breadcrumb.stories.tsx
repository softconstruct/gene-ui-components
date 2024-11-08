import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Breadcrumb, { IBreadcrumbProps } from "./index";

const meta: Meta<typeof Breadcrumb> = {
    title: "Molecules/Breadcrumb",
    component: Breadcrumb,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Breadcrumb component argTypes
    },
    args: {
        // fill Breadcrumb component args
    } as IBreadcrumbProps
};

export default meta;

const Template: FC<IBreadcrumbProps> = (props) => <Breadcrumb {...props} />;

export const Default = Template.bind({});

Default.args = {} as IBreadcrumbProps;
