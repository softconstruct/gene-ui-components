import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Accordion, { IAccordionProps } from "./index";

const meta: Meta<IAccordionProps> = {
    title: "Molecules/Accordion",
    component: Accordion,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        disabled: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        withIcon: args({ control: "boolean", ...propCategory.content }),
        title: args({ control: "text", ...propCategory.content })
        // fill Accordion component argTypes
    },
    args: {
        title: "Accordion Item",
        withIcon: true
        // fill Accordion component args
    }
};

export default meta;

type Story = StoryObj<IAccordionProps>;

export const Default: Story = {};
