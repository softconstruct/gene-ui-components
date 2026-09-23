import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Editor, { IEditorProps } from "./index";

const meta: Meta<IEditorProps> = {
    title: "Organisms/Editor",
    component: Editor,
    argTypes: {
        defaultValue: args({ control: "false", ...propCategory.content }),
        placeholder: args({ control: "text", ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        id: args({ control: "text", ...propCategory.others }),
        "aria-label": args({ control: "text", ...propCategory.others }),
        ref: args({ control: "false", ...propCategory.others }),
        key: args({ control: "false", ...propCategory.others })
    },
    args: {
        placeholder: "Start writing...",
        readOnly: false
    }
};

export default meta;

type Story = StoryObj<IEditorProps>;

export const Default: Story = {};
