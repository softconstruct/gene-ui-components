import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe, Search } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import Avatar from "../Avatar";
// Components
import Divider, { IDividerProps } from "./index";

const meta: Meta<IDividerProps> = {
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

type Story = StoryObj<IDividerProps>;

const StoryComponent: FC = (props) => {
    return (
        <div style={{ height: 220 }}>
            <Divider {...props} />
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponent {...props} />
};

export const Solid: Story = {
    render: (props) => <StoryComponent {...props} />,
    args: {
        Icon: null,
        content: undefined,
        labelPosition: "after"
    }
};
