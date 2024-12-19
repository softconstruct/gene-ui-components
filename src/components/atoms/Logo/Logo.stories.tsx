import React, { FC } from "react";
import { Meta } from "@storybook/react";

import LogoTypeSVG from "./LogoTypeSVG";
import LogoMarkSVG from "./LogoMarkSVG";

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
        type: args({ control: "false", ...propCategory.states }),
        appearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        type: "logotype",
        svg: LogoTypeSVG,
        size: "medium",
        appearance: "brand"
    } as ILogoProps
};

export default meta;

const Template: FC<ILogoProps> = (props) => <Logo {...props} />;

export const Default = Template.bind({});

export const LogoMark = Template.bind({});

LogoMark.args = {
    type: "logomark",
    svg: LogoMarkSVG
} as ILogoProps;

Default.args = {} as ILogoProps;
