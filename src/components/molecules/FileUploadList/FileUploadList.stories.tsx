import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import FileUploadList, { IFileUploadListProps } from "./index";

const meta: Meta<IFileUploadListProps> = {
    title: "Molecules/FileUploadList",
    component: FileUploadList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill FileUploadList component argTypes
    },
    args: {
        // fill FileUploadList component args
    }
};

export default meta;

type Story = StoryObj<IFileUploadListProps>;

export const Default: Story = {};
