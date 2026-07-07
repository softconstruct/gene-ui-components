import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Uploader, { IUploaderProps } from "./index";

const meta: Meta<IUploaderProps> = {
    title: "Organisms/Uploader",
    component: Uploader,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Uploader component argTypes
    },
    args: {
        // fill Uploader component args
    }
};

export default meta;

type Story = StoryObj<IUploaderProps>;

export const Default: Story = {};
