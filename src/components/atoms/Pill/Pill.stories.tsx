import React, { FC } from "react";
import { Meta } from "@storybook/react";
import { Globe } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Pill, { IPillProps } from "./index";

const meta: Meta<typeof Pill> = {
    title: "Atoms/Pill",
    component: Pill,
    argTypes: {
        size: args({ control: "select", ...propCategory.appearance }),
        color: args({ control: "select", ...propCategory.appearance }),
        Icon: args({ control: false, ...propCategory.content }),
        text: args({ control: "text", ...propCategory.content }),
        isFill: args({ control: "boolean", ...propCategory.appearance }),
        iconAlignment: args({ control: "select", ...propCategory.appearance }),
        withDot: args({ control: "boolean", ...propCategory.content }),
        className: args({ control: false, ...propCategory.appearance })
    },
    args: {
        size: "medium",
        color: "informative",
        isFill: true,
        text: "Pill",
        withDot: true
    }
};

export default meta;

const Template: FC<IPillProps> = (props) => <Pill {...props} />;

export const Default = Template.bind({});

export const WithCustomIcon = Template.bind({});

WithCustomIcon.args = {
    Icon: Globe
};
