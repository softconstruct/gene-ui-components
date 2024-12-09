import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Badge, { IBadgeProps } from "./index";

const meta: Meta<typeof Badge> = {
    title: "Atoms/Badge",
    component: Badge,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Badge component argTypes
    },
    args: {
        // fill Badge component args
    } as IBadgeProps
};

export default meta;

const Template: FC<IBadgeProps> = (props) => <Badge {...props} />;

export const Default = Template.bind({});

Default.args = {} as IBadgeProps;
