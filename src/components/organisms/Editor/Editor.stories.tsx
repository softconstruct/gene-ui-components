import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Globe } from "@geneui/icons";

import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Helpers
import { editorContent, editorPresetColorsContent } from "../../../../stories/data/__editor";
// Components
import Editor, { IEditorProps } from "./index";

const PRESET_COLORS = ["#1F6F4A", "#C2185B", "#F4B400", "#512DA8"];

const meta: Meta<IEditorProps> = {
    title: "Organisms/Editor",
    component: Editor,
    argTypes: {
        defaultValue: args({ control: "text", ...propCategory.content }),
        placeholder: args({ control: "text", ...propCategory.content }),
        className: args({ control: "false", ...propCategory.appearance }),
        readOnly: args({ control: "boolean", ...propCategory.states }),
        onChange: args({ control: "false", ...propCategory.action }),
        presetColors: args({ control: "array", ...propCategory.content }),
        footerActions: args({ control: "array", ...propCategory.content }),
        id: args({ control: "text", ...propCategory.others }),
        "aria-label": args({ control: "text", ...propCategory.others })
    },
    args: {
        placeholder: "placeholder",
        readOnly: false,
        presetColors: []
    }
};

export default meta;

type Story = StoryObj<IEditorProps>;

export const Default: Story = {};

export const WithPresetColors: Story = {
    args: {
        defaultValue: editorPresetColorsContent,
        presetColors: PRESET_COLORS
    }
};

export const WithFooterActions: Story = {
    args: {
        defaultValue: editorContent,
        readOnly: true,
        footerActions: Array.from({ length: 5 }, (_, index) => ({
            id: `action-${index + 1}`,
            Icon: Globe,
            "aria-label": `Footer action ${index + 1}`,
            onClick: () => undefined
        }))
    }
};
