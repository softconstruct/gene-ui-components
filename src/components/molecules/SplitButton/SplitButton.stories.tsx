import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { ArrowRight, ChevronDoubleRight, Download, Expand, Maximize, OpenInNew, RecycleBin } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import { ISplitButtonProps, SplitButton } from "./index";

const meta: Meta<ISplitButtonProps> = {
    title: "Molecules/SplitButton",
    component: SplitButton,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        type: args({ control: "select", ...propCategory.appearance }),
        items: args({ control: "array", ...propCategory.content }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        loading: args({ control: "boolean", ...propCategory.states }),
        onSelect: args({ control: "false", ...propCategory.action })
    },
    args: {
        items: [
            { title: "Replay", Icon: ArrowRight, id: "eeee" },
            { title: "Forward", Icon: ChevronDoubleRight, id: "ewewwe" },
            { title: "Download", Icon: Download, id: "dgh" },
            { title: "Delete", Icon: RecycleBin, id: "dfdfdf" }
        ]
    }
};

export default meta;

type Story = StoryObj<ISplitButtonProps>;

export const Default: Story = {
    render: (props) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <SplitButton {...props} />
        </div>
    )
};

export const OnlyIcons: Story = {
    render: (props) => <SplitButton {...props} />,
    args: {
        items: [
            { Icon: Expand, id: 1 },
            { Icon: OpenInNew, id: 2 },
            { Icon: Download, id: 3 },
            {
                Icon: Maximize,
                id: 4
            }
        ]
    }
};

export const OnlyText: Story = {
    render: (props) => <SplitButton {...props} />,
    args: {
        items: [
            { title: "Replay", id: 99 },
            { title: "Forward", id: 32 },
            {
                title: "Download",
                id: 3445
            },
            { title: "Delete", id: 454 }
        ]
    }
};

export const OneItem: Story = {
    render: (props) => <SplitButton {...props} />,
    args: {
        items: [{ title: "Replay", Icon: ArrowRight, id: "Replay" }]
    }
};
