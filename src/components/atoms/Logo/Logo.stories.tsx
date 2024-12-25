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
        type: args({ control: "select", ...propCategory.states }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        svg: args({ control: "false", ...propCategory.content }),
        markSvg: args({ control: "false", ...propCategory.content })
    },
    args: {
        type: "logotype",
        svg: LogoTypeSVG,
        markSvg: LogoMarkSVG,
        size: "medium",
        appearance: "brand"
    } as ILogoProps
};

export default meta;

const Template: FC<ILogoProps> = (props) => <Logo {...props} />;

export const Default = Template.bind({});

Default.args = {} as ILogoProps;
