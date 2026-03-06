import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Editor, { IEditorProps } from "./index";

const meta: Meta<IEditorProps> = {
    title: "Molecules/Editor",
    component: Editor,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Editor component argTypes
    },
    args: {
        // fill Editor component args
    }
};

export default meta;

type Story = StoryObj<IEditorProps>;

export const Default: Story = {};
