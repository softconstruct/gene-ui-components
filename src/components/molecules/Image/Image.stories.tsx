import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Image, { IImageProps } from "./index";

const meta: Meta<IImageProps> = {
    title: "Molecules/Image",
    component: Image,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Image component argTypes
    },
    args: {
        // fill Image component args
    }
};

export default meta;

type Story = StoryObj<IImageProps>;

export const Default: Story = {};
