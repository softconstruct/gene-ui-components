import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ImagePreview, { IImagePreviewProps } from "./index";

const meta: Meta<IImagePreviewProps> = {
    title: "Molecules/ImagePreview",
    component: ImagePreview,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill ImagePreview component argTypes
    },
    args: {
        // fill ImagePreview component args
    }
};

export default meta;

type Story = StoryObj<IImagePreviewProps>;

export const Default: Story = {};
