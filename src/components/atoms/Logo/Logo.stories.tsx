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
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.states }),
        appearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        size: "medium",
        type: "logotype",
        appearance: "brand"
    } as ILogoProps
};

export default meta;

const Template: FC<ILogoProps> = (props) => <Logo {...props} />;

export const Default = Template.bind({});

export const LogoMark = Template.bind({});
LogoMark.args = {
    type: "logomark"
} as ILogoProps;

Default.args = {} as ILogoProps;
