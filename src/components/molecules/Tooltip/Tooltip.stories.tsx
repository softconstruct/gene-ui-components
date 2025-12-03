import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Info } from "@geneui/icons";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import HelperText from "../../atoms/HelperText";
// Components
import TooltipComponent, { ITooltipProps } from "./index";

const meta: Meta<ITooltipProps> = {
    title: "Molecules/Tooltip",
    component: TooltipComponent,
    argTypes: {
        text: args({ control: "text", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content }),
        padding: args({ control: "number", ...propCategory.appearance }),
        alwaysShow: args({ control: "boolean", ...propCategory.states }),
        customPosition: args({ control: "object", ...propCategory.functionality }),
        isVisible: args({ control: "boolean", ...propCategory.functionality }),
        position: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        Icon: args({ control: "false", ...propCategory.content })
    },
    args: {
        isVisible: true,
        alwaysShow: false,
        position: "top-center",
        text: "Tooltip some text",
        appearance: "default",
        padding: 10,
        Icon: Info
    }
};

export default meta;

type Story = StoryObj<ITooltipProps>;

export const WithIcons: Story = {
    render: (props) => {
        return (
            <div style={{ height: "200px", padding: "200px 300px" }}>
                <TooltipComponent {...props}>
                    <HelperText text="hover for tooltip" status="warning" />
                </TooltipComponent>
            </div>
        );
    }
};
