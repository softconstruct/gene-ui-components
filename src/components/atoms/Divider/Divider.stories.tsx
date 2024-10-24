import React, { FC } from "react";
import { Meta } from "@storybook/react";
import { Globe, Search } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Divider, { IDividerProps } from "./index";
import Avatar from "../Avatar";

const meta: Meta<typeof Divider> = {
    title: "Atoms/Divider",
    component: Divider,
    argTypes: {
        appearance: args({ control: "select", ...propCategory.appearance }),
        vertical: args({ control: "boolean", ...propCategory.appearance }),
        Icon: args({ control: "false", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        labelPosition: args({ control: "select", ...propCategory.appearance }),
        content: args({ control: "false", ...propCategory.content }),
        inset: args({ control: "boolean", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        appearance: "brand",
        vertical: false,
        label: "test",
        labelPosition: "before",
        Icon: Globe,
        content: <Avatar Icon={Search} color="slate" />
    }
};

export default meta;

const Template: FC<IDividerProps> = (props) => (
    <div style={{ height: 220 }}>
        <Divider {...props} />
    </div>
);

export const Default = Template.bind({});

const WithAlignContentComponent: FC<IDividerProps> = (props) => (
    <div style={{ height: 220 }}>
        <Divider {...props} />
    </div>
);

export const Solid = WithAlignContentComponent.bind({});

Solid.args = {
    Icon: null,
    content: undefined,
    labelPosition: "after"
} as IDividerProps;
