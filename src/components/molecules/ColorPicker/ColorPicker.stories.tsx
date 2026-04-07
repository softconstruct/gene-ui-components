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
        alphaValue: args({ control: "number", ...propCategory.content }),
        value: args({ control: "text", ...propCategory.content }),
        label: args({ control: "text", ...propCategory.content }),
        labelInfoText: args({ control: "text", ...propCategory.content }),
        size: args({ control: "select", ...propCategory.appearance }),
        placeholder: args({ control: "text", ...propCategory.content }),
        defaultColor: args({ control: "text", ...propCategory.content }),
        recentColors: args({ control: "object", ...propCategory.content }),
        onChange: args({ control: "false", ...propCategory.action }),
        open: args({ control: "boolean", ...propCategory.states }),
        format: args({ control: "select", ...propCategory.functionality }),
        onOutsideClick: args({ control: "false", ...propCategory.action })
    },
    args: {}
};

export default meta;

type Story = StoryObj<IColorPickerProps>;

export const Default: Story = {};

export const WithRecentColors: Story = {
    render: (props) => <ColorPicker {...props} />,
    args: {
        recentColors: ["", "#000000", "#ffff00", "#ff0000", "rgb(20, 50, 30)"],
        open: true,
        label: "Recent colors"
    }
};
