import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import ColorPicker, { IColorPickerProps } from "./index";

const meta: Meta<IColorPickerProps> = {
    title: "Molecules/ColorPicker",
    component: ColorPicker,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        alphaEnabled: args({ control: "boolean", ...propCategory.functionality }),
        alphaValue: args({ control: "text", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.content }),
        defaultColor: args({ control: "text", ...propCategory.content }),
        recentColors: args({ control: "false", ...propCategory.content }),
        colorPickerProps: args({ control: "false", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.action }),
        open: args({ control: "boolean", ...propCategory.functionality }),
        format: args({ control: "select", ...propCategory.functionality }),
        onOutsideClick: args({ control: "false", ...propCategory.action })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IColorPickerProps>;

export const Default: Story = {};

export const WithRecentColors: Story = {
    render: (props) => {
        return (
            <div style={{ width: "100%" }}>
                <ColorPicker {...props} />
            </div>
        );
    },
    args: {
        recentColors: ["#000000", "#ffff00", "#ff0000"]
    }
};
