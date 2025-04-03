import React, { useContext } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Logo, { ILogoProps } from "./index";

const meta: Meta<ILogoProps> = {
    title: "Atoms/Logo",
    component: Logo,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.states }),
        appearance: args({ control: "select", ...propCategory.appearance })
    },
    args: {
        type: "logotype",
        size: "medium",
        appearance: "brand"
    }
};

export default meta;

type Story = StoryObj<ILogoProps>;

const LogoComponent = (props: ILogoProps) => {
    const { logo } = useContext(GeneUIDesignSystemContext);

    return <Logo {...props} svg={logo.svg} markSvg={logo.logomark} />;
};

export const Default: Story = {
    render: (props) => <LogoComponent {...props} />
};
