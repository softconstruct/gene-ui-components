import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Editor, { IEditorProps } from "./index";

const meta: Meta<IEditorProps> = {
    title: "Organisms/Editor",
    component: Editor,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        defaultValue: args({ control: "false", ...propCategory.others }),
        placeholder: args({ control: "false", ...propCategory.others }),
        readOnly: args({ control: "false", ...propCategory.others }),
        autofocus: args({ control: "false", ...propCategory.others }),
        onChange: args({ control: "false", ...propCategory.others }),
        footerActions: args({ control: "false", ...propCategory.others })
    },
    args: {
        className: "fill the className prop value",
        defaultValue: "fill the defaultValue prop value",
        placeholder: "fill the placeholder prop value",
        readOnly: "fill the readOnly prop value",
        autofocus: "fill the autofocus prop value",
        onChange: "fill the onChange prop value",
        footerActions: "fill the footerActions prop value"
    }
};

export default meta;

type Story = StoryObj<IEditorProps>;

export const Default: Story = {};
