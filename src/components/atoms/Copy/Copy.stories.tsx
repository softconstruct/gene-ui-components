import React, { useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Copy, { ICopyProps } from "./index";

const meta: Meta<ICopyProps> = {
    title: "Molecules/Copy",
    component: Copy,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        copiedTooltipText: args({ control: "text", ...propCategory.content }),
        copyTooltipText: args({ control: "text", ...propCategory.content }),
        value: args({ control: "false", ...propCategory.functionality }),
        contentRef: args({ control: "false", ...propCategory.functionality }),
        disabled: args({ control: "boolean", ...propCategory.states })
    },
    args: {
        appearance: "primary",
        size: "large",
        copiedTooltipText: "Successfully copied!",
        copyTooltipText: "Copy"
    }
};

export default meta;

type Story = StoryObj<ICopyProps>;

export const Default: Story = {
    render: (props) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const ref = useRef<HTMLDivElement>(null);

        return (
            <>
                <div ref={ref}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat debitis a tempore magnam vero animi
                    cumque explicabo porro tempora quae facere pariatur facilis repudiandae sint, ratione iure libero
                    autem iusto.*
                </div>
                <Copy {...props} contentRef={ref} />
            </>
        );
    }
};

export const copyValue: Story = {
    render: (props) => {
        return <Copy {...props} />;
    },
    args: {
        value: "Text"
    },
    argTypes: {
        value: args({ control: "text", ...propCategory.content })
    }
};
