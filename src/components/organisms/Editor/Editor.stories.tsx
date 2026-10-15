import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Globe } from "@geneui/icons";

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
        presetColors: args({ control: "object", ...propCategory.content }),
        footerActions: args({ control: "false", ...propCategory.content }),
        id: args({ control: "text", ...propCategory.others }),
        "aria-label": args({ control: "text", ...propCategory.others })
    },
    args: {
        placeholder: "Start writing...",
        readOnly: false
    }
};

export default meta;

type Story = StoryObj<IEditorProps>;

const StoryWrapper = (props: IEditorProps) => (
    <div style={{ height: "240px" }}>
        <Editor {...props} />
    </div>
);

export const Default: Story = {
    render: (props) => <StoryWrapper {...props} />
};

export const WithFooterActions: Story = {
    args: {
        footerActions: Array.from({ length: 5 }, (_, index) => ({
            id: `action-${index + 1}`,
            Icon: Globe,
            "aria-label": `Footer action ${index + 1}`,
            onClick: () => undefined
        }))
    },
    render: (props) => <StoryWrapper {...props} />
};
