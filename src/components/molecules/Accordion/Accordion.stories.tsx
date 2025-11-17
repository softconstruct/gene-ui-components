import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Accordion from "./Accordion";
import { AccordionItem, IAccordionItemProps } from "./index";

const meta: Meta<IAccordionItemProps> = {
    title: "Molecules/Accordion",
    component: AccordionItem,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
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

export const Default: Story = {
    render: (props) => (
        <Accordion size="large">
            <AccordionItem {...props} />
        </Accordion>
    )
};
