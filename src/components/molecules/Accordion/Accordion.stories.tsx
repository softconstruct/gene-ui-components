import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Pill } from "src";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import { AccordionItem, IAccordionItemProps } from "./index";

const meta: Meta<IAccordionItemProps> = {
    title: "Molecules/Accordion",
    component: AccordionItem,
    subcomponents: { Pill: Pill as React.ComponentType<unknown> },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        withIcon: args({ control: "boolean", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content }),
        actions: args({ control: "boolean", ...propCategory.content })
        // fill Accordion component argTypes
    },
    args: {
        title: "Accordion Item",
        withIcon: true,
        actions: true
        // fill Accordion component args
    }
};

export default meta;

type Story = StoryObj<IAccordionItemProps>;

export const Default: Story = {};
