import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Logo, { ILogoProps } from "./index";

const meta: Meta<typeof Logo> = {
    title: "Atoms/Logo",
    component: Logo,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Logo component argTypes
    },
    args: {
        // fill Logo component args
    } as ILogoProps
};

export default meta;

const Template: FC<ILogoProps> = (props) => <Logo {...props} />;

export const Default = Template.bind({});

Default.args = {} as ILogoProps;
