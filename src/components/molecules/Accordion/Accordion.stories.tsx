import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Accordion, { IAccordionProps } from "./index";

const meta: Meta<IAccordionProps> = {
    title: "Molecules/Accordion",
    component: Accordion,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Accordion component argTypes
    },
    args: {
        // fill Accordion component args
    }
};

export default meta;

type Story = StoryObj<IAccordionProps>;

export const Default: Story = {};
