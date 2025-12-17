import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Globe, Magnifier } from "@geneui/icons";

// Components
import Avatar from "@components/atoms/Avatar";
import Divider, { IDividerProps } from "@components/atoms/Divider";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

const meta: Meta<IDividerProps> = {
    title: "Atoms/Divider",
    component: Divider,
    argTypes: {
        appearance: args({ control: "select", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        Icon: args({ control: "false", ...propCategory.content }),
        text: args({ control: "text", ...propCategory.content }),
        contentPosition: args({ control: "select", ...propCategory.appearance }),
        swappableElement: args({ control: "false", ...propCategory.content }),
        inset: args({ control: "boolean", ...propCategory.appearance }),
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        appearance: "brand",
        direction: "horizontal",
        text: "test",
        contentPosition: "before",
        Icon: Globe,
        swappableElement: <Avatar Icon={Magnifier} color="slate" />
    }
};

export default meta;

type Story = StoryObj<IDividerProps>;

const StoryComponent: FC<IDividerProps> = (props) => {
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
        swappableElement: undefined,
        contentPosition: "after"
    }
};
