import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import QRCode, { IQRCodeProps } from "./index";

const meta: Meta<typeof QRCode> = {
    title: "Molecules/QRCode",
    component: QRCode,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        level: args({ control: "select", ...propCategory.appearance }),
        appearance: args({ control: "select", ...propCategory.appearance }),
        value: args({ control: "text", ...propCategory.content }),
        withLogo: args({ control: "boolean", ...propCategory.content }),
        Logo: args({ control: "false", ...propCategory.content })
    },
    args: {
        appearance: "brand",
        level: "M",
        value: "https://geneui-storybook.softconstruct.com/"
    }
};

export default meta;

type Story = StoryObj<IQRCodeProps>;

const StoryComponentWithLogo: FC<IQRCodeProps> = (props) => {
    return (
        <div style={{ maxWidth: "160px", width: "100%", height: "100%", maxHeight: "160px" }}>
            <QRCode {...props} withLogo />
        </div>
    );
};

export const Default: Story = {
    render: (props) => (
        <div style={{ maxWidth: "160px", width: "100%", height: "100%", maxHeight: "160px" }}>
            <QRCode {...props} />
        </div>
    )
};

export const WithLogo: Story = {
    render: (props) => <StoryComponentWithLogo {...props} withLogo />
};
